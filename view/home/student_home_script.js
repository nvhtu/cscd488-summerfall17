var _userId = "";
var _userType = "";
var _userSessionId = "";
var _userState = "";
var _userRegisteredExam = new Array("0");

var _targetModal = "detail-modal";
var _tableId = "main-table";
var _formId = "main-form";

var _locData = new Array(0);

var _selectedTab = "";

$(document).ready(loaded);

function loaded()
{
    $("#submit-button").click(onRegister);
    $("#msg-close").remove();
    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");
}


function init()
{
    if(_userId != "000")
    {
        getStudentInfo();
    }
    else
    {
        getAllLoc();
        
        buildTable();
        $(".main-table>thead th").not("th:last-of-type")
        .click(onClickSort)
        .mousedown(function(e){ e.preventDefault(); });
    }
    

    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    //$(".msg-box").addClass("alert-info");
    
    
    
    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
            console.log(jqxhr.responseText);
            $(".msg-box").addClass("alert-danger");
            $(".msg-box").fadeIn();
            $("#msg-box-text").html("<strong>Error!</strong> " + jqxhr.responseText);
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

    getUpcomingExam();
}

function buildTable()
{
    var headersArr = Array();

    if(_userId != "000")
    {
        headersArr = ["Name", "Date", "Start Time", "Duration", "Location", "Available Seats", "Action"];
    }
    else
    {
        headersArr = ["Name", "Date", "Start Time", "Duration", "Location", "Available Seats"];
    }
   
    var table = buildMainTable(headersArr);
    $(".table-reponsive").html(table);
    
}

function getUpcomingExam()
{
    $("."+_tableId + " tbody").empty();
    
    $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_state",
        state: "Open"}, 
        loadTable,
        "json");
}

function loadTable(data) 
{
    //console.log(data);
    $.each(data, function(i, item) {

        //console.log(item.state);

        var row = buildItemSummaryRow(item);

        //var detailRow = buildItemDetailRow(item);

        $("." + _tableId).append(row);
        //$("#" + item.state + "-panel > .table-responsive > ." + _tableId).append(detailRow);

        if(_userId != "000")
        {
        checkAccountState();
        }
    });
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
        duration: item.duration + " hours",
        location: locName,
        available: item.remaining_seats + " seats"
        
    };

    var row = buildItemRow(summaryData, false);

    if(_userId != "000")
    {

        var $bttnRegister = "";

        $.each(_userRegisteredExam, function(i,theExam){
            if(item.exam_id == theExam) //Registered by user
            {
                row.addClass("grey-row");
                if(item.remaining_seats == "FULL") //Exam full
                {
                    $bttnRegister = $('<button type="button" disabled="" class="btn btn-primary register-btn register-full registered" data-id="' + summaryData.id + '">Register</button>');
                    
                }
                else
                {
                    $bttnRegister = $('<button type="button" class="btn btn-primary register-btn registered" data-id="' + summaryData.id + '">Register</button>');
                }
                row.css("font-weight", "bold");
                $bttnRegister.click(onclickUnregister);
            }
            else //Not registered
            {
                if(item.remaining_seats == "FULL") //Exam full
                {
                    $bttnRegister = $('<button type="button" disabled="" class="btn btn-primary register-btn register-full " data-target="#detail-modal" data-toggle="modal" data-id="' + summaryData.id + '">Register</button>');
                    
                }
                else
                {
                    $bttnRegister = $('<button type="button" class="btn btn-primary register-btn " data-target="#detail-modal" data-toggle="modal" data-id="' + summaryData.id + '">Register</button>');
                }
                
                $bttnRegister.click(onclickRegister);
            }
        });
        row.append($('<td>').append($('<div class="btn-group" role="group">').append($bttnRegister)));
    }
    return row;
    
}

function checkAccountState()
{
    $examBtn = '<button type="button" class="btn btn-primary pull-right" onclick="window.location.href=\'../view/exam/\'">View My Grades</button>';
    switch(_userState)
    {
        case "Ready":   $(".msg-box").addClass("alert-success");
                        $("#msg-box-text").html("Your account is ready to register for an exam.");
                        $(".register-btn").html("Register");
                        //check if the exam is full
                        $(".register-btn").each(function(i, element){
                            if($(this).hasClass("register-full"))
                            {
                                removeDisableBtnInfo($(this));
                            }
                            else
                            {
                                $(this).prop("disabled",false);
                            }
                        });
                        
                        break;

        case "Registered":   $(".msg-box").addClass("alert-warning");
                        $("#msg-box-text").html("You already registered for an exam. You can unregister and register another exam below if available.");
                        $(".register-btn").html("Register");
                        
                        $(".register-btn").each(function(i, element){
                            if($(this).hasClass("registered"))
                            {
                                $(this).prop("disabled",false);
                                $(this).html("Unregister");
                            }
                            else
                            {
                                removeDisableBtnInfo($(this));
                            }
                        });
                        
                        //removeRegisterBtnInfo();
                        break;

        case "Passed":   $(".msg-box").addClass("alert-success");
                        $("#msg-box-text").html("Congratulations! You have passed the APE.");
                        $("#msg-box-text").append($examBtn);
                        $(".register-btn").html("Unavailable");
                        
                        
                        removeDisableBtnInfo($(".register-btn"));
                        break;
        
        case "Blocked":   $(".msg-box").addClass("alert-danger");
                        $("#msg-box-text").html("Your account is blocked. Please contact Stu.");
                        $(".register-btn").html("Unavailable");
                        removeDisableBtnInfo($(".register-btn"));
                        break;
    }
}

function removeDisableBtnInfo($btn)
{

    $btn.removeAttr("data-target");
    $btn.prop("disabled",true);

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
        
        if(item[0]["registered_exam"] != undefined)
        {
            _userRegisteredExam = item[0]["registered_exam"];
        }
        
        getAllLoc();
        
        buildTable();
        $(".main-table>thead th").not("th:last-of-type")
        .click(onClickSort)
        .mousedown(function(e){ e.preventDefault(); });
    },
    "json");
}


function onclickRegister(e) 
{
    clearForm();
    var itemId = e.currentTarget.dataset["id"];
    $("#item-id").val(e.currentTarget.dataset["id"]);

    $.get("../ape/get_all_apes.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "get_by_id",
    exam_id: itemId}, 
    function(item){
        $.each(item[0], function(name, val){
            if(name == "location")
            {
                $.each(_locData, function(i,locItem){
                    if(val == locItem.loc_id)
                    {
                        val = locItem.name;
                    }
                });
            }
            if(name == "duration")
            {
                val = val + " hours";
            }
            var el = $('[name="'+name+'"]');
            el.val(val);
        });
    },
    "json");

}

function clearForm()
{
    $("#" + _formId).find("input[type=text], textarea").val(""); 
}

function onclickUnregister(e)
{
    if(window.confirm("Are you sure you want to unregister from this exam?"))
    {
        var itemId = e.currentTarget.dataset["id"];
        
        $.post("../ape/unregister.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        student_id: _userId,
        exam_id: itemId},
        function(){
            location.reload();
        });
    }
}

function onRegister()
{
    $.post("../ape/register.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    student_id: _userId,
    exam_id: $("#item-id").val()}, 
    function(){
        location.reload();
    });
}
