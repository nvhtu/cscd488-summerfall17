<?php
/**
 * Get the graders of an exam or all Grading exam
 * @author: Tu Nguyen
 * @version: 1.0
 */
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";
    require_once "../util/input_validate.php";

    if(empty($_GET["requester_id"]) || empty($_GET["requester_type"])){
		http_response_code(400);
        die("Incomplete input.");
	}
    
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $allowedType = array("Grader", "Admin", "Teacher");

    $examId = $_GET["exam_id"];
    $request = $_GET["request"];

    //Sanitize the input
	$requesterId = sanitize_input($requesterId);
    $requesterType = sanitize_input($requesterType);
    $examId = sanitize_input($examId);
    $request = sanitize_input($request);


	//Ensure input is well-formed
    validate_only_numbers($requesterId);
    
    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    $sqlResult = array();
    

    switch($request)
    {
        case "get_by_exam_id": $sqlResult = getGradersByExamId($examId);
                            break;
        case "get_by_open_exams": $sqlResult = getGradersOpenExams();
                            break;
    }



    echo json_encode($sqlResult);

    function getGradersByExamId($examId)
    {
        $sqlGetGraders = "SELECT user_id,  COUNT(*) AS assigned_cat_num, exam_id, f_name, l_name
        FROM exam_category NATURAL JOIN assigned_grader JOIN user USING (user_id)
        WHERE exam_category.exam_id = :exam_id
        GROUP BY user_id";


        $sqlGradersResult = sqlExecute($sqlGetGraders, array(':exam_id' => $examId), true);

        //Add an array of grader_exam_cat_id to an user_id
        for($i=0; $i<count($sqlGradersResult); $i++)
        {
            $sqlGetGraderExamCatIds = "SELECT grader_exam_cat_id
                                        FROM exam_category NATURAL JOIN assigned_grader 
                                        WHERE exam_category.exam_id = :exam_id AND user_id LIKE :user_id";
            
            $sqlGraderExamCatIds = sqlExecute($sqlGetGraderExamCatIds, array(':exam_id'=>$examId, 'user_id'=>$sqlGradersResult[$i]["user_id"]), true);
            
            $sqlGradersResult[$i]["grader_exam_cat_id"] = array();

            foreach($sqlGraderExamCatIds as $theId)
            {
                array_push($sqlGradersResult[$i]["grader_exam_cat_id"], $theId["grader_exam_cat_id"]);
            }

        }

        return $sqlGradersResult;
    }

    function getGradersOpenExams()
    {
        $sqlGetGradersOpeExams = "SELECT user_id, grader_exam_cat_id, exam_category.possible_grade, exam_id
        FROM exam_category NATURAL JOIN assigned_grader JOIN exam USING (exam_id)
        WHERE exam.state = 'Grading'";

        return sqlExecute($sqlGetGraders, array(), true);
    }
?>    