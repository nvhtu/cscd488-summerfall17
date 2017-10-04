<?php 

$_GET["is_client"] = False;
require_once "../../util/get_cur_user_info.php";

$userInfo = getCurUserInfo(False);

if(strcmp($userInfo["userType"], "Admin") == 0 || strcmp($userInfo["userType"], "Teacher") == 0)
{
    $page = "category";
    $title = "EWU APE Categories";
    $tableTitle = "Categories";
    $hasModal = true;
    require_once "../index.php";
}
else 
{
    die("Unauthorized access");
}
?>