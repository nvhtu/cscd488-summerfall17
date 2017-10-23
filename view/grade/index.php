<?php 

$_GET["is_client"] = False;
require_once "../../util/get_cur_user_info.php";

$userInfo = getCurUserInfo(False);

if(in_array("Grader", $userInfo["userType"]))
{
    $page = "grade";
    $title = "EWU APE Grading";
    $tableTitle = "Assigned APE Sections";
    //Strings in $modalsArr are the modal HTML file names minus "_modal.html" E.g. "roster_modal.html" -> "roster"
    $modalsArr = array("grade");
    $modalTitles = array("Grade");
    //Strings in $jsArr are the JS file names minus "_script.js" E.g. "exam_student_script.js" -> "exam_student"
    $jsArr = array("grade");
    require_once "../index.php";
}
else 
{
    require_once "../includes/error_handler.php";
    loadErrorPage("401");
    die();
}
?>