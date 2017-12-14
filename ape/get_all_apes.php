<?php
/**
 * Get exam info depending on account type
 * @author: Aaron Griffis
 * @version: 1.2
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";

    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $requesterSessionId = $_GET["requester_session_id"];
    $request = $_GET["request"];
    $allowedType = array("Admin", "Teacher", "Student", "Grader", "000");


     //Sanitize the input
    $request = sanitize_input($request);

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    $sqlResult = array();

    switch ($request)
    {

        case ("get_by_id"): $sqlResult = getExamById();
                            break;
        case ("get_by_state"): $sqlResult = getExamByState($requesterType, $requesterId);
                            break;
        case ("get_all"): $sqlResult = getAllExam($requesterType, $requesterId);
                            break;
        case ("get_student_apes"): $sqlResult = getStudentExams($_GET["student_id"]);
                                    break;
        default: http_response_code(400);
                echo "Unrecognized request string.";
    }
    
    $final = addRemainingSeats($sqlResult);
    echo json_encode($final);

    function getExamById()
    {
        $examId = sanitize_input($_GET["exam_id"]);
        validate_only_numbers($examId);
        $sqlSelectExam = "SELECT exam_id, name, quarter, date, location, state, possible_grade, passing_grade, duration, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, cutoff
        FROM exam
        WHERE exam_id LIKE :exam_id";
        return $sqlResult = sqlExecute($sqlSelectExam, array(":exam_id"=>$examId), true);
    }

    function getExamByState($requesterType, $requesterId)
    {
        $state = sanitize_input($_GET["state"]);
        validate_exam_state($state);
        switch($requesterType)
        {
            case "Admin":  $sqlSelectExams = "SELECT exam_id, name, quarter, date, location, state, possible_grade, passing_grade, duration, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, cutoff
                                            FROM exam
                                            WHERE state LIKE :state";
                            return $sqlResult = sqlExecute($sqlSelectExams, array(":state"=>$state), true);
                            break;

            case "Teacher":  $sqlSelectExams = "SELECT exam_id, name, quarter, date, location, state, possible_grade, passing_grade, duration, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, cutoff
                                                FROM exam
                                                INNER JOIN in_class_exam
                                                USING (exam_id)
                                                WHERE teacher_id LIKE :teacher_id AND state LIKE :state";
                            $data = array(':teacher_id' => $requesterId, ":state"=>$state);
                            return $sqlResult = sqlExecute($sqlSelectExams, $data, true);
                            break;

            case "000":
            case "Student": $sqlSelectExams = "SELECT exam_id, name, quarter, date, location, state, possible_grade, passing_grade, duration, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, cutoff,  DATE_SUB(start_time, INTERVAL cutoff hour) AS cutoff_time
                            FROM exam
                            WHERE state LIKE :state AND exam.exam_id NOT IN (SELECT exam_id FROM in_class_exam)";
                            $sqlResult = sqlExecute($sqlSelectExams, array(":state"=>$state), true);

                            for($i=0; $i<count($sqlResult); $i++)
                            {
                                date_default_timezone_set('America/Los_Angeles');
                                $examDate = new DateTime($sqlResult[$i]["date"]);
                                $examCutoff = strtotime($sqlResult[$i]["cutoff_time"]);
                        
                                $today = new DateTime(date("Y-m-d"));
                                $curHour = strtotime(date("H:i:s"));
                                //if the exam is today
                                if(date_diff($today, $examDate)->days == 0)
                                {
                                    //if the cutoff time has been reached
                                    if($curHour >= $examCutoff)
                                    {
                                        $sqlResult[$i]["reg_closed"] = 1;
                                    }
                                }
                                else {
                                    $sqlResult[$i]["reg_closed"] = 0;
                                }
                            }

                            return $sqlResult;
                            break;
        }
           

        
    }

    function getAllExam($requesterType, $requesterId)
    {
        switch ($requesterType)
        {
            case "Teacher": return getTeacherExams($requesterType, $requesterId);
                            break;
            case "Student": return getStudentExams($requesterId);
                            break;
            case "Admin": return $sqlResult = sqlExecute("SELECT exam_id, name, quarter, date, location, state, possible_grade, passing_grade, duration, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, cutoff FROM exam", array(), true);
                            break;
        
        }
    }

    //Add remaining seats count to each exam
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
		$sqlResult = sqlExecute("SELECT seats FROM exam JOIN location ON (exam.location = location.loc_id) WHERE exam_id LIKE :exam",
					 array(':exam' => $exam_id),
					 true);
		return $sqlResult[0]["seats"];
	}

	//Gets the number of students registered for exam $exam_id
	function getNumRegistered($exam_id){
		$sqlResult = sqlExecute("SELECT COUNT(student_id) as count FROM exam_roster WHERE exam_id LIKE :exam",
					 array(':exam' => $exam_id),
					 true);
		return $sqlResult[0]["count"];
	}

    function getTeacherExams($requesterType, $requesterId)
    {
        $sqlSelectExams = "SELECT exam_id, name, quarter, date, location, state, possible_grade, passing_grade, duration, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, cutoff
        FROM exam
        INNER JOIN in_class_exam
        USING (exam_id)
        WHERE teacher_id LIKE :teacher_id";
        $data = array(':teacher_id' => $requesterId);
        return $sqlResult = sqlExecute($sqlSelectExams, $data, true);
    }

    function getStudentExams($requesterId)
    {
        $sqlSelectExams = "SELECT exam.exam_id, name, date, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, grade, possible_grade, passed, state
                            FROM exam JOIN exam_grade ON exam.exam_id = exam_grade.exam_id
                            WHERE exam_grade.student_id LIKE :student_id";

        $data = array(':student_id' => $requesterId);
        $sqlResultExams = sqlExecute($sqlSelectExams, $data, true);

        $sqlSelectExamsState = "SELECT exam.exam_id, name, date, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, possible_grade, state
                                FROM exam_roster JOIN exam ON exam_roster.exam_id = exam.exam_id
                                WHERE student_id LIKE :student_id
                                AND exam.exam_id NOT IN (SELECT exam_grade.exam_id
                                                        FROM exam_grade
                                                        WHERE exam_grade.student_id LIKE :student_id)";

        $sqlResultState = sqlExecute($sqlSelectExamsState, $data, true);


        //Add grade N/A, and passed N/A to sqlResultState exams; and add the exam to sqlResultExams
        for ($theExam=0; $theExam<count($sqlResultState); $theExam++)
        {
            $sqlResultState[$theExam]["grade"] = NULL;
            $sqlResultState[$theExam]["passed"] = NULL;
            array_push($sqlResultExams, $sqlResultState[$theExam]);
        }

        $sqlSelectCats = "SELECT name as cat, final_grade, exam_id, possible_grade
                            FROM student_cat_grade scg
                            JOIN exam_category ec USING (exam_cat_id)
                            JOIN category c USING (cat_id)
                            WHERE student_id LIKE :student_id";
        
        $sqlResultCats = sqlExecute($sqlSelectCats, $data, true);

        
        

        //Add categories grades to each exam that has been finalized
        for ($theExam=0; $theExam<count($sqlResultExams); $theExam++)
        {
            if (strcmp($sqlResultExams[$theExam]["state"],"Archived") == 0)
            {
                $sqlResultExams[$theExam]["cats"] = array();

                for ($theCat=0; $theCat<count($sqlResultCats); $theCat++)
                {
                    if($sqlResultCats[$theCat]["exam_id"] == $sqlResultExams[$theExam]["exam_id"])
                    {
                        $sqlResultExams[$theExam]["cats"][$sqlResultCats[$theCat]["cat"]] = $sqlResultCats[$theCat]["final_grade"] . "/" . $sqlResultCats[$theCat]["possible_grade"];
                    }
                }
            }
        }

        return $sqlResultExams;
    }
?>