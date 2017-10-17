<?php 
   require_once "../../util/get_cur_user_info.php";
   $userInfo = getCurUserInfo(false);
   $page = "exam";
   $title = "EWU APE Exams";
   $tableTitle = "Exams";
   

<<<<<<< HEAD
   $modalsArr = array("exam", "roster", "report", "../user/lookup");
=======
>>>>>>> 59040acfdc12047c8f25c3e1763d79c71dd847ca


    $modalsArr = array("exam", "roster", "../user/lookup");

    if(in_array("Student", $userInfo["userType"]))
    {
        $tableTitle = "Exams History";
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