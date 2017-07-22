<?php
/**
 * Create new exam
 * @author: Aaron Griffis
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";

    $requesterId = $_POST["auth_id"];
    $requesterType = $_POST["auth_type"];
    $allowedType = array("Admin", "Teacher");

    $quarter = $_POST["quarter"];
    $date = $_POST["date"];
    $location = $_POST["location"];
    $state = $_POST["state"];
    $passing_grade = $_POST["passing_grade"];
    $duration = $_POST["duration"];
    $start_time = $_POST["start_time"];
    $cutoff = $_POST["cutoff"];

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    $sqlInsertExam = "INSERT INTO exam (quarter, date, location, state, passing_grade, duration, start_time, cutoff)
                                   VALUES (:quarter, :exam_date, :location, :state, :passing_grade, :duration, :start_time, :cutoff)";
    $data = array(
        ':quarter' => $quarter,
        ':exam_date' => $date,
        ':location' => $location,
        ':state' => $state,
        ':passing_grade' => $passing_grade,
        ':duration' => $duration,
        ':start_time' => $start_time,
        ':cutoff' => $cutoff
    );

    sqlExecute($sqlInsertExam, $data, false);
    //Need id returned after sqlExecute!
    $exam_id = $conn->lastInsertId();

    //Add exam to in_class_exam if account is teacher
    if(strcmp($requesterType, "Teacher") == 0) //Teacher account
    {
        $sqlInsertInClass = "INSERT INTO in_class_exam (exam_id, teacher_id)
                             VALUES (:exam_id, :teacher_id)";
        $data = array(':exam_id' => $exam_id, ':teacher_id' => $requesterId);
        $exam = sqlExecute($sqlInsertInClass, $data, true);
    }
?>