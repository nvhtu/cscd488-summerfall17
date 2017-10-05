<?php 
   require_once "../../util/get_cur_user_info.php";
   $userInfo = getCurUserInfo(false);
   $page = "exam";
   $title = "EWU APE Exams";
   $tableTitle = "Exams";
   

   $modalsArr = array("exam", "add_student");

   if(strcmp($userInfo["userType"], "Student") == 0)
   {
        $tableTitle = "Exams History";
   }
   else 
   {
    $page = "exam";
    $title = "EWU APE Exams";
    $tableTitle = "Exams";
    $tableTabs = array("Open", "In Progress", "Grading", "Archived", "Hidden");
   }

   
   require_once "../index.php";
?>