<?php
/**
 * Get an exam roster
 * @author: Tu Nguyen
 * @version: 1.0
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";

    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $examId = $_GET["exam_id"];
    $getGrade = $_GET["get_grade"];
    $allowedType = array("Admin", "Teacher");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    if($getGrade == 0)
    {
        $sqlGetRoster = "SELECT student_id, f_name, l_name, seat_num
        FROM exam_roster JOIN user ON exam_roster.student_id = user.user_id
        WHERE exam_id = :exam_id";
    
        $sqlResult = sqlExecute($sqlGetRoster, array(":exam_id"=>$examId), true);
        echo json_encode($sqlResult);
    }
    else 
    {
        $sqlGetRosterStudents = "SELECT student_id, f_name, l_name, seat_num
        FROM exam_roster JOIN user ON exam_roster.student_id = user.user_id
        WHERE exam_id = :exam_id";
    
        $sqlStudentsResult = sqlExecute($sqlGetRosterStudents, array(":exam_id"=>$examId), true);
        
        for ($i=0; $i<count($sqlStudentsResult); $i++)
        {
            $studentId = $sqlStudentsResult[$i]["student_id"];

            $sqlSelectExams = "SELECT grade, possible_grade, passing_grade, passed, exam.exam_id
            FROM exam JOIN exam_grade ON exam.exam_id = exam_grade.exam_id
            WHERE exam_grade.student_id LIKE :student_id AND exam_grade.exam_id = :exam_id";

            $data = array(':student_id' => $studentId, ':exam_id' => $examId);
            $sqlResultExams = sqlExecute($sqlSelectExams, $data, true);

            if(count($sqlResultExams) != 0)
            {
                foreach ($sqlResultExams[0] as $attrName => $attrVal)
                {
                    $sqlStudentsResult[$i][$attrName] = $attrVal;
                }
    
    
                $sqlSelectCats = "SELECT name as cat, grade, exam_id, possible_grade, cg.grader_exam_cat_id
                FROM category_grade AS cg JOIN assigned_grader AS ag ON cg.grader_exam_cat_id = ag.grader_exam_cat_id 
                JOIN exam_category AS ec ON ag.exam_cat_id = ec.exam_cat_id
                JOIN category as cat ON ec.cat_id = cat.cat_id
                WHERE student_id LIKE :student_id AND exam_id  = :exam_id";
    
                $data = array(':student_id' => $studentId, ':exam_id' => $examId);
                $sqlResultCats = sqlExecute($sqlSelectCats, $data, true);
    
                $sqlStudentsResult[$i]["cats"] = array();
    
    
                for ($theCat=0; $theCat<count($sqlResultCats); $theCat++)
                {
                    $sqlStudentsResult[$i]["cats"][$sqlResultCats[$theCat]["cat"]] = $sqlResultCats[$theCat]["grade"];
                    $sqlStudentsResult[$i]["cats"][$sqlResultCats[$theCat]["cat"] . " Max"] = $sqlResultCats[$theCat]["possible_grade"];
                    $sqlStudentsResult[$i]["cats"][$sqlResultCats[$theCat]["cat"] . " ID"] = $sqlResultCats[$theCat]["grader_exam_cat_id"];
                }
            }
            
            

        }

        echo json_encode($sqlStudentsResult);

    }
    
    

?>