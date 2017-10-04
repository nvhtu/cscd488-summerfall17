<?php 
    $_GET["is_client"] = False;
    require_once "../../util/get_cur_user_info.php";
    $userInfo = getCurUserInfo(False);
    $page = "";

    switch ($userInfo["userType"])
    {
        case "Admin": $page = "admin_home";
                        break;
        case "Teacher": $page = "teacher_home";
                        break;
        case "Grader": $page = "grader_home";
                        $hasModal = false;
                        break;
        case "Student": $page = "student_home";
                        $hasModal = true;
                        break;
    }
    
    $title = "EWU APE Home";

    require_once "../index.php";
?>

