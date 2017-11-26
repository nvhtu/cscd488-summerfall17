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

var _isCreateClicked = false;

var _reportValidator;
var _examValidator;
var _catValidators = Array();
var _graderValidators = Array();


$(document).ready(loaded);

function loaded() {
    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");

    

    $("a[href='#Open-panel']").click(function(){getAllItems("Open"); _selectedTab = "Open";});
    $("a[href='#In_Progress-panel']").click(function(){getAllItems("In_Progress"); _selectedTab = "In_Progress";});
    $("a[href='#Grading-panel']").click(function(){getAllItems("Grading"); _selectedTab = "Grading";});
    $("a[href='#Archived-panel']").click(function(){getAllItems("Archived"); _selectedTab = "Archived";});
    $("a[href='#Hidden-panel']").click(function(){getAllItems("Hidden"); _selectedTab = "Hidden";});

    $("#create-button").click(onclickCreate);

    $('#detail-modal').on('hidden.bs.modal', function () {
        if(_isCreateClicked)
        {
            _isCreateClicked = false;
        }
    })
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
        requester_type: _userType,
        requester_session_id: _userSessionId
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

    $("form, input").attr("autocomplete", "off");

    jQuery.validator.addMethod("myDate", function(value, element) {
        return /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(value);
        }, "Please enter a date in YYYY-MM-DD format");

    jQuery.validator.addMethod("myQuarter", function(value, element) {
        return /^(Fall|Winter|Spring|Summer)$/.test(value);
        }, "Please enter a date within a quarter");

    jQuery.validator.addMethod("myTime", function(value, element) {
        return /^((([1-9])|(1[0-2])):([0-5])([0-9])\s(A|P)M)$/.test(value);
        }, "Please enter a valid time");

    jQuery.validator.addMethod("passingGrade", function(value, element) {
        if($("[name='max-score']").filter(function(){return $(this).val() != "";}).length > 0)
            return parseInt(value, 10) <= parseInt($("[name='possible_grade']").val(), 10);
        return true;
        }, "Passing grade cannot exceed possible grade");

    _examValidator = $("#main-form").validate({
        ignore: [],
        rules: {
            name: {
                required: true
            },
            date: {
                required: true,
                myDate: true
            },
            quarter: {
                required: true,
                myQuarter: true
            },
            start_time: {
                required: true,
                myTime: true
            },
            duration: {
                required: true,
                digits: true
            },
            cutoff: {
                required: true,
                digits: true
            },
            location: {
                required: true
            },
            state: {
                required: true
            },
            passing_grade: {
                required: true,
                digits: true,
                passingGrade: true
            },
            possible_grade: {
                required: true,
                digits: true
            }
        },
        messages: {
            quarter: {
                required: "Select valid date to add quarter"
            },
            possible_grade: "Fill out category info to add possible grade"
        }
    });

    jQuery.validator.addMethod("fileName", function(value, element) {
        return this.optional(element) || /^[a-zA-Z0-9._]([a-zA-Z0-9._-]+)?$/.test(value);
        }, "Please enter a valid file name");

    _reportValidator = $("#report-form").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                validator.errorList[0].element.focus();
            }
        },
        ignore: [],
        rules: {
            "file-name": {
                required: true,
                fileName: true
            },
            checkboxes: {
                required: function (element) {
                    return $('[type="checkbox"]:checked').length == 0;
                }
            }
        },
        messages: {
            checkboxes: "Please select data to include"
        }
    });
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



function onclickCreate()
{
    clearForm();
    _isCreateClicked = true;
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

    toggleSubmitEdit(false, true);
}

function onclickDetails(e) 
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