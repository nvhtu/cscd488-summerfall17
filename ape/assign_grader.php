<?php
/**
 * Assign a grader to an exam category
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";
    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");

    $examCatId = $_POST["exam_cat_id"];
    $userId = $_POST["user_id"];

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //Validate strings not emp

    //Validate strings

    //Assign grader to an exam category
    $sqlAddGrader = "INSERT INTO assigned_grader(exam_cat_id, user_id)
                        VALUES (:exam_cat_id, :user_id)";
    
    $lastInsertId = sqlExecute($sqlAddGrader, array(':exam_cat_id'=>$examCatId, ':user_id'=>$userId), False);
    
    echo $lastInsertId;
?>    