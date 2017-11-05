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
        $editedBy = $_POST["edited_by"];
        $comment = $_POST["comment"];

        updateStudentFinalCatGrade($studentId, $examCatId, $finalGrade, $comment, $editedBy);

    }

    function updateStudentFinalCatGrade($studentId, $examCatId, $finalGrade, $comment, $editedBy)
    {
        if($comment != NULL)
        {
            $sqlInsertGrade = "INSERT INTO student_cat_grade (student_id, exam_cat_id, final_grade, comment, edited_by)
            VALUES (:student_id, :exam_cat_id, :final_grade, :comment, :edited_by)
            ON DUPLICATE KEY UPDATE final_grade = :final_grade, comment = :comment, edited_by = :edited_by";

            $data = array(':student_id' => $studentId, ':exam_cat_id' => $examCatId, ':final_grade' => $finalGrade, 'comment' => $comment, ':edited_by' => $editedBy);
            sqlExecute($sqlInsertGrade, $data, false);
        }
        else
        {
            $sqlInsertGrade = "INSERT INTO student_cat_grade (student_id, exam_cat_id, final_grade, edited_by)
            VALUES (:student_id, :exam_cat_id, :final_grade, :edited_by)
            ON DUPLICATE KEY UPDATE final_grade = :final_grade, edited_by = :edited_by";

            $data = array(':student_id' => $studentId, ':exam_cat_id' => $examCatId, ':final_grade' => $finalGrade, ':edited_by' => $editedBy);
            sqlExecute($sqlInsertGrade, $data, false);
        }
        
    }
?>