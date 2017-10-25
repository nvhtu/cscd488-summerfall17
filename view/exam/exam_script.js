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

var _isEditing = false;

/*var _deletedExamCats;
var _modifiedExamCats;*/
var _catSectionModified;

$(document).ready(loaded);

function loaded() {
    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");

    $("#create-button").click(onclickCreate);
    $("#submit-button").click(submitForm);
    $("#submit-button").attr("data-tab", "exam");

    $("a[href='#Open-panel']").click(function(){getAllItems("Open"); _selectedTab = "Open";});
    $("a[href='#In_Progress-panel']").click(function(){getAllItems("In_Progress"); _selectedTab = "In_Progress";});
    $("a[href='#Grading-panel']").click(function(){getAllItems("Grading"); _selectedTab = "Grading";});
    $("a[href='#Archived-panel']").click(function(){getAllItems("Archived"); _selectedTab = "Archived";});
    $("a[href='#Hidden-panel']").click(function(){getAllItems("Hidden"); _selectedTab = "Hidden";});

    $('a[href="#Exam_tab"]').on('show.bs.tab', onclickTabExam);
    $('a[href="#Report_tab"]').on('show.bs.tab', onclickTabReport);

    //$('#lookup-results').hide();
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

     var options={
      format: 'yyyy-mm-dd',
      forceParse: false,
      todayHighlight: true,
      autoclose: true,
    };
    $('input[name="date"]').datepicker(options).on('changeDate', autofillQuarter);

    $('input[name="date"]').keydown(function(){
        return false;
    });

    $('#add-cat-btn').click(onclickAddCat);

    $('#cat-table').on('change', 'input, select', function(){
        _catSectionModified = true;        
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

// function buildItemDetailRow(item)
// {
//     var detailData = {
//         id: item.exam_id,
//         duration: item.duration,
//         passing_grade: item.passing_grade,
//         cutoff: item.cutoff
//     };

//     var namesArr = ["Duration", "Passing Grade", "Cutoff"];

    
//     var reportBtn = "<button type='button' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#report-modal' data-id='" + detailData.id + "'>Generate</button>";
//     detailData.report = reportBtn;
//     namesArr.push("Report");


//     var detailRow = buildDetailRow(detailData, namesArr);

//     return detailRow;
// }

function onclickDownload(rosterData, examData){
    var csvContent = "data:text/csv;charset=utf-8,";
    
    var i;
    for(i = 0; _locData[i].loc_id != examData.location; i++);
    var locName = _locData[i].name;

    var csvHeader = [examData.name + ": " + examData.quarter + " Quarter " + examData.date + " " +
        examData.start_time + " " + locName];
    var csvData = [];
    csvData.push(csvHeader);
    csvData.push([]);
    csvData = selectStudentData(rosterData, csvData);
    
    csvData.forEach(function(infoArray, index){
        dataString = infoArray.join(",");
        csvContent += index < csvData.length ? dataString + "\n" : dataString;
    }); 

    var encodedUri = encodeURI(csvContent);
    var link = $("#download-link");
    link.attr("href", encodedUri);
    link.attr("download", $("[name='file-name']").val() + ".csv");

    link[0].click();
}

function selectStudentData(rosterData, csvData){
    //console.log(rosterData);
    var studentHeaders = [];
    var rosterProps = [];

    if($("#student-name-checkbox").prop('checked')){
        rosterProps.push("f_name", "l_name");
        studentHeaders.push("First Name", "Last Name");
    }
    if($("#student-id-checkbox").prop('checked')){
        rosterProps.push("student_id");
        studentHeaders.push("EWU ID");
    }
    if($("#student-email-checkbox").prop('checked')){
        rosterProps.push("email");
        studentHeaders.push("Email");
    }
    if($("#student-cat-grade-checkbox").prop('checked')){
        $.each(_catData, function(index, cat){
            var catName = cat.name;
            if(typeof rosterData[0].cats[catName] != "undefined"){
                rosterProps.push("cats");
                rosterProps.push(catName);
                studentHeaders.push(catName);
            }
        });
    }
    if($("#student-exam-grade-checkbox").prop('checked')){
        rosterProps.push("grade");
        studentHeaders.push("Final Score");
    }
    if($("#student-result-checkbox").prop('checked')){
        rosterProps.push("passed");
        studentHeaders.push("Pass/Fail");
    }
    if($("#student-seat-checkbox").prop('checked')){
        rosterProps.push("seat_num");
        studentHeaders.push("Seat Number");
    }

    csvData.push(studentHeaders);
    $.each(rosterData, function(index, student){
        var studentData = [];
        for(var i = 0; i < rosterProps.length; i++){
            if(rosterProps[i] == "cats"){
                i++;
                studentData.push(student.cats[rosterProps[i]] + " out of " + student.cats[rosterProps[i] + " Max"]);
            }
            else if(rosterProps[i] == "grade"){
                studentData.push(student.grade + " out of " + student.possible_grade);
            }
            else if(rosterProps[i] == "passed"){
                studentData.push(student.passed == "1" ? "Pass" : "Fail");
            }
            else{
                studentData.push(student[rosterProps[i]]);
            }
        }
        csvData.push(studentData);
    })
    return csvData;
}

function loadTable(data) 
{
    $.each(data, function(i, item) {
        var row = buildItemSummaryRow(item);
      //   var detailRow = buildItemDetailRow(item);

        $("#" + item.state + "-panel > .table-responsive > ." + _tableId).append(row);
      //   $("#" + item.state + "-panel > .table-responsive > ." + _tableId).append(detailRow);
    });
    $(".tab-pane.active .main-table>thead th:nth-of-type(1)").trigger('click');
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

function createItem()
{
    $.post("../ape/create_ape.php", $("#" + _formId).serialize(), function(lastInsertId){
        $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_id",
        exam_id: lastInsertId}, 
        function(item){
            loadTable(item);
        },
        "json");

        addExamCats(lastInsertId);        
    });
}

function addExamCats(examId)
{
    $(".cat-row").each(function(){
        var catId = $(this).find("select").val();//returns null if none selected
        var possibleGrade = $(this).find("input").val();//returns "" if none selected
        var dataId = $(this).attr("data-id");

        $.post("../ape/add_exam_cat.php",
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        exam_id: examId,
        cat_id: catId,
        possible_grade: possibleGrade},
        function(lastInsertId){
            addGraders(lastInsertId, dataId);
        });
    });
}

function addGraders(examCatId, dataId)
{
    $(".cat-grader-row[data-id='" + dataId + "']").find("select").each(function(){
        var graderId = $(this).val();

        $.post("../ape/assign_grader.php",
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        exam_cat_id: examCatId,
        user_id: graderId});
    });
}

function updateItem()
{
    $.post("../ape/update_ape.php", $("#" + _formId).serialize(), function(){
        var item = $("#" + _formId).serialize();
        
        if(_catSectionModified){
            $.post("../ape/remove_exam_cat.php",
            {requester_id: _userId,
            requester_type: _userType,
            requester_session_id: _userSessionId,
            exam_id: $("#item-id").val()},
            function(){
                addExamCats($("#item-id").val());
            });
        }

        $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_id",
        exam_id: $("#item-id").val()}, 
        function(item){
            var row = buildItemSummaryRow(item[0]);
            // var detailRow = buildItemDetailRow(item[0]);
            //$("tr[data-target='#item-" + item[0].exam_id + "']").replaceWith(row);
            // $("tr[data-id='item-" + item[0].exam_id + "']").replaceWith(detailRow);
            $("tr[data-id='item-" + item[0].exam_id + "']").replaceWith(row);
        },
        "json");
    }); 
}

function onclickCreate()
{
    clearForm();
    $("#modal-title").html("Create an Exam");
    $("#submit-button").attr("data-action", "create");
	$("#submit-button").html("Create");
	$('a[href="#Report_tab"]').add('a[href="#Roster_tab"]').parent().toggleClass('hidden', true);
}

function onclickEdit(e) 
{
    clearForm();
    var itemId = e.currentTarget.dataset["id"];
    $("#item-id").val(itemId);
    //$("#modal-title").html("Edit an Exam");
    $("#submit-button").attr("data-action", "update");
    $("#submit-button").html("Save changes");
	$('a[href="#Report_tab"]').add('a[href="#Roster_tab"]').parent().toggleClass('hidden', false);

    $.get("../ape/get_all_apes.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "get_by_id",
    exam_id: itemId}, 
    function(item){
		$("#modal-title").html(item[0].name);
        $.each(item[0], function(name, val){
            var el = $('[name="'+name+'"]');
            el.val(val);
        });
        $('input[name="date"]').triggerHandler('changeDate');
        $("#Report_tab #file-name").val(item[0].name.split(' ').join('_'));
		$("#Report_tab .archived-only").toggle(_selectedTab == "Archived");
    },
    "json");

    $.get("../ape/get_exam_cats.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    exam_id: itemId}, 
    populateExamCats,
    "json");

    /*_deletedExamCats = Array();
    _modifiedExamCats = Array();*/
}

function populateExamCats(examCatData){
    $.each(examCatData, function(index, examCat){
        onclickAddCat();
        _catSectionModified = false;
        
        var catRow = $(".cat-row:last");
        catRow.find("option[value='" + examCat.cat_id + "']").prop("selected", true);
        catRow.find("input").val(examCat.possible_grade);

        var dataId = catRow.attr("data-id");

        $.get("../grade/get_graders.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_exam_cat_id",
        exam_cat_id: examCat.exam_cat_id}, 
        function(graderData){
            if(graderData.length > 0){
                catRow.find(".btn-info").click();
                populateGraders(graderData, dataId);
            }
        },
        "json");
    });
    calcPossibleGrade();
}

function populateGraders(graderData, dataId){
    var graderRow = $(".cat-grader-row[data-id='" + dataId + "']");
    $.each(graderData, function(index, grader){
        var fakeE = {currentTarget: graderRow.find(".btn-primary")[0]};
        onclickAddGrader(fakeE);
        _catSectionModified = false;
        
        graderRow.find("select:last").find("option[value='" + grader.user_id + "']").prop("selected", true);
    });
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
    $('a[href="#Exam_tab"]').tab('show');
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
        loadTable,
        "json");
}

function onclickTabExam() {
   var btn = $('#submit-button'),
   action = btn.attr("data-action");
   
   btn.attr("data-tab", "exam");

   if (action === "create") {
      btn.html('Create');
   }
   else if (action === "update") {
      btn.html('Save changes');
   }
}

function onclickTabReport() {
	$('#submit-button').attr("data-tab", "report").html("Generate &amp; Download");
}

function onclickRoster(e)
{
    headersArr = new Array();
    getGrade = -1;

    if (_selectedTab != "Open")
    {
        //$("#add-student-btn").hide();

        headersArr = ["ID", "First Name", "Last Name", "Seat #", "Grade", "Result", "Action"];
        getGrade = 1;
    }
    else
    {
        //$("#add-student-btn").show();
        //$("#add-student-btn").click(onclickRegNewStudentBtn);

        headersArr = ["ID", "First Name", "Last Name", "Seat #", "Action"];
        getGrade = 0;
    }
    
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
                                loadRosterTableHasGrades(item);
                            break;

                case "Hidden":
                loadRosterTableHasGrades(item);
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

// function onclickRegNewStudentBtn()
// {
//     modifyLookupModal();
// }

// function modifyLookupModal()
// {
//     $("#lookup-button").remove();
//     var $newLookupBtn = $("<button type='button' id='lookup-button' class='btn btn-primary'>Look up</button>");
//     $newLookupBtn.click(onclickLookup);
//     $("#lookup-string").after($newLookupBtn);

//     headersArr = ["Student ID", "First Name", "Last Name", "Email", "State", "Action"];
//     table = buildMainTable(headersArr);
//     $("#lookup-table-wrapper").html(table);
// }

function onclickLookup()
{
    $("#lookup-results > ."+_tableId + " tbody").empty();
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
    
                $("#lookup-results > ." + _tableId).append(row);

                
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
    if(item.passed == 1)
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
    var $bttnInfo = $('<button type="button" class="btn btn-info" data-target="#item-' + summaryData.id + '" data-toggle="collapse" data-passing-grade="' + item.passing_grade + '" data-exam-id="' + item.exam_id + '"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span><span class="sr-only">Info</span></button>');
    $bttnInfo.attr("data-id", summaryData.id);
    $bttnInfo.click(onclickInfoGrade);
    //create edit button
    var $bttnEdit = $('<button type="button" class="btn btn-warning" data-action="edit-grade" data-target="#item-' + summaryData.id + '" data-toggle="collapse" data-passing-grade="' + item.passing_grade + '" data-exam-id="' + item.exam_id + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span></button>');
    $bttnEdit.attr("data-id", summaryData.id); //add unique ID from item as a data tag
    $bttnEdit.click(onclickEditGrade);

    if(_selectedTab == "Grading")
    {
        summaryRow.append(
            $('<td class="btns">').append(
            $('<div class="btn-group" role="group">').append($bttnInfo, $bttnEdit, ' ')
            )
        );
    }
    else if(_selectedTab == "Archived" || _selectedTab == "Hidden")
    {
        summaryRow.append(
            $('<td class="btns">').append(
            $('<div class="btn-group" role="group">').append($bttnInfo, ' ')
            )
        );
    }

    
    
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
        if (detailData.hasOwnProperty(property) && !property.includes("Max") && !property.includes("ID")) 
        {
            if(detailData[property] != detailData.id)
            {
                detailRowHTML += '<tr class="active">'
                                + '<th>' + property + ': </th>'
                                + '<td> <input type="number" class="cat-grade-input" disabled value="' + detailData[property] + '" data-id="' + detailData[property + " ID"] + '"' + ' min="0" max="' + detailData[property + " Max"] + '">' + ' / ' + detailData[property + " Max"] + '</td>'
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
    
    if(e.currentTarget.dataset["action"] == "edit-grade")
    {
        //console.log("edit");
        _isEditing = true;
        toggleSaveGradeBtn(true, itemId);
        
    }
    else
        if(e.currentTarget.dataset["action"] == "save-grade")
        {
            //console.log("save");

            onSaveGrade(e);

            toggleSaveGradeBtn(false, itemId);
            _isEditing = false;
            
        }
}

function onclickInfoGrade(e)
{
    var itemId = e.currentTarget.dataset["id"];
    $detailRow =  $("#roster-table-wrapper tr[class='item-detail-row'] div[id='item-" + itemId + "']");

    if(_isEditing)
    {
        if (confirm("Are you sure you want to discard unsaved changes?"))
        {
            $("#item-" + itemId + " .cat-grade-input").prop("disabled", true);
            
                toggleSaveGradeBtn(false, itemId)
            
                //Disable Edit button collapse when the detail row has been expanded earlier by Info button
                if(!$detailRow.hasClass("in"))
                {
                    $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning").removeAttr("data-toggle");
                }
                else
                {
                    $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning").attr("data-toggle", "collapse");
                }
            _isEditing = false;
        }
        else
        {
            e.stopPropagation();
        }
    }
    else
    {
        $("#item-" + itemId + " .cat-grade-input").prop("disabled", true);
        
            toggleSaveGradeBtn(false, itemId)
        
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

    

    
}

function toggleSaveGradeBtn(isSave, itemId)
{
    if(isSave)
    {
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning .glyphicon").removeClass("glyphicon-pencil");
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning .glyphicon").addClass("glyphicon-floppy-disk");
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning").attr("data-action", "save-grade");
    }
    else
    {
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning .glyphicon").removeClass("glyphicon-floppy-disk");
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning .glyphicon").addClass("glyphicon-pencil");
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning").attr("data-action", "edit-grade");
    }
}

function onSaveGrade(e)
{
    var studentId = e.currentTarget.dataset["id"];
    var examId = e.currentTarget.dataset["examId"];
    
    var catArrs = $("#roster-table-wrapper tr[class='item-detail-row'][data-id='item-" + studentId + "'] .cat-grade-input"); 
    var totalGrade = 0;

    $.each(catArrs, function(i, theCat){

        $.post("../grade/update_cat_grade.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        grader_exam_cat_id: theCat.dataset["id"],
        grade: theCat.value,
        student_id: studentId});

        totalGrade += parseInt(theCat.value);
    });

    //Get and parse the max total grade 
    var row = $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + studentId + "']").children();
    var maxGrade = parseInt(((row[4].innerText).split("/"))[1]);
 
    row[4].innerText = totalGrade + "/" + maxGrade;

    $("#item-" + studentId + " .cat-grade-input").prop("disabled", true);

    var passingGrade = parseInt(e.currentTarget.dataset["passingGrade"]);

    if(totalGrade >= passingGrade)
    {
        row[5].innerText = "Passed";

        $.post("../grade/update_exam_grade.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        exam_id: examId,
        grade: totalGrade,
        passed: 1,
        student_id: studentId});
    }
    else
    {
        row[5].innerText = "Fail";

        $.post("../grade/update_exam_grade.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        exam_id: examId,
        grade: totalGrade,
        passed: 0,
        student_id: studentId});
    }
}