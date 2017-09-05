<?php
/**
 * Update exam info
 * @author: Aaron Griffis
 * @version: 1.1
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    $name = $_POST["name"];
    $exam_id = $_POST["exam_id"];
    $quarter = $_POST["quarter"];   //Shouldn't come from the user! Use date to determine quarter
    $date = $_POST["date"];
    $location = $_POST["location"];
    $state = $_POST["state"];
    $passing_grade = $_POST["passing_grade"];
    $duration = $_POST["duration"];
    $start_time = $_POST["start_time"];
    $cutoff = $_POST["cutoff"];

    //If teacher, exam must be their own
    if(strcmp($requesterType, 'Teacher') == 0)
    {
        $sqlSelectId = "SELECT teacher_id
                        FROM in_class_exam
                        WHERE exam_id = :exam_id";
        $data = array(':exam_id' => $exam_id);
        $teacher_id = sqlExecute($sqlSelectId, $data, true);

        if( strcmp($teacher_id[0]["teacher_id"], $requesterId) != 0 ) {
            http_response_code(400);
            die("Unauthorized access. Only the teacher that created this exam may edit it.");
        }
    }

    $sqlUpdateExam = "UPDATE exam
                        SET name = :name,
                            quarter = :quarter,
                            date = :exam_date,
                            location = :location,
                            state = :state,
                            passing_grade = :passing_grade,
                            duration = :duration,
                            start_time = :start_time,
                            cutoff = :cutoff
                        WHERE exam_id = :exam_id";
    $data = array(
            ':name' => $name,  
            ':quarter' => $quarter,
            ':exam_date' => $date,
            ':location' => $location,
            ':state' => $state,
            ':passing_grade' => $passing_grade,
            ':duration' => $duration,
            ':start_time' => $start_time,
            ':cutoff' => $cutoff,
            ':exam_id' => $exam_id
        );
    sqlExecute($sqlUpdateExam, $data, false);
?>