/**
 * Settings page script
 * @author: Andrew Robinson
 * @version: 1.0
 */

var _userId = "";
var _userType = "";
var _userSessionId = "";

var _formId = "main-form";

var _validator;

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
            orientation: "top left",
            keyboardNavigation: false
        };
        $('.input-group.date').datepicker(options)
        .on("hide", function(){
            if($(this).find("input").val() != _settings[$(this).find("input").attr("id")])
            $("#submit-button").prop("disabled", false);
            _validator.element("#" + $(this).find("input").attr("id"));
        });

        $('input[name="date"]').keydown(function(e){
            return e.keyCode === 9;
        });
    
        $("input").on("input", function(){
            $("#submit-button").prop("disabled", false);
        });

        $("#submit-button").click(submitForm);

        jQuery.validator.setDefaults({
            errorElement: 'span',
            errorClass: 'error help-block',
            errorPlacement: function(error, element) {
                  if (element.parent().hasClass('input-group')) {
                        error.insertAfter(element.parent());
                  } else {
                        error.insertAfter(element);
                  }
            },
            highlight: function(element, errorClass) {
                  $(element).removeClass('help-block');
                  $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function(element, errorClass) {
                  //console.log($(element).closest('.form-group'));
                  $(element).closest('.form-group').removeClass('has-error');
            }
      });

        jQuery.validator.addMethod("isName", function(value, element) {
            return this.optional(element) || /^[a-z ,.'-]+$/i.test(value);
            }, "Please enter a valid name");
        
        jQuery.validator.addMethod("myEmail", function(value, element) {
            return this.optional(element) || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            }, "Please enter valid email");

        jQuery.validator.addMethod("myDate", function(value, element) {
            return this.optional(element) || /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(value);
            }, "Please enter a date in YYYY-MM-DD format");

        _validator = $("#main-form").validate({
            rules: {
                catGraderLimit: {
                    required: true,
                    digits: true
                },
                pointDiffRange: {
                    required: true,
                    digits: true
                },
                contactName: {
                    required: true,
                    isName: true
                },
                contactEmail: {
                    required: true,
                    myEmail: true
                },
                date: {
                    required: true,
                    myDate: true
                }
            }
        });

        $("form, input").attr("autocomplete", "off");
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
    var toSubmit = {};
    var success = true;

    $.each(_settings, function(name, val){
        var input = $('#' + name).val();
        if(typeof input !== "undefined" && input !== val){
            var valid = _validator.element($('#' + name));
            if(valid)
                toSubmit[name] = input;
            else{
                if(success){
                    $('#' + name).focus();
                    success = false;
                }
            }
        }
    });

    if(success){
        $.each(toSubmit, function(name, input){
            _settings[name] = input;
            $.post("../settings/update_setting.php", 
                {requester_id: _userId,
                requester_type: _userType,
                requester_session_id: _userSessionId,
                name: name,
                value: input}
            );
        });
        
        $(".msg-box").removeClass("alert-danger");
        $(".msg-box").addClass("alert-success");
        $(".msg-box").fadeIn();
        $("#msg-box-text").html("Settings successfully saved!");
        $("#submit-button").prop("disabled", true);
    }
    else{
        $(".msg-box").removeClass("alert-success");
        $(".msg-box").addClass("alert-danger");
        $(".msg-box").fadeIn();
        $("#msg-box-text").html("Settings were not saved, please enter valid input.");
    }
}