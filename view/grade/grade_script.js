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
    $("div .table-toolbar").remove();

    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");
    
    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
        console.log(jqxhr.responseText);
        $(".msg-box").addClass("alert-danger");
        $(".msg-box").fadeIn();
        $("#msg-box-text").html("<strong>Error!</strong> " + jqxhr.responseText);
    });

    $('#detail-modal').on('hidden.bs.modal', function () {
        $(".modal-body").empty();
    });
    $(".submit-button").click(submitForm);
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
    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    $(".msg-box").hide();

    getAllItems();

    buildTable();
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

    var row = buildItemRow(summaryData, true);

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
    if(window.confirm("Only administrator accounts can change submitted grades.\nClick 'OK' to continue:"))
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
    if(data.length == 0){
        $(".modal-body").append(
        '<div class="msg-box alert-success alert fade in">' +
            '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
            '<p>You\'ve submitted all grades for this section</p>' +
        '</div>');
        $(".alert-success").fadeIn();
    }
    else{
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
}