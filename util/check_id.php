<?php
    require_once "sql_exe.php";  
     
     
    function checkExamExists($examId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM exam
                                WHERE exam_id LIKE :exam_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('exam_id'=>$examId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            return False;
        }
        else {
            return True;
        }
    }
    
    function checkStudentExists($studentId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM student
                                WHERE student_id LIKE :student_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('student_id'=>$studentId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            return False;
        }
        else {
            return True;
        }
    }

    function checkInClassStudentExists($studentId, $teacherId, $startDate, $endDate)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
        FROM in_class_student
        WHERE student_id LIKE :student_id AND teacher_id LIKE :teacher_id AND start_date LIKE :start_date AND end_date LIKE :end_date";
        $sqlResult = sqlExecute($sqlCheckExists, array('student_id'=>$studentId, 'teacher_id'=>$teacherId, 'start_date'=>$startDate, 'end_date'=>$endDate), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            return False;
        }
        else {
            return True;
        }
    }

    function checkUserExists($userId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM user
                                WHERE user_id LIKE :user_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('user_id'=>$userId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            return False;
        }
        else {
            return True;
        }
    }

    function checkFacultyExists($userId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM faculty
                                WHERE faculty_id LIKE :faculty_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('faculty_id'=>$userId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            return False;
        }
        else {
            return True;
        }
    }

    function checkGraderExamCatExists($examCatId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM assigned_grader
                                WHERE grader_exam_cat_id = :grader_exam_cat_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('grader_exam_cat_id'=>$examCatId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            http_response_code(400);
            return False;
        }
        else {
            return True;
        }
    }

    function checkStudentCatGradeExists($studentId, $examCatId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
        FROM student_cat_grade
        WHERE student_id LIKE :student_id AND exam_cat_id = :exam_cat_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('student_id'=>$studentId, 'exam_cat_id'=>$examCatId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            return False;
        }
        else {
            return True;
        }
    }
?>