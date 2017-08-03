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


    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //Validate strings not empty

    //Validate strings

    checkExamExists($examId);
    checkStudentExists($studentId);

    //Update student exam grade
    $sqlUpdateExamGrade = "UPDATE exam_grade
                        SET grade = :grade
                        WHERE student_id = :student_id";
    
    sqlExecute($sqlUpdateExamGrade, array('grade'=>$grade, 'student_id'=>$studentId), False);


?>    