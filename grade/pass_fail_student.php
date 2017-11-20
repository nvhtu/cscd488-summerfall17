<?php
/**
 * Pass or fail a student
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/check_id.php";
    require_once "../util/input_validate.php";

    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $requesterSessionId = $_POST["requester_session_id"];
    $allowedType = array("Admin");

    $examId = $_POST["exam_id"];
    $studentId = $_POST["student_id"];
    $passed = $_POST["passed"];

    //Sanitize the input
    $studentId = sanitize_input($studentId);
    $examId = sanitize_input($examId);
    $passed = sanitize_input($passed);

    //Ensure input is well-formed
    validate_numbers_letters($studentId);
    validate_only_numbers($examId);

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

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