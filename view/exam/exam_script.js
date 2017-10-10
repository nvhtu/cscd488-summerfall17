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

var _selectedTab = "Open";

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
    
    $.get("../settings/get_settings.php", {
      requester_id: _userId,
      requester_type: _userType
      }, loadSettings, "json");
}

function loadSettings(data) {
   _settings = data.reduce(function(obj, item) {
      obj[item.name] = item.value;
      return obj;
   }, {});
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
    $(".main-table>thead th").not("th:last-of-type")
     .click(onClickSort)
     .mousedown(function(e){ e.preventDefault(); });

     var options={
      format: 'yyyy-mm-dd',
      forceParse: false,
      todayHighlight: true,
      autoclose: true,
    };
    $('input[name="date"]').datepicker(options).on('changeDate', appendQuarter);

    $('input[name="date"]').keydown(function(){
        return false;
    });
}

function appendQuarter(e) {
   var input = $(this);
   input.val(input.val() + getQuarter(input.val()));
}

function getQuarter(date) {
   var quarter = "",
   curDate = new Date(date),
   winterStart = new Date(_settings.winterStart),
   winterEnd = new Date(_settings.winterEnd),
   springStart = new Date(_settings.springStart),
   springEnd = new Date(_settings.springEnd),
   summerStart = new Date(_settings.summerStart),
   summerEnd = new Date(_settings.summerEnd),
   fallStart = new Date(_settings.fallStart),
   fallEnd = new Date(_settings.fallEnd);

   if (isBetweenDates(curDate, winterStart, winterEnd)) {
      quarter = "Winter";
   }
   else if (isBetweenDates(curDate, springStart, springEnd)) {
      quarter = "Spring";
   }
   else if (isBetweenDates(curDate, summerStart, summerEnd)) {
      quarter = "Summer";
   }
   else if (isBetweenDates(curDate, fallStart, fallEnd)) {
      quarter = "Fall";
   }

   if (quarter !== "") {
      return " (" + quarter + " Quarter)";
   }
   else {
      return "";
   }
}

function isBetweenDates(cur, lower, upper) {
   if (lower < upper) {
      return lower <= cur && cur <= upper;
   }
   else {
      return cur <= upper || cur >= lower;
   }
}

function buildTable()
{
    headersArr = ["Name", "Date", "Start Time", "Location", "Action"];

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

    $addStudentsBtn = $('<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#roster-modal" data-id="' + summaryData.id + '">Exam Roster</button>');
    $addStudentsBtn.click(onclickRoster);
    row.children().children().append($addStudentsBtn);
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
    $(".tab-pane.active .main-table>thead th:nth-of-type(1)").trigger('click');
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


function onclickRoster(e)
{
    headersArr = new Array();
    getGrade = -1;

    

    if (_selectedTab != "Open")
    {
        $("#add-student-btn").hide();

        headersArr = ["Student ID", "First Name", "Last Name", "Seat #", "Grade", "Result", "Action"];
        getGrade = 1;
    }
    else
    {
        $("#add-student-btn").show();
        $("#add-student-btn").click(onclickRegNewStudentBtn);

        headersArr = ["Student ID", "First Name", "Last Name", "Seat #", "Action"];
        getGrade = 0;
    }

    $(".modal-title").html("Exam Roster");
    
    
    var table = buildMainTable(headersArr);
    $("#roster-table-wrapper").html(table);

    var itemId = e.currentTarget.dataset["id"];
    $("#roster-form > #item-id").val(itemId);

    $.get("../ape/get_exam_roster.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    exam_id: itemId,
    get_grade: getGrade}, 
    loadRosterTable,
    "json");

}

function loadRosterTable(data)
{
    $.each(data, function(i, item) 
    {
            switch (_selectedTab)
            {
                case "Open":    
                                var summaryData = {
                                    id: item.student_id,
                                    studentid: item.student_id,
                                    fname: item.f_name,
                                    lname: item.l_name,
                                    seatnum: item.seat_num
                                };
                                var row = buildItemRow(summaryData, false);
                                var $bttnDel = $('<button type="button" class="btn btn-danger">Unregister</button>');
                                $bttnDel.attr("data-id", summaryData.id);
                                $bttnDel.click(onclickDeleteStudent);
                    
                                row.append(
                                    $('<td class="btns">').append(
                                    $('<div class="btn-group" role="group">').append($bttnDel, ' ')
                                    )
                                );
                                $("#roster-table-wrapper > ." + _tableId).append(row);
                                break;
                
                case "In_Progress": $("#roster-table-wrapper > .main-table > thead > tr > th:nth-child(5)").remove();
                            break;
                
                case "Grading":
                                loadRosterTableHasGrades(item);

                                break;

                case "Archived":
                            break;

                case "Hidden":
                            break;
            }

            
            
    });

}

function onclickDeleteStudent(e)
{
    if(window.confirm("Are you sure you want to remove this student from the exam?"))
    {
        var studentId = e.currentTarget.dataset["id"];
        var examId =  $("#roster-form > #item-id").val();

        
        
        $.post("../ape/unregister.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        exam_id: examId,
        student_id: studentId},
        function(){
            $("tr[data-target='#item-" + studentId + "']").remove();
            $("tr[id='item-" + studentId + "']").remove();
        });
    }
}

function onclickRegNewStudentBtn()
{
    modifyLookupModal();
}

function modifyLookupModal()
{
    $("#lookup-button").remove();
    var $newLookupBtn = $("<button type='button' id='lookup-button' class='btn btn-primary'>Look up</button>");
    $newLookupBtn.click(onclickLookup);
    $("#lookup-string").after($newLookupBtn);

    $("#lookup-modal-title").html("Look up student");
    headersArr = ["Student ID", "First Name", "Last Name", "Email", "State", "Action"];
    table = buildMainTable(headersArr);
    $("#lookup-table-wrapper").html(table);
}

function onclickLookup()
{
    $("#lookup-table-wrapper > ."+_tableId + " tbody").empty();
    searchStr = $("#lookup-string").val();
    if(searchStr != "")
    {
        //$("#Students-panel > .table-responsive > ."+_tableId + " tbody").empty();
        $.get("../account/student_search.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        search_str: searchStr}, 
        function(data){
            $.each(data, function(i, item) 
            {
                var summaryData = {
                    id: item.user_id,
                    ewu_id: item.user_id,
                    f_name: item.f_name,
                    l_name: item.l_name,
                    email: item.email,
                    state: item.state
                };
            
                var row = buildItemRow(summaryData, false);

                var $registerBtn = "";
            
                if(item.state != "Ready")
                {
                    $registerBtn = $('<button type="button" class="btn btn-primary" disabled>Register</button>');
                }
                else
                {
                    $registerBtn = $('<button type="button" class="btn btn-primary" data-id="' + summaryData.id + '">Register</button>');
                }
                
                $registerBtn.click(onclickRegisterStudent);

                row.append(
                    $('<td class="btns">').append(
                       $('<div class="btn-group" role="group">').append($registerBtn, ' ')
                     )
                  );
    
                $("#lookup-table-wrapper > ." + _tableId).append(row);

                
            });
        },
        "json");
    }
}

function onclickRegisterStudent(e)
{
    var studentId = e.currentTarget.dataset["id"];
    var examId =  $("#roster-form > #item-id").val();

    $.post("../ape/register.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    student_id: studentId,
    exam_id: examId}, 
    function(){
        alert("Student has been added to the exam successfully.");

        $("tr[data-target='#item-" + studentId + "'] > td:nth-child(5)").html("Registered");
        $("tr[data-target='#item-" + studentId + "'] > .btns > .btn-group > .btn-primary").prop("disabled",true);

        //reload exam roster table
        $("#roster-table-wrapper > ."+_tableId + " tbody").empty();
        $.get("../ape/get_exam_roster.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        exam_id: examId,
        get_grade: getGrade}, 
        loadRosterTable,
        "json");
    });
}

function loadRosterTableHasGrades(item)
{
    var passedResult = "";
    if(item.passed = 1)
    {
        passedResult = "Passed";
    }
    else
    {
        passedResult = "Fail";
    }
    var summaryData = {
        id: item.student_id,
        studentid: item.student_id,
        fname: item.f_name,
        lname: item.l_name,
        seatnum: item.seat_num,
        grade: item.grade + "/" + item.possible_grade,
        result: passedResult
    };
    var summaryRow = buildItemRow(summaryData, false);

    //create info button
    var $bttnInfo = $('<button type="button" class="btn btn-info" data-target="#item-' + summaryData.id + '" data-toggle="collapse"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span><span class="sr-only">Info</span></button>');
    $bttnInfo.attr("data-id", summaryData.id);
    $bttnInfo.click(onclickInfoGrade);
    //create edit button
    var $bttnEdit = $('<button type="button" class="btn btn-warning" data-target="#item-' + summaryData.id + '" data-toggle="collapse"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span></button>');
    $bttnEdit.attr("data-id", summaryData.id); //add unique ID from item as a data tag
    $bttnEdit.click(onclickEditGrade);

    summaryRow.append(
        $('<td class="btns">').append(
        $('<div class="btn-group" role="group">').append($bttnInfo, $bttnEdit, ' ')
        )
    );
    
    var detailData = {
        id: item.student_id
    };

    var namesArr = Array();

    $.each(item["cats"], function(i, theCat)
    {
        detailData[i] = theCat;
        namesArr.push(i);
    });

    var detailRow = buildGradeDetailRow(detailData, namesArr);

    $("#roster-table-wrapper > ." + _tableId).append(summaryRow);
    $("#roster-table-wrapper > ." + _tableId).append(detailRow);
}

function buildGradeDetailRow(detailData, namesArr)
{
    var detailRowHTML = '<tr class="item-detail-row" data-id="item-' + detailData.id + '">'
    + '<td class="details" colspan="100%">'
    + '<div class="collapse" id="item-' + detailData.id + '">'
    + '<table class="table table-condensed">'
    + '<tbody>';

    var count = 0;

    for (var property in detailData) 
    {
        if (detailData.hasOwnProperty(property) && !property.includes("Max")) 
        {
            if(detailData[property] != detailData.id)
            {
                detailRowHTML += '<tr class="active">'
                                + '<th>' + property + ': </th>'
                                + '<td> <input type="number" class="cat-grade-input" disabled value="' + detailData[property] + '">' + ' / ' + detailData[property + " Max"] + '</td>'
                                + '</tr>';
                
                
            }
            
            count++;
        }
    }

    detailRowHTML += '</tbody></table></div></td></tr>';
    return detailRowHTML;
}

function onclickEditGrade(e)
{
    var itemId = e.currentTarget.dataset["id"];
    $("#item-" + itemId + " .cat-grade-input").prop("disabled", false);
}

function onclickInfoGrade(e)
{
    var itemId = e.currentTarget.dataset["id"];
    $detailRow =  $("#roster-table-wrapper tr[class='item-detail-row'] div[id='item-" + itemId + "']");

    //Disable Edit button collapse when the detail row has been expanded earlier by Info button
    if(!$detailRow.hasClass("in"))
    {
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning").removeAttr("data-toggle");
    }
    else
    {
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning").attr("data-toggle", "collapse");
    }

    
}