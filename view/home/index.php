<?php 
    $_GET["is_client"] = False;
    require_once "../../util/get_cur_user_info.php";
    $userInfo = getCurUserInfo(False);
    $page = "";
    $jsArr = array();

    if(in_array("Admin", $userInfo["userType"]) || in_array("Teacher", $userInfo["userType"]))
    {
        $page = "admin_teacher_home";
        $modalsArr = array("../exam/exam", "../exam/roster", "../exam/report");
        $modalTitles = array("Exam", "Roster", "Report");
        $modalSize = "large";
        $jsArr = array("../exam/exam_modal", "../exam/exam_detail", "../exam/exam_report", "../exam/exam_roster");
    }
        else if(in_array("Grader", $userInfo["userType"]))
            {
                $page = "grader_home";
            }
            else if(in_array("Student", $userInfo["userType"]))
                {
                    $page = "student_home";
                    $modalsArr = array("student_home");
                }

    $title = "EWU APE Home";

    require_once "../index.php";
?>

