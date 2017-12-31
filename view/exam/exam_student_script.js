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
var _pageParam = "";

$(document).ready(function(){

    _pageParam = getURLParameter("page");

    //if URL param page is "student_exam", continue loading.
    //Else it's "admin_user" or "teacher_user", stop loading because user page include this js file to use its functions to load student history exams
    if(_pageParam.indexOf("exam") != -1)
    {
        loaded();
    }

});

function loaded() 
{
    $("#create-button").remove();
    $("#msg-close").remove();
    
    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");

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
        checkStudentAccountState();
        
    },
    "json");
}

function init()
{
    
    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    buildStudentTable();

    $(".main-table>thead th").not("th:last-of-type")
    .click(onClickSort)
    .mousedown(function(e){ e.preventDefault(); });
    
    getAllStudentItems();

    $(".main-table>thead th").not("th:last-of-type")
     .click(onClickSort)
     .mousedown(function(e){ e.preventDefault(); });


     getStudentInfo();

    
}

function buildStudentTable()
{

    headersArr = ["Name", "Date", "Start Time", "Overall Grade", "Result", "Action"];
    var table = buildMainTable(headersArr);
    
    $(".panel .table-responsive").attr("id", "exams-student-table-wrapper");
    $("#exams-student-table-wrapper").html(table);
}

function buildStudentItemSummaryRow(item)
{
    var passedResult = "";
    var rowColorClass = "";
    var passedTextColor = "";
    var overallGrade = "";
    var isButtonDisabled = true;

    if (item.state == "Archived")
    {
        if(item.passed == 1)
        {
            passedResult = "Passed";
            rowColorClass = "green-row";
            passedTextColor = "green-bold-text";
        }
        else if (item.passed == 0)
            {
                passedResult = "Fail";
                rowColorClass = "red-row";
                passedTextColor = "red-bold-text";
            }
        
        overallGrade = item.grade + "/" + item.possible_grade;
        isButtonDisabled = false;
    }
    else
    {
        if(item.state == "Open" || item.state == "In_Progress")
        {
            passedResult = "Registered";
        }
        else if (item.state == "Grading")
        {
            passedResult = "Grading";
        }

        overallGrade = "N/A"
        isButtonDisabled = true;
    }

    var summaryData = {
        id: item.exam_id,
        name: item.name,
        date: item.date,
        start_time: item.start_time,
        overall_grade: overallGrade,
        passed: passedResult
    };

    //console.log(summaryData);

    var row = buildItemRow(summaryData, false);
    var $bttnInfo = $('<button type="button" class="btn btn-primary" data-target="#item-' + summaryData.id + '" data-toggle="collapse">View Detail Grades</button>');
    if(isButtonDisabled)
    {
        $bttnInfo.addClass("disabled");
    }
    row.append($('<td>').append($('<div class="btn-group" role="group">').append($bttnInfo)));
    row.addClass(rowColorClass);
    row.children().eq(4).addClass(passedTextColor);
    row.children().eq(4).css("font-weight", "bold");
    return row;
}

function buildStudentItemDetailRow(item)
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

function loadStudentTable(data) 
{
    //console.log(data);
    $.each(data, function(i, item) {

        //console.log(item);

        var row = buildStudentItemSummaryRow(item);

        var detailRow = buildStudentItemDetailRow(item);

        $("#exams-student-table-wrapper > ." + _tableId).append(row);
        $("#exams-student-table-wrapper > ." + _tableId).append(detailRow);
        //console.log(detailExamRow);

        //$("#" + _tableId).append(row);
        //$("#" + _tableId).append(detailRow);
    });
    $(".tab-pane.active .main-table>thead th:nth-of-type(2)").trigger('click');
}


function getAllStudentItems(state)
{
    
    $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_all"}, 
        loadStudentTable,
        "json");
}



function checkStudentAccountState()
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

