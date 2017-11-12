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

function init()
{
    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    $(".msg-box").hide();
    
    buildForm();
}

function buildForm(){
    $("div .table-responsive").load("./settings/settings_form.html", function(){
        populateForm();
        
        var options={
            format: 'yyyy-mm-dd',
            forceParse: false,
            todayHighlight: true,
            autoclose: true,
            orientation: "top left"
        };
        $('.input-group.date').datepicker(options)
        .on("changeDate", function(){
            $("#submit-button").prop("disabled", false);
        });

        $('input[name="date"]').keydown(function(){
            return false;
        });
    
        $("input").on("input", function(){
            $("#submit-button").prop("disabled", false);
        });
        $("#submit-button").click(submitForm);
    });
}

function populateForm(){
    $.get("../settings/get_settings.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId}, 
    function(data){
        _settings = data;
        $.each(_settings, function(name, val){
            $('#' + name).val(val);
        });
    },
    "json");
}

function submitForm(){
    $.each(_settings, function(name, val){
        var input = $('#' + name).val();
        if(typeof input !== "undefined" && input !== val){
            _settings[name] = input;
            $.post("../settings/update_setting.php", 
                {requester_id: _userId,
                requester_type: _userType,
                requester_session_id: _userSessionId,
                name: name,
                value: input}
            );
        }
    });
    $(".msg-box").addClass("alert-success");
    $(".msg-box").fadeIn();
    $("#msg-box-text").html("Settings successfully saved!");
    $("#submit-button").prop("disabled", true);
}