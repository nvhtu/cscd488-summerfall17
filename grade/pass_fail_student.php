<?php
/**
 * Pass or fail a student
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";
    require_once "../util/check_id.php";

    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin");

    $examId = $_POST["exam_id"];
    $studentId = $_POST["student_id"];
    $passed = $_POST["passed"];


    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //Validate strings not empty

    //Validate strings

    checkExamExists($examId);
    checkStudentExists($studentId);

    //Add student exam grade
    $sqlUpdatePassed = "UPDATE exam_grade
                        SET passed = :passed
                        WHERE student_id LIKE :student_id";
    
    sqlExecute($sqlUpdatePassed, array('passed'=>$passed, 'student_id'=>$studentId), False);


?>    