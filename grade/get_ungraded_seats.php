<?php
/**
 * Gets seat numbers that have not gotten grades from
 * this grader for this exam_cat
 * @author: Andrew Robinson
 * @version: 1.0
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";
    
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];$requesterSessionId = $_GET["requester_session_id"];
    
    $allowedType = array("Admin", "Teacher", "Grader");

    $graderExamCatId = $_GET["grader_exam_cat_id"];
    $examId = $_GET["exam_id"];

    //Sanitize the input
    $graderExamCatId = sanitize_input($graderExamCatId);
    $examId = sanitize_input($examId);

	//Ensure input is well-formed
    validate_only_numbers($graderExamCatId);
    validate_only_numbers($examId);
    
    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    
    $sql = "SELECT seat_num
            FROM exam_roster
            WHERE exam_id = :exam_id AND student_id NOT IN (
                SELECT student_id
                FROM category_grade
                WHERE grader_exam_cat_id = :grader_exam_cat_id
            )";
    
    $sqlResult = sqlExecute($sql, array(':exam_id' => $examId, ':grader_exam_cat_id' => $graderExamCatId), true);

    echo json_encode($sqlResult);
?>    