<?php 
<<<<<<< HEAD
    require_once "../../util/get_cur_user_info.php";
    $userInfo = getCurUserInfo(false);
    $page = "exam";
    $title = "EWU APE Exams";
    $tableTitle = "Exams";
    //Strings in $modalsArr are the modal HTML file names minus "_modal.html" E.g. "roster_modal.html" -> "roster"
    $modalsArr = array("exam", "roster", "../user/lookup");
    //Strings in $jsArr are the JS file names minus "_script.js" E.g. "exam_student_script.js" -> "exam_student"
    $jsArr = array();

=======
   require_once "../../util/get_cur_user_info.php";
   $userInfo = getCurUserInfo(false);
   $page = "exam";
   $title = "EWU APE Exams";
   $tableTitle = "Exams";
   


  
   $modalsArr = array("exam", "roster", "report", "../user/lookup");
>>>>>>> ec187bf4bf8311ea0651ec7cf9e54ced0c31c1fe

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