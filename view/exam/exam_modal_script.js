/**
 * Exam page script
 * @author: Aaron Griffis
 * @version: 1.0
 */



var _origClickEvent;
var _catSectionModified;

var _examValidator;
var _catValidators = Array();
var _graderValidators = Array();
var _reportValidator;

$(document).ready(initValidators);
$('a[href="#Exam_tab"]').click(onclickTabExam);
$('a[href="#Report_tab"]').click(onclickTabReport);
$('a[href="#Roster_tab"]').click(onclickTabRoster);
$('#discard-button').click(onclickTabExam);
$("#submit-button").click(submitForm);
$('#edit-button').click(function(){toggleSubmitEdit(false);});

function initValidators()
{
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
                  console.log($(element).closest('.form-group'));
                  $(element).closest('.form-group').removeClass('has-error');
            }
      });
      
      jQuery.validator.addMethod("myDate", function(value, element) {
            return /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(value);
            }, "Please enter a date in YYYY-MM-DD format");
    
      jQuery.validator.addMethod("myQuarter", function(value, element) {
            return /^(Fall|Winter|Spring|Summer)$/.test(value);
      }, "Please enter a date within a quarter");

      jQuery.validator.addMethod("myTime", function(value, element) {
            return /^((([1-9])|(1[0-2])):([0-5])([0-9])\s(A|P)M)$/.test(value);
      }, "Please enter a valid time");

      jQuery.validator.addMethod("passingGrade", function(value, element) {
            if($("[name='max-score']").filter(function(){return $(this).val() != "";}).length > 0)
                  return parseInt(value, 10) <= parseInt($("[name='possible_grade']").val(), 10);
            return true;
      }, "Passing grade cannot exceed possible grade");

      _examValidator = $("#main-form").validate({
            ignore: [],
            rules: {
                  name: {
                        required: true
                  },
                  date: {
                        required: true,
                        myDate: true
                  },
                  quarter: {
                        required: true,
                        myQuarter: true
                  },
                  start_time: {
                        required: true,
                        myTime: true
                  },
                  duration: {
                        required: true,
                        digits: true
                  },
                  cutoff: {
                        required: true,
                        digits: true
                  },
                  location: {
                        required: true
                  },
                  state: {
                        required: true
                  },
                  passing_grade: {
                        required: true,
                        digits: true,
                        passingGrade: true
                  },
                  possible_grade: {
                        required: true,
                        digits: true
                  }
            },
            messages: {
                  quarter: {
                        required: "Select valid date to add quarter"
                  },
                  possible_grade: "Fill out category info to add possible grade"
            },
            /*errorElement: 'span',
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
                console.log($(element).closest('.form-group'));
                $(element).closest('.form-group').removeClass('has-error');
            }*/
      });

      jQuery.validator.addMethod("fileName", function(value, element) {
            return this.optional(element) || /^[a-zA-Z0-9._]([a-zA-Z0-9._-]+)?$/.test(value);
            }, "Please enter a valid file name");
    
      _reportValidator = $("#report-form").validate({
            invalidHandler: function(form, validator) {
                  var errors = validator.numberOfInvalids();
                  if (errors) {
                        validator.errorList[0].element.focus();
                  }
            },
            ignore: [],
            rules: {
                  "file-name": {
                        required: true,
                        fileName: true
                  },
                  checkboxes: {
                        required: function (element) {
                              return $('[type="checkbox"]:checked').length == 0;
                        }
                  }
            },
            messages: {
                  checkboxes: "Please select data to include"
            }
      });
}

function onOpenDetailModal(e)
{
      $('select[name="state"] option[value="In_Progress"]').show();
      $('select[name="state"] option[value="Grading"]').show();
      $('select[name="state"] option[value="Archived"]').show();
  

      _origClickEvent = e;

      //loadTabExam();
      $('a[href="#Exam_tab"]').click();
}

function onclickTabExam() 
{
      if (_isCreateClicked == false)
      {
            loadTabExam();
      }
      
}

function onclickTabRoster()   
{
      loadTabRoster();
}

function onclickTabReport() 
{
      loadTabReport();
}

function submitForm(e) {
    var tab = e.currentTarget.dataset["tab"],
    action = e.currentTarget.dataset["action"];

    if (tab === "exam") {
        var graderValid = true;
        $(".grader-form").each(function(){
                if(!$(this).valid())
                    graderValid = false;
        });
    
        var catValid = true;
        $(".cat-form").each(function(){
                if(!$(this).valid())
                    catValid = false;
        });
    
        var mainValid = $("#main-form").valid();

        if(mainValid && catValid && graderValid){

                if (action === "create") {
                    _isCreateClicked = false;
                    createItem();
                    $("#detail-modal").modal("hide");
                }
                else if (action === "update") {
                    updateItem();
                    $("#detail-modal").modal("hide");
                }
        }
        else{
                $(".error:visible:not(label)").first().focus();
        }
    }
    else if (tab === "roster") {
        finalizeGrades();
    }
    else if (tab === "report") {
        $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_id",
        exam_id: $("#item-id").val()}, 
        function(item){
            $.get("../ape/get_exam_roster.php", 
            {requester_id: _userId,
            requester_type: _userType,
            requester_session_id: _userSessionId,
            exam_id: item[0].exam_id,
            get_grade: 1}, 
            function(rosterData){
                    onclickDownload(rosterData, item[0]);
            },
            "json");
        },
        "json");
    }
}

function clearForm()
{
    $.each(_catValidators, function(index, val){
        val.destroy();
    });
    _catValidators = Array();
    $.each(_graderValidators, function(index, val){
        val.destroy();
    });
    _graderValidators = Array();

    $("#" + _formId).find("select, input[type=text], input[type=hidden]:not(#requester-id, #requester-type, #requester-session), textarea").val("");
    $('#Report_tab').find("input[type='checkbox']").prop("checked", false);
    $("#quarter").html("(Select valid date)");
    $("#possible-grade").html("(Sum of categories)");
    $("#cat-table > tbody").empty();
    $("#cat-table").hide();
    $('#add-cat-btn').prop("disabled",false);
    $('#cat-heading').toggleClass('empty-panel-fix', true);
    //$('a[href="#Exam_tab"]').tab('show');
    _catSectionModified = false;
    _reportValidator.resetForm();
    _examValidator.resetForm();
}

function toggleSubmitEdit(isReadonly, hideDiscard) {
    $('#submit-button').toggleClass('hidden', isReadonly);
    $('#edit-button').toggleClass('hidden', !isReadonly);
    $('#discard-button').toggleClass('hidden', hideDiscard === undefined ? isReadonly : hideDiscard);
    $('input, select, button', '#Exam_tab').not('input[type="hidden"], [data-toggle="collapse"]').prop("disabled", isReadonly);
    $('.input-group.date').attr("readonly", isReadonly);
}