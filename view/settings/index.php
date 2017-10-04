<?php 

$_GET["is_client"] = False;
require_once "../../util/get_cur_user_info.php";

$userInfo = getCurUserInfo(False);

if(strcmp($userInfo["userType"], "Admin") == 0)
{
    $page = "settings";
    $title = "EWU APE Administrator Settings";
    $tableTitle = "Settings";
    require_once "../index.php";
}
else 
{
    die("Unauthorized access");
}
?>