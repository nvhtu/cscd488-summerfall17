<?php
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/check_id.php";

    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
   
    $allowedType = array("Admin", "Teacher", "System");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    if(strcmp($requesterType,"System") != 0)
    {
        $studentId = $_POST["student_id"];
        $examCatId = $_POST["exam_cat_id"];
        $finalGrade = $_POST["final_grade"];

        updateStudentFinalCatGrade($studentId, $examCatId, $finalGrade);

    }

    function updateStudentFinalCatGrade($studentId, $examCatId, $finalGrade)
    {
        $sqlInsertGrade = "INSERT INTO student_cat_grade (student_id, exam_cat_id, final_grade)
                            VALUES (:student_id, :exam_cat_id, :final_grade)
                            ON DUPLICATE KEY UPDATE final_grade = :final_grade";

        $data = array(':student_id' => $studentId, ':exam_cat_id' => $examCatId, ':final_grade' => $finalGrade);
        sqlExecute($sqlInsertGrade, $data, false);
    }
?>