<?php
/**
 * Get exam info depending on account type
 * @author: Aaron Griffis
 * @version: 1.2
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";

    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $allowedType = array("Admin", "Teacher", "Student");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    if (!empty($_GET["exam_id"]))
    {
        $sqlSelectExam = "SELECT *
                            FROM exam
                            WHERE exam_id = :exam_id";
        $sqlResult = sqlExecute($sqlSelectExam, array(":exam_id"=>$_GET["exam_id"]), true);
    }
    else 
    {
        //If teacher, get only their exams
        if(strcmp($requesterType, 'Teacher') == 0)
        {
            $sqlSelectExams = "SELECT exam.*
                                FROM exam
                                INNER JOIN in_class_exam
                                USING (exam_id)
                                WHERE teacher_id = :teacher_id";
            $data = array(':teacher_id' => $requesterId);
            $sqlResult = sqlExecute($sqlSelectExams, $data, true);
        } else {
        $sqlResult = sqlExecute("SELECT * FROM exam", array(), true);
        }
    }


    
	echo json_encode($sqlResult);
?>