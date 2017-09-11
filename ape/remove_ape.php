<?php
/**
 * Remove an exam
 * @author: Tu Nguyen
 * @version: 1.0
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";

    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    $examId = $_POST["exam_id"];

    if(strcmp($requesterType, 'Teacher') == 0)
    {
        $sqlSelectId = "SELECT COUNT(*) as count
                        FROM in_class_exam
                        WHERE exam_id = :exam_id";
        $data = array(':exam_id' => $examId);
        $sqlResult = sqlExecute($sqlSelectId, $data, true);

        if($sqlResult[0]["count"] == 0) {
            http_response_code(400);
            die("Unauthorized access. Teachers can only delete their own in-class exam.");
        }
    }


    $sqlDeleteExam = "DELETE FROM exam WHERE exam_id LIKE :id";
    $data = array(':id' => $examId);

    sqlExecute($sqlDeleteExam, $data, false);
?>