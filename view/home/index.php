<?php 
    $_GET["is_client"] = False;
    require_once "../../util/get_cur_user_info.php";
    $userInfo = getCurUserInfo(False);
    $page = "";
    $jsArr = array();
    $title = "EWU APE Home";

    if(in_array("Admin", $userInfo["userType"]) || in_array("Teacher", $userInfo["userType"]))
    {
        if(strcmp($_GET["page"],"grader_home") == 0)
        {
            $page = "grader_home";
            require_once "../index.php";
        }
        else 
        {
            $page = "admin_teacher_home";
            $modalTabsArr = array("../exam/exam", "../exam/roster", "../exam/report");
            $modalTabsTitles = array("Exam", "Roster", "Report");
            $modalSize = "large";
            $jsArr = array("../exam/exam_modal", "../exam/exam_detail", "../exam/exam_report", "../exam/exam_roster");
            require_once "../index.php";
        }
        
    }
    else if(in_array("Grader", $userInfo["userType"]))
            {
                $page = "grader_home";
                require_once "../index.php";
            }
            else if(in_array("Student", $userInfo["userType"]))
                {
                    $page = "student_home";
                    $modalsArr = array("student_home");
                    require_once "../index.php";
                }

    

    
?>

