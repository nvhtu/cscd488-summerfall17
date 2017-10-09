<?php 

    $_GET["is_client"] = False;
    require_once "../../util/get_cur_user_info.php";

    $userInfo = getCurUserInfo(False);

    $page = "user";
    $title = "";
    $tableTitle = "";
    $tableTabs = array();
    $modalsArr = array("user", "upload", "lookup");

    switch ($userInfo["userType"])
    {
        case "Admin": 
                        $title = "EWU APE Users";
                        $tableTitle = "Users";
                        $tableTabs = array("Admins", "Teachers", "Graders", "Students");
                        break;

        case "Teacher": 
                        $title = "EWU APE Students";
                        $tableTitle = "Students";
                        $tableTabs = array("Students");
                        break;
        
        default:    die("Unauthorized access");
    }

   require_once "../index.php";
?>