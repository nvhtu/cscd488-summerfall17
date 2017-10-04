/**
 * Settings page script
 * @author: Andrew Robinson
 * @version: 1.0
 */

var _userId = "";
var _userType = "";
var _userSessionId = "";

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
    
    buildForm();
    populateForm();

    var options={
      format: 'yyyy-mm-dd',
      forceParse: false,
      todayHighlight: true,
      autoclose: true,
    };
    $('input[name="date"]').datepicker(options);

    $('input[name="date"]').keydown(function(){
        return false;
    });

    $('input[name="date"]').on("changeDate", function(){
        $("#submit-button").prop("disabled", false);
    });

    $("input").on("input", function(){
        $("#submit-button").prop("disabled", false);
    });
    $("#submit-button").click(submitForm);
}

function buildForm(){
    $("div .table-responsive").html(
        '<form id="main-form">' +
            '<div class="form-group">' +
                '<label for="catGraderLimit" class="col-sm-3 control-label">Grader Limit per Category:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="catGraderLimit"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="pointDiffRange" class="col-sm-3 control-label">Allowable Score Discrepancy:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="pointDiffRange"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="examMaxPoint" class="col-sm-3 control-label">Maximum Points for Exams:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="examMaxPoint"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="fallStart" class="col-sm-3 control-label">Fall Quarter Start Date:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" data-date-format="yyyy-mm-dd" name="date" placeholder="YYYY-MM-DD" id="fallStart"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="fallEnd" class="col-sm-3 control-label">Fall Quarter End Date:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" name="date" placeholder="YYYY-MM-DD" id="fallEnd"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="winterStart" class="col-sm-3 control-label">Winter Quarter Start Date:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" name="date" placeholder="YYYY-MM-DD" id="winterStart"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="winterEnd" class="col-sm-3 control-label">Winter Quarter End Date:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" name="date" placeholder="YYYY-MM-DD" id="winterEnd"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="springStart" class="col-sm-3 control-label">Spring Quarter Start Date:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" name="date" placeholder="YYYY-MM-DD" id="springStart"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="springEnd" class="col-sm-3 control-label">Spring Quarter End Date:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" name="date" placeholder="YYYY-MM-DD" id="springEnd"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="summerStart" class="col-sm-3 control-label">Summer Quarter Start Date:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" name="date" placeholder="YYYY-MM-DD" id="summerStart"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="summerEnd" class="col-sm-3 control-label">Summer Quarter End Date:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" name="date" placeholder="YYYY-MM-DD" id="summerEnd"/>' +
                '</div>' +
            '</div>' +
        '</form>' +
        '<form>' +
            '<button type="button" class="btn btn-primary pull-right" disabled="true" id="submit-button" style="margin: 10px 10px 10px 10px">Save Changes</button>' +
        '</form>'
    )
}

function populateForm(){
    $.get("../settings/get_settings.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId}, 
    function(data){
        _settings = data;
        $.each(_settings, function(index, val){
            $('#' + val["name"]).val(val["value"]);
        });
    },
    "json");
}

function submitForm(){
    $.each(_settings, function(index, val){
        var input = $('#' + val["name"]).val();
        if(input !== val["value"]){
            _settings[index]["value"] = input;
            $.post("../settings/update_setting.php", 
                {requester_id: _userId,
                requester_type: _userType,
                requester_session_id: _userSessionId,
                name: val["name"],
                value: input}
            );
        }
    });
    $(".msg-box").addClass("alert-success");
    $(".msg-box").fadeIn();
    $("#msg-box-text").html("Settings successfully saved!");
    $("#submit-button").prop("disabled", true);
}