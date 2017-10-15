<?php 

$_GET["is_client"] = False;
require_once "../../util/get_cur_user_info.php";

$userInfo = getCurUserInfo(False);

if(in_array("Grader", $userInfo["userType"]))
{
    $page = "grade";
    $title = "EWU APE Grading";
    $tableTitle = "Assigned APE Sections";
    $modalsArr = array("grade");
    require_once "../index.php";
}
else 
{
    require_once "../includes/error_handler.php";
    loadErrorPage("401");
    die();
}
?>