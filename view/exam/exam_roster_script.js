var _isEditing = false;
var _curGrade = 0;
var _curGradeComment = "";

$("#btn-lookup").click(onclickLookup);

function loadTabRoster()
{
    toggleSubmitEdit(false, true);

    $('#submit-button').attr("data-tab", "roster").toggleClass("hidden", false);
    $("#submit-button").html("Finalize All Grades");
    
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

function onclickEditSeat(e)
{
    var itemId = e.currentTarget.dataset["id"];
    

    if(e.currentTarget.dataset["action"] == "edit")
    {
        //console.log("edit");
        _isEditing = true;
        //toggleSaveEditBtn(true, itemId);

        $("#roster-table-wrapper tr[data-id='item-" + itemId + "'] .student-seat-input").prop("disabled",false);
        $("#roster-table-wrapper tr[data-id='item-" + itemId + "'] button[data-action='edit'] .glyphicon").removeClass("glyphicon-pencil").addClass("glyphicon-floppy-disk");
        $("#roster-table-wrapper tr[data-id='item-" + itemId + "'] button[data-action='edit']").attr("data-action", "save");
    }
    else
        if(e.currentTarget.dataset["action"] == "save")
        {
            //console.log("save");

            onSaveSeat(e);
            $("#roster-table-wrapper tr[data-id='item-" + itemId + "'] .student-seat-input").prop("disabled",true);
            $("#roster-table-wrapper tr[data-id='item-" + itemId + "'] button[data-action='save'] .glyphicon").removeClass("glyphicon-floppy-disk").addClass("glyphicon-pencil");
            $("#roster-table-wrapper tr[data-id='item-" + itemId + "'] button[data-action='save']").attr("data-action", "edit");
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
    requester_session_id: _userSessionId,
    exam_id: examId,
    student_id: studentId,
    seat_num: seatNum});
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
    //console.log(item);
    var passedResult = "";
    var gradeStr = "";
    if(item.passed == 1)
    {
        passedResult = "Passed";
    }
    else
    {
        passedResult = "Fail";
    }

    if (typeof item.grade === "undefined") 
    {
        gradeStr = "N/A";
        passedResult = "N/A";
    }
    else
    {
        gradeStr = item.grade + "/" + item.possible_grade;
    }

    var summaryData = {
        id: item.student_id,
        studentid: item.student_id,
        fname: item.f_name,
        lname: item.l_name,
        seatnum: item.seat_num,
        grade: gradeStr,
        result: passedResult
    };
    var summaryRow = buildItemRow(summaryData, false);
    summaryRow.attr("data-possible-grade", item.possible_grade);

    //create info button
    var $bttnInfo = $('<button type="button" class="btn btn-info btn-labeled" data-target="#item-' + summaryData.id + '" data-toggle="collapse" data-passing-grade="' + item.passing_grade + '" data-max-grade="' + item.possible_grade + '" data-exam-id="' + item.exam_id + '"><span class="btn-label" aria-hidden="true"><i class="glyphicon glyphicon-list-alt"></i></span>View Grades</button>');
    $bttnInfo.attr("data-id", summaryData.id);
    $bttnInfo.click(onclickInfoGrade);

        summaryRow.append(
            $('<td class="btns">').append(
            $('<div class="btn-group" role="group">').append($bttnInfo, ' ')
            )
        );
   

    
    
    var detailData = {
        id: item.student_id,
        passing_grade: item.passing_grade
    };

    var namesArr = Array();

    $.each(item["cats"], function(i, theCat)
    {
        detailData[i] = theCat;
    });

    //console.log(detailData);

    var detailRow = buildGradeDetailRow(detailData);

    $("#roster-table-wrapper > ." + _tableId).append(summaryRow);
    $("#roster-table-wrapper > ." + _tableId).append(detailRow);

    $(".edit-grade-btn").click(onclickEditGrade);
    $(".save-grade-btn").click(onclickEditGrade);
    $(".discard-grade-btn").click(onclickEditGrade);

    if(_selectedTab == "Archived")
    {
        $(".edit-grade-btn-group").remove();
        $(".save-discard-grade-btn-group").remove();
    }
    else
    {
        $(".edit-grade-btn-group").show();
        $(".save-discard-grade-btn-group").hide();
    }


    
}


function buildGradeDetailRow(detailData)
{
    var detailRowHTML = '<tr class="item-detail-row" data-id="item-' + detailData.id + '">'
    + '<td class="details" colspan="100%">'
    + '<div class="collapse" id="item-' + detailData.id + '">'
    + '<table class="table table-condensed">'
    + '<tbody>';

    
    $.each(detailData, function(i, theCat)
    {
        if(i != "id" && i != "passing_grade")
        {
            var rowColorClass = "no-color-row";
            var inputCommentType = "text";
            var commentString = "";

            if(theCat.final_grade == false)
            {
                rowColorClass = "red-row";
            }

            if(theCat.comment == "")
            {
                inputCommentType = "hidden";
            }
            else
            {
                commentString =  theCat.edited_by + ': ' + theCat.comment;
            }


            var editGradeBtn = '<button type="button" class="btn btn-warning btn-labeled edit-grade-btn" data-action="edit" data-id="' + theCat.exam_cat_id + '" data-parent-id="' + detailData.id + '" data-passing-grade="' + detailData.passing_grade + '"><span class="btn-label" aria-hidden="true"><i class="glyphicon glyphicon-pencil"></i></span>Edit Grade</button>';
            var saveGradeBtn = '<button type="button" class="btn btn-warning save-grade-btn" data-action="save" data-id="' + theCat.exam_cat_id + '" data-parent-id="' + detailData.id + '" data-passing-grade="' + detailData.passing_grade + '">Save</button>';
            var discardGradeBtn = '<button type="button" class="btn btn-warning discard-grade-btn" data-action="discard" data-id="' + theCat.exam_cat_id + '" data-parent-id="' + detailData.id + '" data-passing-grade="' + detailData.passing_grade + '">Discard</button>';
            
            
            detailRowHTML += '<tr class="active parent-detail-row" data-id="' + theCat.exam_cat_id + '" data-parent-id="item-' + detailData.id + '">'
                                + '<th class="' + rowColorClass + '">' + theCat.name + ' final grade: </th>'
                                + '<td class="' + rowColorClass + '">'
                                    + '<input type="number" class="cat-grade-input form-control" disabled value="' 
                                    + theCat.final_grade + '" data-id="' + theCat.exam_cat_id + '"' 
                                    + ' min="0" max="' + theCat.possible_grade + '">' + ' / ' + theCat.possible_grade 
                                    + '<input type="' + inputCommentType + '" class="cat-comment-input form-control" disabled value="' + commentString + '" data-id="' + theCat.exam_cat_id + '">' 
                                + '</td>'
                                + '<td class="btns ' + rowColorClass + '">'
                                    + '<div class="btn-group edit-grade-btn-group">'+editGradeBtn+'</div>'
                                    + '<div class="btn-group save-discard-grade-btn-group" role="group">' + saveGradeBtn + discardGradeBtn + '</div>'
                                + '</td>'
                            + '</tr>';
    
            for (var property in theCat.graders_grades)
            {
                detailRowHTML += '<tr class="active sub-detail-row">'
                                + '<th>' + property + ' : </th>'
                                + '<td>' + theCat.graders_grades[property] + '/' + theCat.possible_grade + '</td>'
                                + '<td></td>'
                                + '</tr>';
            }

        }
        
    });


    detailRowHTML += '</tbody></table></div></td></tr>';
    return detailRowHTML;
}



function onclickEditGrade(e)
{
    var itemId = e.currentTarget.dataset["id"];
    var parentId = e.currentTarget.dataset["parentId"];
    var passingGrade = e.currentTarget.dataset["passing_grade"];
    var gradeInputSelector = ".parent-detail-row[data-parent-id='item-" + parentId + "'][data-id='" + itemId + "'] .cat-grade-input";
    var commentInputSelector = ".parent-detail-row[data-parent-id='item-" + parentId + "'][data-id='" + itemId + "'] .cat-comment-input";

    if(e.currentTarget.dataset["action"] == "edit")
    {
        _isEditing = true;
        toggleSaveEditBtn(true, parentId, itemId);

        $(commentInputSelector).attr("type", "text");
        $(commentInputSelector).attr("placeholder", "Comment"); 
        
        _curGrade = $(gradeInputSelector).val();
        _curGradeComment = $(commentInputSelector).val();
    
    }
    else
    {
        if(e.currentTarget.dataset["action"] == "save")
        {
            onSaveGrade(e);

            toggleSaveEditBtn(false, parentId, itemId);
        
            _isEditing = false;

            _curGrade = $(".parent-detail-row[data-parent-id='item-" + parentId + "'][data-id='" + itemId + "'] .cat-grade-input").val();
            _curGradeComment = $(commentInputSelector).val();
        

            
        }

        if(e.currentTarget.dataset["action"] == "discard")
        {
            toggleSaveEditBtn(false, parentId, itemId);

            $(gradeInputSelector).val(_curGrade); 
            $(commentInputSelector).val(_curGradeComment); 
            
            if(_curGradeComment == "")
            {
                $(commentInputSelector).attr("type","hidden");
            }

            _isEditing = false;
        }
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

function toggleSaveEditBtn(isEdit, parentId, itemId)
{
    if(isEdit)
    {
        $(".parent-detail-row[data-parent-id='item-" + parentId + "'][data-id='" + itemId + "'] .save-discard-grade-btn-group").show();
        $(".parent-detail-row[data-parent-id='item-" + parentId + "'][data-id='" + itemId + "'] .edit-grade-btn-group").hide();
        $(".parent-detail-row[data-parent-id='item-" + parentId + "'][data-id='" + itemId + "'] .cat-comment-input").prop("disabled", false);
        $(".parent-detail-row[data-parent-id='item-" + parentId + "'][data-id='" + itemId + "'] .cat-grade-input").prop("disabled", false);
    }
    else
    {
        $(".parent-detail-row[data-parent-id='item-" + parentId + "'][data-id='" + itemId + "'] .save-discard-grade-btn-group").hide();
        $(".parent-detail-row[data-parent-id='item-" + parentId + "'][data-id='" + itemId + "'] .edit-grade-btn-group").show();
        $(".parent-detail-row[data-parent-id='item-" + parentId + "'][data-id='" + itemId + "'] .cat-comment-input").prop("disabled", true);
        $(".parent-detail-row[data-parent-id='item-" + parentId + "'][data-id='" + itemId + "'] .cat-grade-input").prop("disabled", true);
    }
}


function onSaveGrade(e)
{
    var examId = _origClickEvent.currentTarget.dataset["id"];
    var examCatId = e.currentTarget.dataset["id"];
    var studentId = e.currentTarget.dataset["parentId"];
    var finalGrade = $(".parent-detail-row[data-parent-id='item-" + studentId + "'][data-id='" + examCatId + "'] .cat-grade-input").val();
    var comment = $(".parent-detail-row[data-parent-id='item-" + studentId + "'][data-id='" + examCatId + "'] .cat-comment-input").val();
    var catArrs = $(".parent-detail-row[data-parent-id='item-" + studentId + "'] .cat-grade-input"); 
    var possibleGrade = $("#roster-table-wrapper .item-row[data-id='item-" + studentId + "']").data("possibleGrade");
    var totalGrade = 0;
    var isGradingFinished = true;
    
    $.post("../grade/add_final_cat_grade.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    student_id: studentId,
    exam_cat_id: examCatId,
    final_grade: finalGrade,
    comment: comment, 
    edited_by: _userId});

    $.each(catArrs, function(i, theCat)
    {
        if(theCat.value == "")
        {
            isGradingFinished = false;
        }
        else
        {
            totalGrade += parseInt(theCat.value);
        }
        
    });

    var row = $("#roster-table-wrapper tr[class='item-row'][data-id='item-" + studentId + "']").children();

    if(isGradingFinished)
    {
        //Get and parse the max total grade 
        
        var maxGrade = parseInt(possibleGrade);
    
        row[4].innerText = totalGrade + "/" + maxGrade;

        
        var passingGrade = parseInt(e.currentTarget.dataset["passingGrade"]);
    
        if(totalGrade >= passingGrade)
        {
            row[5].innerText = "Passed";
    
            $.post("../grade/add_exam_grade.php", 
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
    
            $.post("../grade/add_exam_grade.php", 
            {requester_id: _userId,
            requester_type: _userType,
            requester_session_id: _userSessionId,
            exam_id: examId,
            grade: totalGrade,
            passed: 0,
            student_id: studentId});
        }
    }
    else
    {
        row[4].innerText = "N/A";
        row[5].innerText = "N/A";
    }



    $(".item-detail-row[data-id='item-" + studentId + "'] tr[data-id='" + examCatId + "'] .red-row").removeClass("red-row");
}


function finalizeGrades(e)
{
    examId = _origClickEvent.currentTarget.dataset["id"];
    if(window.confirm("Are you sure you want to finalize all grades of this exam? All students will be notified and this exam will be archived."))
    {
        $.post("../ape/update_ape.php",
        {
            requester_id: _userId,
            requester_type: _userType,
            requester_session_id: _userSessionId,
            exam_id: examId,
            state: "Archived",
            request: "update_state"
        });
    }

    
}