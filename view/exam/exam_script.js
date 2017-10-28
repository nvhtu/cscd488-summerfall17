/**
 * Exam page script
 * @author: Tu Nguyen
 * @version: 1.0
 */

var _userId = "";
var _userType = "";
var _userSessionId = "";

var _settings;

var _targetModal = "detail-modal";
var _tableId = "main-table";
var _formId = "main-form";

var _locData = Array();
var _catData = Array();
var _graderData = Array();

var _selectedTab = "Open";



/*var _deletedExamCats;
var _modifiedExamCats;*/
var _catSectionModified;

$(document).ready(loaded);

function loaded() {
    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");

    

    $("a[href='#Open-panel']").click(function(){getAllItems("Open"); _selectedTab = "Open";});
    $("a[href='#In_Progress-panel']").click(function(){getAllItems("In_Progress"); _selectedTab = "In_Progress";});
    $("a[href='#Grading-panel']").click(function(){getAllItems("Grading"); _selectedTab = "Grading";});
    $("a[href='#Archived-panel']").click(function(){getAllItems("Archived"); _selectedTab = "Archived";});
    $("a[href='#Hidden-panel']").click(function(){getAllItems("Hidden"); _selectedTab = "Hidden";});

    $("#create-button").click(onclickCreate);
}


function init()
{

    var URLPage = getURLParameter("page");
    if(URLPage == "teacher_exam")
    {
        _userType = "Teacher";
    }
    else if(URLPage == "admin_exam")
    {
        _userType = "Admin";
    }

    $.get("../settings/get_settings.php", {
        requester_id: _userId,
        requester_type: _userType
        }, function(data){_settings = data;}, "json");

    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    $(".msg-box").hide();
    
    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
            console.log(jqxhr.responseText);
            $(".msg-box").addClass("alert-danger");
            $(".msg-box").fadeIn();
            $("#msg-box-text").html("<strong>Error!</strong> " + jqxhr.responseText);
    });

    getAllLoc();
    getAllCat();
    getAllGraders();

    buildTable();

    $(".main-table>thead th").not("th:last-of-type")
     .click(onClickSort)
     .mousedown(function(e){ e.preventDefault(); });

     
}

function buildTable()
{
    headersArr = ["Name", "Date", "Start Time", "Location", "Action"];

    var table = buildMainTable(headersArr);
    $(".tab-pane>.table-responsive").html(table);

    getAllItems("Open");
}

function buildItemSummaryRow(item)
{
    var locName = "";

    $.each(_locData, function(i,locItem){
        if(item.location == locItem.loc_id)
        {
            locName = locItem.name;
        }
    });

    var summaryData = {
        id: item.exam_id,
        name: item.name,
        date: item.date,
        start_time: item.start_time,
        location: locName
    };

    var row = buildItemRow(summaryData, true);
    return row;
}

function loadTable(data, state) 
{
    $("#" + state + "-panel > .table-responsive > ."+_tableId + " tbody").empty();

    $.each(data, function(i, item) {
        var row = buildItemSummaryRow(item);
      //   var detailRow = buildItemDetailRow(item);

        $("#" + item.state + "-panel > .table-responsive > ." + _tableId).append(row);
      //   $("#" + item.state + "-panel > .table-responsive > ." + _tableId).append(detailRow);
    });
    //$(".tab-pane.active .main-table>thead th:nth-of-type(1)").trigger('click');
}

function submitForm(e) {
   var tab = e.currentTarget.dataset["tab"],
   action = e.currentTarget.dataset["action"];

   if (tab === "exam") {
      if (action === "create") {
         createItem();
      }
      else if (action === "update") {
         updateItem();
      }
   }
   else if (tab === "report") {
	  $.get("../ape/get_all_apes.php", 
	  {requester_id: _userId,
	  requester_type: _userType,
	  requester_session_id: _userSessionId,
	  request: "get_by_id",
	  exam_id: $("#item-id").val()}, 
	  function(item){
		$.get("../ape/get_exam_roster.php", 
		{requester_id: _userId,
		requester_type: _userType,
		requester_session_id: _userSessionId,
		exam_id: item[0].exam_id,
		get_grade: 1}, 
		function(rosterData){
			onclickDownload(rosterData, item[0]);
		},
		"json");
	  },
	  "json");
   }
}

function onclickCreate()
{
    clearForm();
    $('a[href="#Exam_tab"]').tab('show');
    $("#modal-title").html("Create an Exam");
    $("#submit-button").attr("data-action", "create");
    $("#submit-button").attr("data-tab", "exam");
	$("#submit-button").html("Create");
    $('a[href="#Report_tab"]').add('a[href="#Roster_tab"]').parent().toggleClass('hidden', true);
    
    //Hide In-Progress, Grading and Archived options on Create an exam
    $('select[name="state"] option[value="In_Progress"]').hide();
    $('select[name="state"] option[value="Grading"]').hide();
    $('select[name="state"] option[value="Archived"]').hide();

}

function onclickEdit(e) 
{
    onOpenDetailModal(e);
}

function onclickDelete(e) 
{
    if(window.confirm("Are you sure you want to delete this exam?"))
    {
        var itemId = e.currentTarget.dataset["id"];
        
        $.post("../ape/remove_ape.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        exam_id: itemId},
        function(){
            $("tr[data-id='item-" + itemId + "']").remove();
            //$("tr[id='item-" + itemId + "']").remove();
        });
    }
}

function clearForm()
{
    $("#" + _formId).find("select, input[type=text], input[type=hidden]:not(#requester-id, #requester-type, #requester-session), textarea").val("");
	$('#Report_tab').find("input[type='checkbox']").prop("checked", false);
    $("#quarter").html("(Select valid date)");
    $("#possible-grade").html("(Sum of categories)");
    $("#cat-table > tbody").empty();
    $("#cat-table").hide();
    $('#add-cat-btn').prop("disabled",false);
    $('#cat-heading').toggleClass('empty-panel-fix', true);
    //$('a[href="#Exam_tab"]').tab('show');
    _catSectionModified = false;
}

function getAllItems(state)
{
    $("#" + state + "-panel > .table-responsive > ."+_tableId + " tbody").empty();
    $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_all"}, 
        function(data){
            loadTable(data, state);
        },
        "json");
}