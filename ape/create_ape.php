<?php
    require "../pdoconfig.php";

    //$id = $_POST["id"];
    $quarter = $_POST["quarter"];
    $date = $_POST["date"];
    $location = $_POST["location"];
    $state = $_POST["state"];
    $passing_grade = $_POST["passing_grade"];
    $duration = $_POST["duration"];
    $start_time = $_POST["start_time"];
    $cutoff = $_POST["cutoff"];

    $conn = openDB($server, $database, $user, $pass, $conn);
    $sql = $conn->prepare("INSERT INTO exam (quarter, date, location, state, passing_grade, duration, start_time, cutoff)
                           VALUES (:quarter, :exam_date, :location, :state, :passing_grade, :duration, :start_time, :cutoff)");
    $sql->execute(array(
        //':id' => $id,
        ':quarter' => $quarter,
        ':exam_date' => $date,
        ':location' => $location,
        ':state' => $state,
        ':passing_grade' => $passing_grade,
        ':duration' => $duration,
        ':start_time' => $start_time,
        ':cutoff' => $cutoff
    ));

    $conn = null;
?>