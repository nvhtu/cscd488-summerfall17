var _userId = "";
var _userType = "";
var _userSessionId = "";

var _tableId = "main-table";
var _formId = "main-form";

$(document).ready(loaded);

function loaded()
{
    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");

    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
        console.log(jqxhr.responseText);
        $(".msg-box").addClass("alert-danger");
        $(".msg-box").fadeIn();
        $("#msg-box-text").html("<strong>Error!</strong> " + jqxhr.responseText);
    });

    $(".msg-box").hide();
}

function init()
{
    loadGradingProgress();
}

function loadGradingProgress(){
    $.get("../grade/get_num_students_per_exam_cat.php",
        {requester_id: _userId,
        requester_type: _userType},
        getUngradedSeats,
        "json");
}

function getUngradedSeats(data){
    $.each(data, function(i, item){
        $.get("../grade/get_ungraded_seats.php",
            {requester_id: _userId,
            requester_type: _userType,
            grader_exam_cat_id: item.grader_exam_cat_id,
            exam_id: item.exam_id},
            function(ungradedSeats){
                getExamInfo(ungradedSeats, item);
            },
            "json"
        );   
    });
}

function getExamInfo(ungradedSeats, item){
    $.get("../ape/get_all_apes.php",
        {requester_id: _userId,
        requester_type: _userType,
        request: "get_by_id",
        exam_id: item.exam_id},
        function(examInfo){
            console.log(examInfo);
            getCatInfo(examInfo, ungradedSeats, item);
        },
        "json"
    ); 
}

function getCatInfo(examInfo, ungradedSeats, item){
    $.get("../category/get_all_categories.php",
    {requester_id: _userId,
    requester_type: _userType,
    cat_id: item.cat_id},
    function(catInfo){
        generateProgressBar(catInfo, examInfo, ungradedSeats, item);
    },
    "json"
); 
}

function generateProgressBar(catInfo, examInfo, ungradedSeats, item){
    var num_graded = item.num_student - ungradedSeats.length;
    var percent = ((num_graded / item.num_student) * 100).toFixed(2);
    var infohtml =  "<div class='row' style='margin-top:15px'>" +
                        "<div class='col-sm-4'><strong>Grading Progress for " + catInfo[0].name + ":</strong></div>" +
                        "<div class='progress' style='margin-right:10px'>" +
                            "<div class='progress-bar progress-bar-striped' role='progressbar' aria-valuenow='" + percent +
                            "' aria-valuemin='0' aria-valuemax='100' style='width:" + percent + "%'>" +
                                "<span style='color:black'>" + percent + "%</span>" +
                            "</div>" +
                        "</div>" +
                    "</div>";
    if($("#" + examInfo[0].exam_id).length !== 0){
        $("#" + examInfo[0].exam_id).append(infohtml);
    }
    else{
        var html =  "<div class='panel panel-default'>" +
                        "<div class='panel-heading'>" +
                            "<h3 class='panel-title'>" + examInfo[0].name + "</h3>" +
                        "</div>" +
                        "<div class='panel-body' id='" + examInfo[0].exam_id + "'>" + 
                            "<div class='row'>" +
                                "<div class='col-sm-4'><strong>Date: </strong>" + examInfo[0].date + "</div>" +
                                "<div class='col-sm-4'><strong>Time: </strong>" + examInfo[0].start_time + "</div>" +
                            "</div>" +
                            infohtml +
                        "</div>" +
                    "</div>";
        $("#main-panel").append(html);
    }
}