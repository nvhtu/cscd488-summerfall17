<?php

    $_GET["is_client"] = False;
    require_once $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . $projectDirName . DIRECTORY_SEPARATOR . "util" . DIRECTORY_SEPARATOR . "get_cur_user_info.php";

    $userInfo = getCurUserInfo(False);

    switch (count($userInfo["userType"]))
    {
        case 1: switch ($userInfo["userType"][0])
                {
                    case "Admin": adminType(); break;
                    case "Teacher": teacherType(); break;
                    case "Grader": graderType(); break;
                    case "Student": studentType(); break;
                }
                break;

        case 2:
                if(in_array("Admin", $userInfo["userType"]) && in_array("Teacher", $userInfo["userType"]))
                {
                    adminType();
                    teacherType();
                }
            
                if(in_array("Admin", $userInfo["userType"]) && in_array("Grader", $userInfo["userType"]))
                {
                    adminType();
                    graderType();
                }

                if(in_array("Teacher", $userInfo["userType"]) && in_array("Grader", $userInfo["userType"]))
                {
                    teacherType();
                    graderType();
                }
                break;

        case 3: 
                adminType();
                teacherType();
                graderType();
                break;
    }

    //"/home/index.php?page=admin_home" put a "page" variable into $_GET for view/index.php to display the correct requested home

    function adminType()
    {
        echo '<li class="active parent-home"><a href="http://localhost/cscd488-summerfall17/view/home/index.php?page=admin_home">Admin Home<span class="sr-only">(current)</span></a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/exam/index.php">Exams</a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/user/index.php">Users</a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/category/index.php">Categories</a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/location/index.php">Locations</a></li>';
    }

    function teacherType()
    {
        echo '<li class="active parent-home"><a href="http://localhost/cscd488-summerfall17/view/home/index.php?page=teacher_home">Teacher Home<span class="sr-only">(current)</span></a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/exam/index.php">In-class Exams</a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/user/index.php">Students</a></li>';
    }

    function graderType()
    {
        echo '<li class="active parent-home"><a href="http://localhost/cscd488-summerfall17/view/home/index.php?page=grader_home">Grader Home<span class="sr-only">(current)</span></a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/grade/index.php">Grading</a></li>';
    }

    function studentType()
    {
        echo '<li class="active parent-home"><a href="http://localhost/cscd488-summerfall17/view/home/index.php?page=student_home">Home<span class="sr-only">(current)</span></a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/exam/index.php">My Exams</a></li>';
    }

?>

