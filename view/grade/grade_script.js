/**
 * Grade page script
 * @author: Andrew Robinson
 * @version: 1.0
 */

var _userId = "";
var _userType = "";
var _userSessionId = "";

var _targetModal = "detail-modal";
var _tableId = "main-table";
var _formId = "main-form";

$(document).ready(loaded);

function loaded() 
{
    //get rid of default toolbar
    $("div .table-toolbar").remove();

    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");
    
    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
        console.log(jqxhr.responseText);
        $(".msg-box").addClass("alert-danger");
        $(".msg-box").fadeIn();
        $("#msg-box-text").html("<strong>Error!</strong> " + jqxhr.responseText);
    });

    $("[name='submit-graded-button'").prop("disabled", true);
    $("[name='submit-graded-button'").click(function(e){submitForm(e, true);});
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
    $(".msg-box").hide();

    buildTable();
    getAllItems();

    $(".main-table>thead th").not("th:last-of-type")
     .click(onClickSort)
     .mousedown(function(e){ e.preventDefault(); });
}

function buildTable()
{
    var headersArr = ["Exam", "Category"];
    var table = buildMainTable(headersArr);
    $(".table-responsive").html(table);
}

function buildItemSummaryRow(item)
{
    var summaryData = {
        id: item.grader_exam_cat_id,
        exam: item.exam_name,
        cat: item.cat_name
    };

    var row = buildItemRow(summaryData, false);
    row.append(buildGradeButton(item));

    return row;
}

//Create grade button to be added to table row
function buildGradeButton(item){
    var bttnGrade = $('<button type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#detail-modal">Grade<span class="sr-only">Grade</span></button>');
    bttnGrade.attr("data-id", item.grader_exam_cat_id); //add unique ID from item as a data tag
    bttnGrade.attr("exam-id", item.exam_id);
    bttnGrade.attr("exam-name", item.exam_name);
    bttnGrade.attr("cat-name", item.cat_name);

    bttnGrade.click(onclickGrade);
    return $('<td class="btns">').append($('<div class="btn-group" style="width:100%" role="group">').append(bttnGrade));
}

function loadTable(data) 
{
    $.each(data, function(i, item) {
        var row = buildItemSummaryRow(item);
        $("." + _tableId).append(row);
    });
}

//Submit entered grade(s) to database
//submitMultiple means submit all entered grades for this exam_cat
//!submitMultiple means submit only the grade corresponding to the button clicked
function submitForm (e, submitMultiple)
{
    if(window.confirm("Only administrator accounts can change submitted grades.\nClick 'OK' to continue:"))
    {
        if(submitMultiple)
        {
            var submittableBtns = $("[name='submit-button']:not(:disabled, :hidden)");
            $.each(submittableBtns, function(i, btn){
                submitSingleGrade($(btn));
            })
        }
        else
        {
            var btn = $(e.currentTarget);
            submitSingleGrade(btn);
        }
                
    }     
}

function submitSingleGrade(btn)
{
    var gecid = btn.attr("grader-exam-cat-id");
    
    var sendData = {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    grader_exam_cat_id: gecid,
    exam_id: btn.attr("exam-id"),
    seat_num: btn.attr("seat"),
    grade: btn.parent().find("input").val()
    };

    $.post("../grade/add_cat_grade_by_seat.php", sendData, function(){
        //remove entry in modal
        btn.closest(".form-horizontal").remove();

        //if modal is empty, hide it and disable grade button for this exam_cat
        if($("button[grader-exam-cat-id='" + gecid + "']").length === 0){
            $("#detail-modal").modal("hide");
            changeBttnGrade(gecid);
        }
    });
}

function onclickGrade(e) 
{
    var btn = e.currentTarget;

    //hide grade forms for other exams/categories from the modal
    $("[name='submit-button']:not([grader-exam-cat-id='" + btn.dataset["id"] + "'])").closest(".form-horizontal").hide();
    //make sure grade forms for this exam_cat are shown in the modal
    var currentForms = $("[name='submit-button'][grader-exam-cat-id='" + btn.dataset["id"] + "']").closest(".form-horizontal");
    currentForms.show();

    $('#detail-modal').on('shown.bs.modal', function() {
        currentForms.first().find("input").focus();
    });    
    
    //change modal title
    $(".modal-title").html("Grading " + $(btn).attr("exam-name") + ": " + $(btn).attr("cat-name"));
}

function getAllItems()
{
    $("."+ _tableId + " .item-row").empty();
    
    $.get("../grade/get_assigned_exam_cat.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId}, 
        function(data){
            loadTable(data);
            loadModal(data)
        },
        "json");
}

function loadModal(assignedExamCats)
{
    //for each exam_cat assigned to this grader, find all ungraded
    //seats and add corresponding grade forms to the modal
    $.each(assignedExamCats, function(i, graderExamCat){
        $.get("../grade/get_ungraded_seats.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        grader_exam_cat_id: graderExamCat.grader_exam_cat_id,
        exam_id: graderExamCat.exam_id}, 
        function(ungradedSeats){
            buildModalForm(ungradedSeats, graderExamCat);
        },
        "json");
    });
}

function buildModalForm(ungradedSeats, graderExamCat)
{
    var gecid = graderExamCat.grader_exam_cat_id;
    var possGrade = graderExamCat.possible_grade;
    var exam = graderExamCat.exam_id;
    //if no ungraded seats, disable grade button for this exam_cat
    if(ungradedSeats.length == 0){
        changeBttnGrade(gecid);
    }
    else{
        $.each(ungradedSeats, function(i, seat) {
            var sNum = seat.seat_num;
            var form = 
                "<div class='form-horizontal'>" +
                    "<form>" +
                        "<div class='row'>" +
                            "<div class='form-group'>" +
                                "<label for='name' class='col-sm-4 control-label'>Seat Number " + sNum + " Grade:</label>" +
                                "<div class='col-sm-3'>" +
                                    "<input type='text' class='form-control' name='grade'></input>" +
                                "</div>" +
                                "<button type='button' class='btn btn-primary col-sm-3' name='submit-button' seat='" + sNum + 
                                "' grader-exam-cat-id='" + gecid + "' exam-id='" + exam + "'>Submit</button>" +
                            "</div>" +
                        "</div>" +
                    "</form>" +
                "</div>";
            $(".modal-body").append(form);

            var bttnSubmit = $("[seat='" + sNum + "'][grader-exam-cat-id='" + gecid + "']");
            
            //submit buttons are initially disabled
            bttnSubmit.prop("disabled", true);
            bttnSubmit.click(function(e){submitForm(e, false);});

            //avoid default form submission behavior
            bttnSubmit.closest("form").submit(function(){return false;});

            //runs on every keyup in grade textboxes
            bttnSubmit.closest(".form-group").find("input").keyup(function(e){
                //enable corresponding submit button and submit graded button if something entered
                if(this.value.length > 0)
                {
                    bttnSubmit.prop("disabled", false);
                    submitGradedCheck();
                }
                //disable corresponding submit button if nothing entered
                //disable submit graded button if no grades are entered
                else if(this.value.length === 0)
                {
                    bttnSubmit.prop("disabled", true);
                    submitGradedCheck();
                }

                //limit grades to range 0 - maximum category score
                if(parseInt(this.value) > possGrade)
                    this.value = possGrade;
                else if(parseInt(this.value) < 0)
                    this.value = 0;

                //if something has been entered and user hits enter key, submit grade
                if(bttnSubmit.prop("disabled") === false && e.keyCode === 13)
                    bttnSubmit.click();
            });
        });        
    }
}

function changeBttnGrade(gecid)
{
    var bttnGrade = $("[data-id='" + gecid + "']");
    bttnGrade.removeClass("btn-primary");
    bttnGrade.addClass("btn-success");
    bttnGrade.html("<span class='glyphicon glyphicon-ok'></span><span class='sr-only'>Graded</span>")
    bttnGrade.prop("disabled", true);
}

function submitGradedCheck()
{
    //if no grades are entered, disable submit graded button
    if($("[name='submit-button']:not(:disabled, :hidden)").length === 0)
        $("[name='submit-graded-button'").prop("disabled", true);

    //if grades are entered, enable submit graded button
    else
        $("[name='submit-graded-button'").prop("disabled", false);
}