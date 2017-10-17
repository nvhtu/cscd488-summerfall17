<?php 

$_GET["is_client"] = False;
require_once "../../util/get_cur_user_info.php";

$userInfo = getCurUserInfo(False);

if(in_array("Admin", $userInfo["userType"]))
{
    $page = "settings";
    $title = "EWU APE Administrator Settings";
    $tableTitle = "Settings";
    require_once "../index.php";
}
else 
{
    require_once "../includes/error_handler.php";
    loadErrorPage("401");
    die();
}
?>