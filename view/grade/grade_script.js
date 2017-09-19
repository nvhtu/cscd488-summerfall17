/**
 * Grade page script
 * @author: Andrew Robinson
 * @version: 1.0
 */
$(document).ready(loaded);

function loaded() 
{
    //Automatic GLOBAL variables
    _userId = "2223";
    _userType = "Grader";
    _userSessionId = "0";
    
    _targetModal = "detail-modal";
    _tableId = "main-table";
    _formId = "main-form";

    $("div .table-toolbar").remove();

    getAllItems();

    buildTable();

    $('#detail-modal').on('hidden.bs.modal', function () {
        $(".modal-body").empty();
    });
    $(".submit-button").click(submitForm);
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

    var row = buildItemRow(summaryData);

    $(row).find(".btn-info").remove();
    $(row).find(".btn-danger").remove();
    $(row).find(".btn-warning").html("Grade");
    $(row).find(".btn-warning").attr("exam-id", item.exam_id);
    $(row).find(".btn-warning").attr("possible-grade", item.possible_grade);

    return row;
}

function loadTable(data) 
{
    $.each(data, function(i, item) {
        var row = buildItemSummaryRow(item);

        $("." + _tableId).append(row);
    });
}

function submitForm (e)
{
    var btn = $(e.currentTarget);

    var sendData = {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    grader_exam_cat_id: $(".modal-body").attr("data-id"),
    exam_id: $(".modal-body").attr("exam-id"),
    seat_num: btn.attr("seat"),
    grade: btn.parent().find("input").val()
    };

    $.post("../grade/add_cat_grade_by_seat.php", sendData, function(){
        btn.parent().parent().parent().parent().remove();
    });        
}

function onclickEdit(e) 
{
    var graderExamCatId = e.currentTarget.dataset["id"];
    var examId = $(e.currentTarget).attr("exam-id");
    var possibleGrade = $(e.currentTarget).attr("possible-grade");
    $("#item-id").val(e.currentTarget.dataset["id"]);

    $.get("../grade/get_ungraded_seats.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    grader_exam_cat_id: graderExamCatId,
    exam_id: examId}, 
    function(data){
        loadModal(data, graderExamCatId, examId, possibleGrade);
    },
    "json");

}

function onclickDelete(e) 
{

}

function getAllItems()
{
    $("."+ _tableId + " .item-row").empty();
    
    $.get("../grade/get_assigned_exam_cat.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId}, 
        loadTable,
        "json");
}

function loadModal(data, graderExamCatId, examId, possibleGrade) 
{
    $(".modal-body").attr("data-id", graderExamCatId);
    $(".modal-body").attr("exam-id", examId);
    $.each(data, function(i, item) {
        var form = "<div class='form-horizontal'>" +
        "<form>" +
            "<div class='row'>" +
                "<div class='form-group'>" +
                    "<label for='name' class='col-sm-4 control-label'>Seat Number " + item.seat_num + " Grade:</label>" +
                    "<div class='col-sm-3'>" +
                        "<input type='number' min='0' max='" + possibleGrade + "' class='form-control' name='grade'/>" +
                    "</div>" +
                    "<button type='button' class='btn btn-primary col-sm-3' name='submit-button' seat='" + item.seat_num + "'>Submit</button>" +
                "</div>" +
            "</div>" +
        "</form>" +
    "</div>";   
    $(".modal-body").append(form);
    });
    $(".btn-primary").click(submitForm);
    $(".modal-body input").keyup(function(){
        if(parseInt(this.value) > possibleGrade)
            this.value = possibleGrade;
        if(parseInt(this.value) < 0)
            this.value = 0;
    });
}