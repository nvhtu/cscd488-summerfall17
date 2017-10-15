<?php 
   require_once "../../util/get_cur_user_info.php";
   $userInfo = getCurUserInfo(false);
   $page = "exam";
   $title = "EWU APE Exams";
   $tableTitle = "Exams";
   



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

            if(in_array("Teacher", $userInfo["userType"]) && in_array("Admin", $userInfo["userType"]))
            {
                $tableTabs = array("Open", "In-class", "In Progress", "Grading", "Archived", "Hidden");
            }
            else 
            {
                $tableTabs = array("Open", "In Progress", "Grading", "Archived", "Hidden");
            }
            
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