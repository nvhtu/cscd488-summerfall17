<?php 

$_GET["is_client"] = False;
require_once "../../util/get_cur_user_info.php";

$userInfo = getCurUserInfo(False);

if(in_array("Admin", $userInfo["userType"]) || in_array("Teacher", $userInfo["userType"]))
{
    $page = "location";
    $title = "EWU APE Locations";
    $tableTitle = "Locations";
    //Strings in $modalsArr are the modal HTML file names minus "_modal.html" E.g. "roster_modal.html" -> "roster"
    $modalsArr = array("location");
    //Strings in $jsArr are the JS file names minus "_script.js" E.g. "exam_student_script.js" -> "exam_student"
    $jsArr = array("location");
    require_once "../index.php";
}
else 
{
    require_once "../includes/error_handler.php";
    loadErrorPage("401");
    die();
}
?>