<?php
/**
 * Update a student exam grade
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/check_id.php";
    require_once "../util/input_validate.php";

    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];$requesterSessionId = $_POST["requester_session_id"];
    $allowedType = array("Admin", "Teacher");

    $examId = $_POST["exam_id"];
    $studentId = $_POST["student_id"];
    $grade = $_POST["grade"];
    $passed = $_POST["passed"];

    //Sanitize the input
    $examId = sanitize_input($examId);
    $studentId = sanitize_input($studentId);
    $grade = sanitize_input($grade);
    $passed = sanitize_input($passed);

    //Ensure input is well-formed
    validate_numbers_letters($studentId);
    validate_only_numbers($examId);
    validate_only_numbers($grade);

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    checkExamExists($examId);
    checkStudentExists($studentId);

    //Update student exam grade
    $sqlUpdateExamGrade = "UPDATE exam_grade
                        SET grade = :grade, passed = :passed
                        WHERE student_id LIKE :student_id AND exam_id = :exam_id";
    
    sqlExecute($sqlUpdateExamGrade, array('grade'=>$grade, 'passed'=>$passed, 'student_id'=>$studentId, 'exam_id'=>$examId), False);


?>    