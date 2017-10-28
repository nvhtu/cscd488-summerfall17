/**
 * Exam page script
 * @author: Aaron Griffis
 * @version: 1.0
 */



var _origClickEvent;

$('a[href="#Exam_tab"]').click(function(){onclickTabExam();});
$('a[href="#Report_tab"]').click(function(){onclickTabReport();});
$('a[href="#Roster_tab"]').click(function(){onclickTabRoster();});
$("#submit-button").click(submitForm);

function onOpenDetailModal(e)
{/*
      $('a[href="#Exam_tab"]').on('show.bs.tab', onclickTabExam);
      $('a[href="#Report_tab"]').on('show.bs.tab', onclickTabReport);
      $('a[href="#Roster_tab"]').on('show.bs.tab', onclickTabRoster);
      */


      
      

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