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
        echo '<li class="active parent-home"><a href="http://localhost/cscd488-summerfall17/view/home/index.php?page=admin_home">Admin Dashboard<span class="sr-only">(current)</span></a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/exam/index.php?page=admin_exam">Exams</a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/user/index.php?page=admin_user">Users</a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/category/index.php">Categories</a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/location/index.php">Locations</a></li>';
    }

    /*
https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript
    */
    function teacherType()
    {
        echo '<li class="active parent-home"><a href="http://localhost/cscd488-summerfall17/view/home/index.php?page=teacher_home">Teacher Dashboard<span class="sr-only">(current)</span></a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/exam/index.php?page=teacher_exam">In-class Exams</a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/user/index.php?page=teacher_user">Students</a></li>';
    }

    function graderType()
    {
        echo '<li class="active parent-home"><a href="http://localhost/cscd488-summerfall17/view/home/index.php?page=grader_home">Grader Dashboard<span class="sr-only">(current)</span></a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/grade/index.php">Grading</a></li>';
    }

    function studentType()
    {
        echo '<li class="active parent-home"><a href="http://localhost/cscd488-summerfall17/view/home/index.php?page=student_home">Home<span class="sr-only">(current)</span></a></li>
        <li class="child-list"><a href="http://localhost/cscd488-summerfall17/view/exam/index.php">My Exams</a></li>';
    }

?>

