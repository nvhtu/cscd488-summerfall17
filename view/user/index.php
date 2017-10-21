<?php 

    $_GET["is_client"] = False;
    require_once "../../util/get_cur_user_info.php";

    $userInfo = getCurUserInfo(False);

    $page = "user";
    $title = "";
    $tableTitle = "";
    $tableTabs = array();
    //Strings in $modalsArr are the modal HTML file names minus "_modal.html" E.g. "roster_modal.html" -> "roster"
    $modalsArr = array("user", "upload", "lookup");
    $modalTitles = array("User", "Upload", "Lookup");
    //Strings in $jsArr are the JS file names minus "_script.js" E.g. "exam_student_script.js" -> "exam_student"
    $jsArr = array("user");

    if(in_array("Grader", $userInfo["userType"]) && count($userInfo["userType"]) == 1)
    {
        require_once "../includes/error_handler.php";
        loadErrorPage("401");
        die();
    }
    
    if(in_array("Teacher", $userInfo["userType"]) || in_array("Admin", $userInfo["userType"]))
    {
        if(strcmp($_GET["page"],"admin_user") == 0)
        {
            $title = "EWU APE Users";
            $tableTitle = "Users";
            $tableTabs = array("Admins", "Teachers", "Graders", "Students");
        }
        else if (strcmp($_GET["page"],"teacher_user") == 0)
        {
            $title = "EWU APE Students";
            $tableTitle = "Students";
            //$tableTabs = array("Students");
        }
        
    }


   require_once "../index.php";
?>