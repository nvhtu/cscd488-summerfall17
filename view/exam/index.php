<?php 
    require_once "../../util/get_cur_user_info.php";
    $userInfo = getCurUserInfo(false);
    $page = "exam";
    $title = "EWU APE Exams";
    $tableTitle = "Exams";
    //Strings in $modalsArr are the modal HTML file names minus "_modal.html" E.g. "roster_modal.html" -> "roster"
    $modalsArr = array("exam", "roster", "report", "../user/lookup");
    $modalTitles = array("Exam", "Roster", "Report", "Lookup");
    $modalSize = "large";
    //Strings in $jsArr are the JS file names minus "_script.js" E.g. "exam_student_script.js" -> "exam_student"
    $jsArr = array();


    if(in_array("Student", $userInfo["userType"]))
    {
        $tableTitle = "Exams History";
        $jsArr = array("exam_student");
    }
    else
    {
        if(in_array("Teacher", $userInfo["userType"]) || in_array("Admin", $userInfo["userType"]))
        {
            $page = "exam";
            $title = "EWU APE Exams";
            $tableTitle = "Exams";
            $tableTabs = array();
            $tableTabs = array("Open", "In Progress", "Grading", "Archived", "Hidden");
            $jsArr = array("exam", "exam_modal");
        }
        else
        {
            require_once "../includes/error_handler.php";
            loadErrorPage("401");
            die();
        }
    }
    
    
    require_once "../index.php";
?>