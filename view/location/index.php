<?php 

$_GET["is_client"] = False;
require_once "../../util/get_cur_user_info.php";

$userInfo = getCurUserInfo(False);

if(strcmp($userInfo["userType"], "Admin") == 0 || strcmp($userInfo["userType"], "Teacher") == 0)
{
    $page = "location";
    $title = "EWU APE Locations";
    $tableTitle = "Locations";
    $hasModal = true;
    require_once "../index.php";
}
else 
{
    die("Unauthorized access");
}
?>