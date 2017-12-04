<?php

    $_GET["is_client"] = False;
    require_once $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . $projectDirName . DIRECTORY_SEPARATOR . "util" . DIRECTORY_SEPARATOR . "get_cur_user_info.php";

    $userInfo = getCurUserInfo(False);

    echo '<a href="https://www.ewu.edu" class="list-group-item">
            <img src="img/horizontal-logo-transparent-150x50.png" class="img-responsive" alt="EWU Logo">
        </a>
        
        <div class="list-group-item user-wrapper">
            <div class="user">
                <h5>Welcome,</h5>
                <h4>'. $userInfo["userFname"] . ' ' . $userInfo["userLname"] . '</h4>
            </div>
        </div>';

    
    
    if(count($userInfo) != 0)
    {
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

        
    }

    /*echo '<p class="list-group-item user-cat"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span>Feedback</p>
        <div class="list-group">
            <a class="list-group-item" href="mailto:tunguyen@eagles.ewu.edu?subject=Team 1 APE Website feedback"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span>Email the team</a>
        </div>';*/
    //"/home/index.php?page=admin_home" put a "page" variable into $_GET for view/index.php to display the correct requested home

    function adminType()
    {
        global $page;
        echo '<p class="list-group-item user-cat"><span class="glyphicon glyphicon-lock" aria-hidden="true"></span>Admin</p>
        <div class="list-group">
            <a class="list-group-item' . (isset($_GET["page"]) && strstr($_GET["page"], 'admin_home') ? ' active':'') . '" href="/cscd488-summerfall17/view/home/?page=admin_home"><span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span>Dashboard</a>
            <a class="list-group-item' . (isset($_GET["page"]) && strstr($_GET["page"], 'admin_exam') ? ' active':'') . '" href="/cscd488-summerfall17/view/exam/?page=admin_exam"><span class="glyphicon glyphicon-book" aria-hidden="true"></span>Exams</a>
            <a class="list-group-item' . (isset($_GET["page"]) && strstr($_GET["page"], 'admin_user') ? ' active':'') . '" href="/cscd488-summerfall17/view/user/?page=admin_user"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>Users</a>
            <a class="list-group-item' . (!isset($_GET["page"]) && strstr($page, 'category') ? ' active':'') . '" href="/cscd488-summerfall17/view/category/"><span class="glyphicon glyphicon-list" aria-hidden="true"></span>Categories</a>
            <a class="list-group-item' . (!isset($_GET["page"]) && strstr($page, 'location') ? ' active':'') . '" href="/cscd488-summerfall17/view/location/"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>Locations</a>
            <a class="list-group-item' . (isset($_GET["page"]) && strstr($_GET["page"], 'homepage_editor') ? ' active':'') . '" href="/cscd488-summerfall17/view/home/?page=homepage_editor"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span>Homepage Editor</a>
            <a class="list-group-item' . (!isset($_GET["page"]) && strstr($page, 'settings') ? ' active':'') . '" href="/cscd488-summerfall17/view/settings/"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span>Configurations</a>
        </div>';
    }

    function teacherType()
    {
        global $page;
        echo '<p class="list-group-item user-cat"><span class="glyphicon glyphicon-apple" aria-hidden="true"></span>Teacher</p>
        <div class="list-group">
            <a class="list-group-item' . (isset($_GET["page"]) && strstr($_GET["page"], 'teacher_home') ? ' active':'') . '" href="/cscd488-summerfall17/view/home/?page=teacher_home"><span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span>Dashboard</a>
            <a class="list-group-item' . (isset($_GET["page"]) && strstr($_GET["page"], 'teacher_exam') ? ' active':'') . '" href="/cscd488-summerfall17/view/exam/?page=teacher_exam"><span class="glyphicon glyphicon-book" aria-hidden="true"></span>In-class Exams</a>
            <a class="list-group-item' . (isset($_GET["page"]) && strstr($_GET["page"], 'teacher_user') ? ' active':'') . '" href="/cscd488-summerfall17/view/user/?page=teacher_user"><span class="glyphicon glyphicon-education" aria-hidden="true"></span>Students</a>
        </div>';
    }

    function graderType()
    {
        global $page;
        echo '<p class="list-group-item user-cat"><span class="glyphicon glyphicon-briefcase" aria-hidden="true"></span>Grader</p>
        <div class="list-group">
            <a class="list-group-item' . (isset($_GET["page"]) && strstr($_GET["page"], 'grader_home') ? ' active':'') . '" href="/cscd488-summerfall17/view/home/?page=grader_home"><span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span>Dashboard</a>
            <a class="list-group-item' . (!isset($_GET["page"]) && strstr($page, 'grade') ? ' active':'') . '" href="/cscd488-summerfall17/view/grade/"><span class="glyphicon glyphicon-erase" aria-hidden="true"></span>Grading</a>
        </div>';
    }

    function studentType()
    {
        global $page;
        echo '<a class="list-group-item' . (strstr($page, 'home') ? ' active':'') . '" href="/cscd488-summerfall17/view/home/?page=student_home"><span class="glyphicon glyphicon-home" aria-hidden="true"></span>Home</a>
        <a class="list-group-item' . (strstr($page, 'exam') ? ' active':'') . '" href="/cscd488-summerfall17/view/exam/?page=student_exam"><span class="glyphicon glyphicon-book" aria-hidden="true"></span>My Exams</a>';
    }

    
?>