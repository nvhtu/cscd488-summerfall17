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
    $request = $_GET["request"];
    $allowedType = array("Admin", "Teacher", "Student");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);



    switch ($request)
    {

        case ("get_by_id"): getExamById();
                            break;
        case ("get_by_state"): getExamByState();
                            break;
        case ("get_all"): getAllExam($requesterType);
                            break;
        default: http_response_code(400);
                echo "Unrecognized request string.";
    }

    function getExamById()
    {
        $sqlSelectExam = "SELECT *
        FROM exam
        WHERE exam_id = :exam_id";
        $sqlResult = sqlExecute($sqlSelectExam, array(":exam_id"=>$_GET["exam_id"]), true);
        echo json_encode($sqlResult);
    }

    function getExamByState()
    {
        $sqlSelectExam = "SELECT *
        FROM exam
        WHERE state = :state";
        $sqlResult = sqlExecute($sqlSelectExam, array(":state"=>$_GET["state"]), true);
        echo json_encode($sqlResult);
    }

    function getAllExam($requesterType)
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

        echo json_encode($sqlResult);
    }



    
	//echo json_encode($sqlResult);
?>