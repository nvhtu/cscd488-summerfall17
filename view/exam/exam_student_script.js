/**
 * Exam page script
 * @author: Tu Nguyen
 * @version: 1.0
 */

var _userId = "";
var _userType = "";
var _userSessionId = "";
var _userState = "";

var _targetModal = "detail-modal";
var _tableId = "main-table";
var _formId = "main-form";

var _locData = Array();

var _selectedTab = "";

$(document).ready(loaded);

function loaded() 
{
    $("#create-button").remove();
    $("#msg-close").remove();
    
    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");

}

function loadUserInfo(data)
{
    _userId = data.userId;
    _userType = data.userType;
    _userSessionId = data.userSession;

    init();
}

function getStudentInfo()
{
    $.get("../account/get_account_info.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "get_own"}, 
    function(item){
        _userState = item[0]["state"];
        checkAccountState();
        
    },
    "json");
}

function init()
{
    
    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    //$(".msg-box").hide();
    
    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
            console.log(jqxhr.responseText);
            $(".msg-box").addClass("alert-danger");
            $(".msg-box").fadeIn();
            $("#msg-box-text").html("<strong>Error!</strong> " + jqxhr.responseText);
    });

    buildTable();
    getAllItems();

    $(".main-table>thead th").not("th:last-of-type")
     .click(onClickSort)
     .mousedown(function(e){ e.preventDefault(); });


     getStudentInfo();

    
}

function buildTable()
{

    headersArr = ["Name", "Date", "Start Time", "Overall Grade", "Result", "Action"];
    var table = buildMainTable(headersArr);
    
    $(".panel .table-responsive").attr("id", "exams-student-table-wrapper");
    $("#exams-student-table-wrapper").html(table);
}

function buildItemSummaryRow(item)
{
    var passedResult = "";
    var passedColor = "";
    var passedTextColor = "";
    if(item.passed == 1)
    {
        passedResult = "Passed";
        passedColor = "#DFF0D8";
        passedTextColor = "#3D773E";
    }
    else
    {
        passedResult = "Fail";
        passedColor = "#F2DEDE";
        passedTextColor = "#A94442";
    }

    var summaryData = {
        id: item.exam_id,
        name: item.name,
        date: item.date,
        start_time: item.start_time,
        overall_grade: item.grade + "/" + item.possible_grade,
        passed: passedResult
    };

    //console.log(summaryData);

    var row = buildItemRow(summaryData, false);
    var $bttnInfo = $('<button type="button" class="btn btn-primary" data-target="#item-' + summaryData.id + '" data-toggle="collapse">View Detail Grades</button>');
    row.append($('<td>').append($('<div class="btn-group" role="group">').append($bttnInfo)));
    row.css("background-color", passedColor);
    row.children().eq(4).css("color", passedTextColor);
    row.children().eq(4).css("font-weight", "bold");
    return row;
}

function buildItemDetailRow(item)
{
    var detailData = {
        id: item.exam_id
    };

    var namesArr = Array();

    $.each(item["cats"], function(i, theCat)
    {
        detailData[i] = theCat;
        namesArr.push(i);
    });

    //console.log(detailData);
    var detailRow = buildDetailRow(detailData, namesArr);

    return detailRow;
}

function loadTable(data) 
{
    //console.log(data);
    $.each(data, function(i, item) {

        //console.log(item);

        var row = buildItemSummaryRow(item);

        var detailRow = buildItemDetailRow(item);

        $("#exams-student-table-wrapper > ." + _tableId).append(row);
        $("#exams-student-table-wrapper > ." + _tableId).append(detailRow);
        //console.log(detailExamRow);

        //$("#" + _tableId).append(row);
        //$("#" + _tableId).append(detailRow);
    });
    $(".tab-pane.active .main-table>thead th:nth-of-type(1)").trigger('click');
}


function getAllItems(state)
{
    
    $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_all"}, 
        loadTable,
        "json");
}



function checkAccountState()
{
    $homepageBtn = '<button type="button" class="btn btn-primary pull-right" onclick="window.location.href=\'../view/home/\'">View Available Exams</button>';
    switch(_userState)
    {
        case "Ready":   $(".msg-box").addClass("alert-success");
                        $("#msg-box-text").html("Your account is ready to register for an exam.");
                        $("#msg-box-text").append($homepageBtn);
                        break;

        case "Registered":   $(".msg-box").addClass("alert-warning");
                        $("#msg-box-text").html("You've already registered for an exam.");
                        $("#msg-box-text").append($homepageBtn);
                        break;

        case "Passed":   $(".msg-box").addClass("alert-success");
                        $("#msg-box-text").html("Congratulations! You have passed the APE.");
                        break;
        
        case "Blocked":   $(".msg-box").addClass("alert-danger");
                        $("#msg-box-text").html("Your account is blocked. Please contact Stu.");
                        break;
    }
}

