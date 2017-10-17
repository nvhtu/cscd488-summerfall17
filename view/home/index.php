<?php 
    $_GET["is_client"] = False;
    require_once "../../util/get_cur_user_info.php";
    $userInfo = getCurUserInfo(False);
    $page = "";

    if(in_array("Admin", $userInfo["userType"]))
    {
        $page = "admin_home";
    }
    else if(in_array("Teacher", $userInfo["userType"]))
        {
            $page = "teacher_home";
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

