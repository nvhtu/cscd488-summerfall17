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
    $allowedType = array("Admin", "Teacher", "Student", "Grader");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    $sqlResult = array();

    switch ($request)
    {

        case ("get_by_id"): $sqlResult = getExamById();
                            break;
        case ("get_by_state"): $sqlResult = getExamByState($requesterType, $requesterId);
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

    function getExamByState($requesterType, $requesterId)
    {

        switch($requesterType)
        {
            case "Admin":  $sqlSelectExams = "SELECT *
                                            FROM exam
                                            WHERE state = :state";
                            return $sqlResult = sqlExecute($sqlSelectExams, array(":state"=>$_GET["state"]), true);
                            break;

            case "Teacher":  $sqlSelectExams = "SELECT exam.*
                                                FROM exam
                                                INNER JOIN in_class_exam
                                                USING (exam_id)
                                                WHERE teacher_id LIKE :teacher_id AND state = :state";
                            $data = array(':teacher_id' => $requesterId, ":state"=>$_GET["state"]);
                            return $sqlResult = sqlExecute($sqlSelectExams, $data, true);
                            break;

            case "Student": $sqlSelectExams = "SELECT *
                            FROM exam
                            WHERE state = :state AND exam.exam_id NOT IN (SELECT exam_id FROM in_class_exam)";
                            return $sqlResult = sqlExecute($sqlSelectExams, array(":state"=>$_GET["state"]), true);
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
            case "Admin": return $sqlResult = sqlExecute("SELECT * FROM exam", array(), true);
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

    function getTeacherExams($requesterType, $requesterId)
    {
        $sqlSelectExams = "SELECT exam.*
        FROM exam
        INNER JOIN in_class_exam
        USING (exam_id)
        WHERE teacher_id LIKE :teacher_id";
        $data = array(':teacher_id' => $requesterId);
        return $sqlResult = sqlExecute($sqlSelectExams, $data, true);
    }

    function getStudentExams($requesterId)
    {
        $sqlSelectExams = "SELECT exam.exam_id, name, date, start_time, grade, possible_grade, passed
                            FROM exam JOIN exam_grade ON exam.exam_id = exam_grade.exam_id
                            WHERE exam_grade.student_id LIKE :student_id";

        $data = array(':student_id' => $requesterId);
        $sqlResultExams = sqlExecute($sqlSelectExams, $data, true);

        $sqlSelectCats = "SELECT name as cat, grade, exam_id, possible_grade
                        FROM category_grade AS cg JOIN assigned_grader AS ag ON cg.grader_exam_cat_id = ag.grader_exam_cat_id 
                        JOIN exam_category AS ec ON ag.exam_cat_id = ec.exam_cat_id
                        JOIN category as cat ON ec.cat_id = cat.cat_id
                        WHERE student_id LIKE :student_id";
        

        $sqlResultCats = sqlExecute($sqlSelectCats, $data, true);

        

        //Add categories grades to each exam
        for ($theExam=0; $theExam<count($sqlResultExams); $theExam++)
        {
            $sqlResultExams[$theExam]["cats"] = array();

            for ($theCat=0; $theCat<count($sqlResultCats); $theCat++)
            {
                if($sqlResultCats[$theCat]["exam_id"] == $sqlResultExams[$theExam]["exam_id"])
                {
                    $sqlResultExams[$theExam]["cats"][$sqlResultCats[$theCat]["cat"]] = $sqlResultCats[$theCat]["grade"] . "/" . $sqlResultCats[$theCat]["possible_grade"];
                }
            }
        }

        return $sqlResultExams;
    }
?>