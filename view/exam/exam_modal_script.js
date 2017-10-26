/**
 * Exam page script
 * @author: Aaron Griffis
 * @version: 1.0
 */



var _origClickEvent;

function onOpenDetailModal(e)
{
      $('a[href="#Exam_tab"]').on('show.bs.tab', onclickTabExam);
      $('a[href="#Report_tab"]').on('show.bs.tab', onclickTabReport);
      $('a[href="#Roster_tab"]').on('show.bs.tab', onclickTabRoster);
      
      $("#submit-button").click(submitForm);
      $("#submit-button").attr("data-tab", "exam");

      _origClickEvent = e;

      loadTabExam(_origClickEvent);
}

function onclickTabExam() 
{
      loadTabExam(_origClickEvent);
}

function onclickTabRoster(_origClickEvent)   
{
      loadTabRoster(_origClickEvent);
}

function onclickTabReport() 
{
      loadTabReport();
}