<?php
/**
 * Get exam info depending on account type
 * @author: Aaron Griffis
 * @version: 1.0
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";

    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher", "Student");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //If teacher, get only their exams
    if(strcmp($requesterType, 'Teacher') == 0)
    {
        $sqlSelectExams = "SELECT exam.*
                            FROM exam
                            INNER JOIN in_class_exam
                            USING (exam_id)
                            WHERE teacher_id = :teacher_id";
        $data = array(':teacher_id' => $requesterId);
        $teacherExams = sqlExecute($sqlSelectId, $data, true);
    }

    //TO DO: Restrict student accounts

    $sqlResult = sqlExecute("SELECT * FROM exam", array(), true);
	echo json_encode($sqlResult);
?>