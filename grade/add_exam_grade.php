<?php
/**
 * Add exam overall grade for a student
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";

    
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

    //Validate exam id exists
    $sqlCheckExists = "SELECT COUNT(*) as count
                            FROM exam
                            WHERE exam_id = :exam_id";
    $sqlResult = sqlExecute($sqlCheckExists, array('exam_id'=>$examId), TRUE);

    if($sqlResult[0]["count"] == 0)
    {
        var_dump(http_response_code(400));
        die("Exam ID does not exist.");
    }
    
    //Validate student id exists
    $sqlCheckExists = "SELECT COUNT(*) as count
                            FROM student
                            WHERE student_id = :student_id";
    $sqlResult = sqlExecute($sqlCheckExists, array('student_id'=>$studentId), TRUE);

    if($sqlResult[0]["count"] == 0)
    {
        var_dump(http_response_code(400));
        die("Student ID does not exist.");
    }

    //Add student exam grade
    $sqlAddExamGrade = "INSERT INTO exam_grade(exam_id, student_id, grade, passed, possible_grade)
                        VALUES (:exam_id, :student_id, :grade, :passed, :possible_grade)";
    
    sqlExecute($sqlAddExamGrade, array('exam_id'=>$examId, 'student_id'=>$studentId, 'grade'=>$grade, 'passed'=>$passed, 'possible_grade'=>$possibleGrade), False);


?>    