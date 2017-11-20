<?php
/**
 * Assign a grader to an exam category
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";
    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $requesterSessionId = $_POST["requester_session_id"];
    $allowedType = array("Admin", "Teacher");

    $examCatId = $_POST["exam_cat_id"];
    $userId = $_POST["user_id"];

    //Sanitize the input
    $examCatId = sanitize_input($examCatId);
    $userId = sanitize_input($userId);

    //Ensure input is well-formed
    validate_only_numbers($examCatId);
    validate_numbers_letters($userId);

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);


    //Assign grader to an exam category
    $sqlAddGrader = "INSERT INTO assigned_grader(exam_cat_id, user_id)
                        VALUES (:exam_cat_id, :user_id)";
    
    $lastInsertId = sqlExecute($sqlAddGrader, array(':exam_cat_id'=>$examCatId, ':user_id'=>$userId), False);
    
    echo $lastInsertId;
?>    