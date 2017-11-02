var _isEditing = false;

$("#btn-lookup").click(onclickLookup);


function loadTabRoster()
{
    _isEditing = false;
    headersArr = ["ID", "First Name", "Last Name", "Email", "State", "Action"];
    table = buildMainTable(headersArr);
    $("#lookup-results").html(table);
    $("#lookup-string").val("");

    headersArr = new Array();
    getGrade = -1;

    if (_selectedTab != "Open" && _selectedTab != "In_Progress")
    {
        $("#Roster_tab .col-left").hide();
        $("#Roster_tab .col-right").removeClass("col-md-6");
        $("#Roster_tab .col-right").addClass("col-md-12");

        headersArr = ["ID", "First Name", "Last Name", "Seat #", "Grade", "Result", "Action"];
        getGrade = 1;
    }
    else
    {
        $("#Roster_tab .col-left").show();
        $("#Roster_tab .col-right").removeClass("col-md-12");
        $("#Roster_tab .col-right").addClass("col-md-6");

        headersArr = ["ID", "First Name", "Last Name", "Seat #", "Action"];
        getGrade = 0;
    }

    //If it's in-class exam page, remove student lookup function/UI elements in Roster tab
    //and load in-class students to lookup result table
    if (_userType == "Teacher")
    {
        //$("#lookup-form > .form-group .btn-primary").remove();
        //$("#lookup-form > .form-group").css("visibility", "hidden");
        $("#lookup-form > .form-group > .col-sm-12").html("<h5>In-class Students</h5>");


        $.get("../account/get_account_info.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_type",
        type: "Student"}, 
        loadLookupTable,
        "json");
    
    }
    
    var table = buildMainTable(headersArr);
    $("#roster-table-wrapper").html(table);

    var itemId = _origClickEvent.currentTarget.dataset["id"];
    
    $("#roster-form > #item-id").val(itemId);

    //clear 2 tables
    $("#roster-table-wrapper > ."+_tableId + " tbody").empty();
    $("#lookup-results > ."+_tableId + " tbody").empty();



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
    $("#roster-table-wrapper > ."+_tableId + " tbody").empty();
    $.each(data, function(i, item) 
    {
            switch (_selectedTab)
            {
                case "Open":    loadRosterTableNoGrades(item);
                                break;
                                
                
                case "In_Progress": loadRosterTableNoGrades(item);
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
            $("#roster-table-wrapper tr[data-id='item-" + studentId + "']").remove();
            $("#lookup-results tr[data-id='item-" + studentId + "'] > td:nth-child(5)").html("Ready");
            $("#lookup-results tr[data-id='item-" + studentId + "'] > .btns > .btn-group > .btn-primary").prop("disabled",false);

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
        $.get("../account/student_search.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        search_str: searchStr}, 
        loadLookupTable,
        "json");
    }
}

function loadLookupTable(data)
{
    $("#lookup-results > ."+_tableId + " tbody").empty();
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

        $registerBtn = $('<button type="button" class="btn btn-primary" data-id="' + summaryData.id + '" data-fname="'+ summaryData.f_name +'" data-lname="'+ summaryData.l_name +'">Register</button>');

        if(item.state != "Ready")
        {
            $registerBtn.prop("disabled", true);
        }
        else
        {
            $registerBtn.prop("disabled", false);
        }
        
        $registerBtn.click(onclickRegisterStudent);

        row.append(
            $('<td class="btns">').append(
               $('<div class="btn-group" role="group">').append($registerBtn, ' ')
             )
          );

        $("#lookup-results > ." + _tableId).append(row);
        });
}

function onclickRegisterStudent(e)
{
    var studentId = e.currentTarget.dataset["id"];
    var studentLName = e.currentTarget.dataset["lname"];
    var studentFName = e.currentTarget.dataset["fname"];
    var examId =  $("#roster-form > #item-id").val();

    $.post("../ape/register.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    student_id: studentId,
    exam_id: examId}, 
    function(data){
        alert("Student has been added to the exam successfully.");

        $("#lookup-results tr[data-id='item-" + studentId + "'] > td:nth-child(5)").html("Registered");
        $("#lookup-results tr[data-id='item-" + studentId + "'] > .btns > .btn-group > .btn-primary").prop("disabled",true);

        var item = {
            student_id: studentId,
            f_name: studentLName,
            l_name: studentFName,
            seat_num: data
        };
        
        loadRosterTableNoGrades(item);


        /*
        //reload exam roster table
        $("#roster-table-wrapper > ."+_tableId + " tbody").empty();
        $.get("../ape/get_exam_roster.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        exam_id: examId,
        get_grade: getGrade}, 
        loadRosterTable,
        "json");*/
    });
}

function loadRosterTableNoGrades(item)
{
    var summaryData = {
        id: item.student_id,
        studentid: item.student_id,
        fname: item.f_name,
        lname: item.l_name,
        seatnum: item.seat_num
    };

    var row = '<tr class="item-row" data-id="item-' + summaryData.id + '" aria-expanded="true">';
    
        for (var property in summaryData) 
        {
            if (summaryData.hasOwnProperty(property)) 
            {
                if(property != "id" && property != "seatnum")
                {
                    row += '<td>' + summaryData[property] + ' </td>';
                }
                else if(property == "seatnum")
                {
                    row += '<td><input type="number" class="student-seat-input form-control" disabled value="' + summaryData[property] + '"></td>';
                }      
            }
        }

    row = $(row);

    var $bttnDel = $('<button type="button" class="btn btn-danger">Unregister</button>');
    $bttnDel.attr("data-id", summaryData.id);
    $bttnDel.click(onclickDeleteStudent);

    var $bttnEditSeat = $('<button type="button" class="btn btn-warning"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only"></span></button>');
    $bttnEditSeat.attr("data-id", summaryData.id);
    $bttnEditSeat.attr("data-action", "edit");
    $bttnEditSeat.click(onclickEditSeat);
    

    row.append(
        $('<td class="btns">').append(
        $('<div class="btn-group" role="group">').append($bttnEditSeat, $bttnDel, ' ')
        )
    );
    $("#roster-table-wrapper > ." + _tableId).append(row);
    
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
    var $bttnEdit = $('<button type="button" class="btn btn-warning" data-action="edit" data-target="#item-' + summaryData.id + '" data-toggle="collapse" data-passing-grade="' + item.passing_grade + '" data-exam-id="' + item.exam_id + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span></button>');
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
                                + '<td> <input type="number" class="cat-grade-input form-control" disabled value="' + detailData[property] + '" data-id="' + detailData[property + " ID"] + '"' + ' min="0" max="' + detailData[property + " Max"] + '">' + ' / ' + detailData[property + " Max"] + '</td>'
                                + '</tr>';
                
                
            }
            
            count++;
        }
    }

    detailRowHTML += '</tbody></table></div></td></tr>';
    return detailRowHTML;
}

function onclickEditSeat(e)
{
    var itemId = e.currentTarget.dataset["id"];
    $("#roster-table-wrapper tr[data-id='item-" + itemId + "'] .student-seat-input").prop("disabled",false);

    if(e.currentTarget.dataset["action"] == "edit")
    {
        //console.log("edit");
        _isEditing = true;
        toggleSaveEditBtn(true, itemId);
        
    }
    else
        if(e.currentTarget.dataset["action"] == "save")
        {
            //console.log("save");

            onSaveSeat(e);

            toggleSaveEditBtn(false, itemId);
            _isEditing = false;
            
        }
}

function onSaveSeat(e)
{
    var studentId = e.currentTarget.dataset["id"];
    var examId = _origClickEvent.currentTarget.dataset["id"];
    var seatNum = $("#roster-table-wrapper tr[data-id='item-" + studentId + "'] .student-seat-input").val();

    $.post("../ape/update_student_seat.php", 
    {requester_id: _userId,
    requester_type: _userType,
    exam_id: examId,
    student_id: studentId,
    seat_num: seatNum});

    $("#roster-table-wrapper tr[data-id='item-" + studentId + "'] .student-seat-input").prop("disabled",true);

}


function onclickEditGrade(e)
{
    var itemId = e.currentTarget.dataset["id"];
    $("#item-" + itemId + " .cat-grade-input").prop("disabled", false);
    
    if(e.currentTarget.dataset["action"] == "edit")
    {
        //console.log("edit");
        _isEditing = true;
        toggleSaveEditBtn(true, itemId);
        
    }
    else
        if(e.currentTarget.dataset["action"] == "save")
        {
            //console.log("save");

            onSaveGrade(e);

            toggleSaveEditBtn(false, itemId);
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
            
                toggleSaveEditBtn(false, itemId)
            
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
        
            toggleSaveEditBtn(false, itemId)
        
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

function toggleSaveEditBtn(isSave, itemId)
{
    if(isSave)
    {
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning .glyphicon").removeClass("glyphicon-pencil");
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning .glyphicon").addClass("glyphicon-floppy-disk");
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning").attr("data-action", "save");
    }
    else
    {
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning .glyphicon").removeClass("glyphicon-floppy-disk");
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning .glyphicon").addClass("glyphicon-pencil");
        $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + itemId + "'] .btn-warning").attr("data-action", "edit");
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