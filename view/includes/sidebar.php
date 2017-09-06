<?php

    $_GET["is_client"] = False;
    require_once "../../util/get_cur_user_info.php";

    $userInfo = getCurUserInfo(False);

    switch ($userInfo["userType"])
    {
        case "Admin": adminType();
                        break;
        case "Teacher": teacherType();
                        break;
        case "Grader": graderType();
                        break;
        case "Student": studentType();
                        break;
    }
    

    function adminType()
    {
        echo '<li class="active"><a href="http://localhost/cscd488-summerfall17/view/home/index.php">Home<span class="sr-only">(current)</span></a></li>
        <li><a href="http://localhost/cscd488-summerfall17/view/exam/index.php">Exams</a></li>
        <li><a href="http://localhost/cscd488-summerfall17/view/user/index.php">Users</a></li>
        <li><a href="http://localhost/cscd488-summerfall17/view/category/index.php">Categories</a></li>
        <li><a href="http://localhost/cscd488-summerfall17/view/location/index.php">Locations</a></li>';
    }

    function teacherType()
    {
        echo '<li class="active"><a href="http://localhost/cscd488-summerfall17/view/home/index.php">Home<span class="sr-only">(current)</span></a></li>
        <li><a href="http://localhost/cscd488-summerfall17/view/exam/index.php">Exams</a></li>
        <li><a href="http://localhost/cscd488-summerfall17/view/user/index.php">Students</a></li>';
    }

    function graderType()
    {
        echo '<li class="active"><a href="http://localhost/cscd488-summerfall17/view/home/index.php">Home<span class="sr-only">(current)</span></a></li>
        <li><a href="http://localhost/cscd488-summerfall17/view/exam/index.php">Grading</a></li>';
    }

    function studentType()
    {
        echo '<li class="active"><a href="http://localhost/cscd488-summerfall17/view/home/index.php">Home<span class="sr-only">(current)</span></a></li>
        <li><a href="http://localhost/cscd488-summerfall17/view/exam/index.php">My Exams</a></li>';
    }

?>

