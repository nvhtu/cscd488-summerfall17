<?php 

    $_GET["is_client"] = False;
    require_once "../../util/get_cur_user_info.php";

    $userInfo = getCurUserInfo(False);

    $page = "user";
    $title = "";
    $tableTitle = "";
    $tableTabs = array();
    $modalsArr = array("user", "upload", "lookup");

    if(in_array("Grader", $userInfo["userType"]) && count($userInfo["userType"]) == 1)
    {
        require_once "../includes/error_handler.php";
        loadErrorPage("401");
        die();
    }
    
    if(in_array("Teacher", $userInfo["userType"]) && in_array("Admin", $userInfo["userType"]))
    {
        $title = "EWU APE Users";
        $tableTitle = "Users";
        $tableTabs = array("Admins", "Teachers", "Graders", "Students");
    }
    else 
    {
        if(in_array("Teacher", $userInfo["userType"]))
        {
            $title = "EWU APE Students";
            $tableTitle = "Students";
            $tableTabs = array("Students");
        }
        else
        {
            $title = "EWU APE Users";
            $tableTitle = "Users";
            $tableTabs = array("Admins", "Teachers", "Graders", "Students");
        }
        
    }

   require_once "../index.php";
?>