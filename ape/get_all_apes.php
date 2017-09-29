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

    $sqlResult = array();

    switch ($request)
    {

        case ("get_by_id"): $sqlResult = getExamById();
                            break;
        case ("get_by_state"): $sqlResult = getExamByState();
                            break;
        case ("get_all"): $sqlResult = getAllExam($requesterType, $requesterId);
                            break;
        default: http_response_code(400);
                echo "Unrecognized request string.";
    }
    
    $final = addRemainingSeats($sqlResult);
    echo json_encode($final);

    function getExamById()
    {
        $sqlSelectExam = "SELECT *
        FROM exam
        WHERE exam_id = :exam_id";
        return $sqlResult = sqlExecute($sqlSelectExam, array(":exam_id"=>$_GET["exam_id"]), true);
    }

    function getExamByState()
    {
        $sqlSelectExam = "SELECT *
        FROM exam
        WHERE state = :state";
        return $sqlResult = sqlExecute($sqlSelectExam, array(":state"=>$_GET["state"]), true);
    }

    function getAllExam($requesterType, $requesterId)
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
            return $sqlResult = sqlExecute($sqlSelectExams, $data, true);
        } else {
            return $sqlResult = sqlExecute("SELECT * FROM exam", array(), true);
        }

    }

    function addRemainingSeats($exams)
    {
        for ($i=0; $i<count($exams); $i++)
        {
            $remainingSeats = getMaxSeats($exams[$i]["exam_id"]) - getNumRegistered($exams[$i]["exam_id"]);
            if($remainingSeats <= 0)
            {
                $exams[$i]["remaining_seats"] = "FULL";
            }
            else 
            {
                $exams[$i]["remaining_seats"] = $remainingSeats;
            }
            
        }

        return $exams;
        
    }

    //Gets the number of seats in the location of exam $exam_id
	function getMaxSeats($exam_id){
		$sqlResult = sqlExecute("SELECT seats FROM exam JOIN location ON (exam.location = location.loc_id) WHERE exam_id = :exam",
					 array(':exam' => $exam_id),
					 true);
		return $sqlResult[0]["seats"];
	}

	//Gets the number of students registered for exam $exam_id
	function getNumRegistered($exam_id){
		$sqlResult = sqlExecute("SELECT COUNT(student_id) as count FROM exam_roster WHERE exam_id = :exam",
					 array(':exam' => $exam_id),
					 true);
		return $sqlResult[0]["count"];
	}

    
	//echo json_encode($sqlResult);
?>