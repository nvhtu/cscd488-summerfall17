/**
 * Exam page script
 * @author: Aaron Griffis
 * @version: 1.0
 */



var _origClickEvent;
var _catSectionModified;

$('a[href="#Exam_tab"]').click(function(){onclickTabExam();});
$('a[href="#Report_tab"]').click(function(){onclickTabReport();});
$('a[href="#Roster_tab"]').click(function(){onclickTabRoster();});
$("#submit-button").click(submitForm);

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
      loadTabExam();
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
         if (action === "create") {
            createItem();
         }
         else if (action === "update") {
            updateItem();
         }
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
   }
   