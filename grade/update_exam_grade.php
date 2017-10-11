<?php
/**
 * Update a student exam grade
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";
    require_once "../util/check_id.php";

    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");

    $examId = $_POST["exam_id"];
    $studentId = $_POST["student_id"];
    $grade = $_POST["grade"];
    $passed = $_POST["passed"];


    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //Validate strings not empty

    //Validate strings

    checkExamExists($examId);
    checkStudentExists($studentId);

    //Update student exam grade
    $sqlUpdateExamGrade = "UPDATE exam_grade
                        SET grade = :grade, passed = :passed
                        WHERE student_id LIKE :student_id AND exam_id = :exam_id";
    
    sqlExecute($sqlUpdateExamGrade, array('grade'=>$grade, 'passed'=>$passed, 'student_id'=>$studentId, 'exam_id'=>$examId), False);


?>    