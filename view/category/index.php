<?php 

require_once "../../util/get_cur_user_info.php";

$userInfo = getCurUserInfo(False);

if(in_array("Admin", $userInfo["userType"]) || in_array("Teacher", $userInfo["userType"]))
{
    $page = "category";
    $title = "EWU APE Categories";
    $tableTitle = "Categories";
    $modalsArr = array("category");
    require_once "../index.php";
}
else 
{
    require_once "../includes/error_handler.php";
    loadErrorPage("401");
    die();
}

?>