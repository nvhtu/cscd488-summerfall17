<?php
/**
 * Add exam category grade for a student
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
    $allowedType = array("Admin", "Teacher", "Grader");

    $graderExamCatId = $_POST["grader_exam_cat_id"];
    $studentId = $_POST["student_id"];
    $grade = $_POST["grade"];

     //Sanitize the input
    $graderExamCatId = sanitize_input($graderExamCatId);
    $studentId = sanitize_input($studentId);
    $grade = sanitize_input($grade);

	//Ensure input is well-formed
    validate_numbers_letters($studentId);
    validate_only_numbers($graderExamCatId);
    validate_only_numbers($grade);

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    //Validate strings not empty

    //Validate strings

    checkGraderExamCatExists($graderExamCatId);
    checkStudentExists($studentId);

    //Add student category grade
    $sqlAddCatGrade = "INSERT INTO category_grade(grader_exam_cat_id, student_id, grade)
                        VALUES (:grader_exam_cat_id, :student_id, :grade)";
    
    sqlExecute($sqlAddCatGrade, array('grader_exam_cat_id'=>$graderExamCatId, 'student_id'=>$studentId, 'grade'=>$grade), False);
?>    