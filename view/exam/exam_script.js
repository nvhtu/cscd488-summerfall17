/**
 * Exam page script
 * @author: Tu Nguyen
 * @version: 1.0
 */

var _userId = "";
var _userType = "";
var _userSessionId = "";

var _targetModal = "detail-modal";
var _tableId = "main-table";
var _formId = "main-form";

var _locData = Array();

var _selectedTab = "";

$(document).ready(loaded);

function loaded() 
{

    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");

    

    $("#create-button").click(onclickCreate);
    $("#submit-button").click(submitForm);

    $("a[href='#Open-panel']").click(function(){getAllItems("Open"); _selectedTab = "Open";});
    $("a[href='#In_Progress-panel']").click(function(){getAllItems("In_Progress"); _selectedTab = "In_Progress";});
    $("a[href='#Grading-panel']").click(function(){getAllItems("Grading"); _selectedTab = "Grading";});
    $("a[href='#Archived-panel']").click(function(){getAllItems("Archived"); _selectedTab = "Archived";});
    $("a[href='#Hidden-panel']").click(function(){getAllItems("Hidden"); _selectedTab = "Hidden";});
}

function loadUserInfo(data)
{
    _userId = data.userId;
    _userType = data.userType;
    _userSessionId = data.userSession;

    init();
    
    
}

function init()
{
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

    buildTable();

    
}

function buildTable()
{
    var headersArr = ["Name", "Date", "Start Time", "Location", "Action"];
    var table = buildMainTable(headersArr);
    $(".table-responsive").html(table);
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

function buildItemDetailRow(item)
{
    var detailData = {
        id: item.exam_id,
        duration: item.duration,
        passing_grade: item.passing_grade,
        cutoff: item.cutoff
    };

    var namesArr = ["Duration", "Passing Grade", "Cutoff"];
    var detailRow = buildDetailRow(detailData, namesArr);

    return detailRow;
}

function loadTable(data) 
{
    //console.log(data);
    $.each(data, function(i, item) {

        //console.log(item.state);

        var row = buildItemSummaryRow(item);

        var detailRow = buildItemDetailRow(item);

        $("#" + item.state + "-panel > .table-responsive > ." + _tableId).append(row);
        $("#" + item.state + "-panel > .table-responsive > ." + _tableId).append(detailRow);
        //console.log(detailExamRow);

        //$("#" + _tableId).append(row);
        //$("#" + _tableId).append(detailRow);
    });
}


function getAllLoc()
{
    $.get("../location/get_all_locations.php",{
                                requester_id: _userId,
                                requester_type: _userType,
                                requester_session_id: _userSessionId
                                }, populateLocation, "json");
}

function populateLocation(data)
{
    $("#ape-loc").empty();
    _locData = data;
    $.each(data, function(i){
        $("#ape-loc").append($("<option></option")
                    .attr("value", data[i]["loc_id"])
                    .text(data[i]["name"]));
    });

    getAllItems();
}

function submitForm (e)
{
    if(e.currentTarget.dataset["action"] == "create")
    {
        createItem();
    }
        
    if(e.currentTarget.dataset["action"] == "update")
    {
        updateItem();
    }
        
}

function createItem()
{
    //console.log($("#" + _formId).serialize());
    $.post("../ape/create_ape.php", $("#" + _formId).serialize(), function(lastInsertId){
        $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_id",
        exam_id: lastInsertId}, 
        function(item){

            //console.log(item);
            loadTable(item);
        },
        "json");
    });
}

function updateItem()
{
    //console.log($("#" + _formId).serialize());
    $.post("../ape/update_ape.php", $("#" + _formId).serialize(), function(){
        var item = $("#" + _formId).serialize();
        $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_id",
        exam_id: $("#item-id").val()}, 
        function(item){
            var row = buildItemSummaryRow(item[0]);
            var detailRow = buildItemDetailRow(item[0]);

            //console.log(row);
            //console.log(detailRow);
            $("tr[data-target='#item-" + item[0].exam_id + "']").replaceWith(row);
            $("tr[data-id='item-" + item[0].exam_id + "']").replaceWith(detailRow);
        },
        "json");
    }); 
}

function onclickCreate()
{
    clearForm();
    //getAllLoc();
    $(".modal-title").html("Create an Exam");
    $("#submit-button").attr("data-action", "create");
    $("#submit-button").html("Create");
}

function onclickEdit(e) 
{
    clearForm();
    var itemId = e.currentTarget.dataset["id"];
    $("#item-id").val(e.currentTarget.dataset["id"]);
    $(".modal-title").html("Edit an Exam");
    $("#submit-button").attr("data-action", "update");
    $("#submit-button").html("Save changes");

    $.get("../ape/get_all_apes.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "get_by_id",
    exam_id: itemId}, 
    function(item){
        $.each(item[0], function(name, val){
            var el = $('[name="'+name+'"]');
            el.val(val);
        });
    },
    "json");

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
            $("tr[data-target='#item-" + itemId + "']").remove();
            $("tr[id='item-" + itemId + "']").remove();
        });
    }
}

function clearForm()
{
    $("#" + _formId).find("input[type=text], textarea").val(""); 
}

function getAllItems(state)
{
    $("#" + state + "-panel > .table-responsive > ."+_tableId + " tbody").empty();
    
    $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_all"}, 
        loadTable,
        "json");
}
