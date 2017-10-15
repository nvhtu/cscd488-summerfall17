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
    });
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