<?php 
   require_once "../../util/get_cur_user_info.php";
   $userInfo = getCurUserInfo(false);
   $page = "exam";
   $title = "EWU APE Exams";
   $tableTitle = "Exams";
   
   $hasModal = true;

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
    $hasModal = true;
   }

   
   require_once "../index.php";
?>