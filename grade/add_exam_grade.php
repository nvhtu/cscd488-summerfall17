<?php
/**
 * Add exam overall grade for a student
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
    $possibleGrade = $_POST["possible_grade"];

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //Validate strings not empty

    //Validate strings

    checkExamExists($examId);
    checkStudentExists($studentId);

    //Add student exam grade
    $sqlAddExamGrade = "INSERT INTO exam_grade(exam_id, student_id, grade, passed, possible_grade)
                        VALUES (:exam_id, :student_id, :grade, :passed, :possible_grade)";
    
    sqlExecute($sqlAddExamGrade, array('exam_id'=>$examId, 'student_id'=>$studentId, 'grade'=>$grade, 'passed'=>$passed, 'possible_grade'=>$possibleGrade), False);


?>    