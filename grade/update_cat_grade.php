<?php
/**
 * Update exam category grade for a student
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

    $graderExamCatId = $_POST["grader_exam_cat_id"];
    $studentId = $_POST["student_id"];
    $grade = $_POST["grade"];

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //Validate strings not empty

    //Validate strings

    checkStudentExists($studentId);

    //Add student category grade
    $sqlUpdateCatGrade = "UPDATE category_grade
                        SET grade = :grade
                        WHERE student_id LIKE :student_id AND grader_exam_cat_id = :grader_exam_cat_id";
    
    sqlExecute($sqlUpdateCatGrade, array('grade'=>$grade, 'student_id'=>$studentId, 'grader_exam_cat_id'=>$graderExamCatId), False);
?>    