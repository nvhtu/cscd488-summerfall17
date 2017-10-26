<?php
/**
 * Get account info (Teacher, Grader, and Student account)
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";
    require "../settings/init_settings.php";
    
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $allowedType = array("Admin", "Teacher", "Student");

    $request = $_GET["request"];

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //Validate strings not empty

    //Validate strings

    switch ($request)
    {
        case ("get_own"): getOwnAccount($requesterId, $requesterType);
                         break;
        case ("get_by_id"): //Student and Grader can't request account info other than their own
                            if(strcmp($requesterType, "Student") == 0 || strcmp($requesterType, "Grader") == 0) 
                            {
                                http_response_code(400);
                                die("Unauthorized access. Your account type can't use this function.");
                            }
                            else 
                            {
                                getAccountById();
                            }
                            break;
        case ("get_by_type"): getAllByType();
                            break;
        default: http_response_code(400);
                echo "Unrecognized request string.";
    }

    /**
    * Gets acount info the requester
    * @param: $requesterId requester ID
    * @param: $requesterType requester acount type
    * @return: void
    */
    function getOwnAccount($requesterId, $requesterType)
    {

        $sqlResult;

        if(strcmp($requesterType, "Student") == 0)
        {
            $sqlResult = getStudentInfo($requesterId);
        }
        else 
        {
            $sqlResult = getNonStudentInfo($requesterId);
        }
        
        echo $sqlResult;
        
    }

    /**
    * Gets acount info using an account id
    * @return: void
    */
    function getAccountById()
    {
        $id = $_GET["id"];


        $sqlCountStudent = "SELECT COUNT(student_id) as count
                                    FROM student
                                    WHERE student_id LIKE :id";

        $sqlResult = sqlExecute($sqlCountStudent, array(':id'=>$id), True);

        if($sqlResult[0]["count"] == 0)
        {
            echo getNonStudentInfo($id);
        }
        else 
        {
            echo getStudentInfo($id);   
        }
    }

    /**
    * Gets all account by type
    * @return: void
    */
    function getAllByType()
    {
        $type = $_GET["type"];
        $sqlResult;

        if(strcmp($type, "Student") == 0)
        {
            $requesterType = $_GET["requester_type"];
            
            //If requester is a Teacher, only get students belong to them. They are who registered
            //in that Teacher's current in-class exams. To prevent Teacher from getting students from previous quarters,
            //the code checks the in-class exam date to see if it falls within current quarter dates.
            if(strcmp($requesterType, "Teacher") == 0)
            {
                if(!isset($GLOBALS["settings"]))
                initializeSettings();

                //---Get current quarter start and end dates
                $today = date("Y-m-d");
                $curQuarterStart = "";
                $curQuarterEnd = "";
                $quarterStartName = "";
                $quarterStartCount = 0;

                $sortedQuarterDatesArr = array(0=>$GLOBALS["settings"]["fallStart"],
                                               1=>$GLOBALS["settings"]["fallEnd"],
                                               2=>$GLOBALS["settings"]["winterStart"],
                                               3=>$GLOBALS["settings"]["winterEnd"],
                                               4=>$GLOBALS["settings"]["springStart"],
                                               5=>$GLOBALS["settings"]["springEnd"],
                                               6=>$GLOBALS["settings"]["summerStart"],
                                               7=>$GLOBALS["settings"]["summerEnd"],);

                for($i=0; $i < count($sortedQuarterDatesArr); $i++)
                {
                    if($today >= $sortedQuarterDatesArr[$i] && $i%2 == 0)
                    {
                        $curQuarterStart = $sortedQuarterDatesArr[$i];
                        $quarterStartName = key($sortedQuarterDatesArr);
                        $quarterStartCount = $i;
                    }
                    else
                    if(strcmp($curQuarterStart,"") != 0)
                    {
                        $curQuarterEnd = $sortedQuarterDatesArr[$quarterStartCount+1];
                    }
                    
                }

                /*
                //check if today doesn't fall into any quarter range (meaning we're on the break ;) )
                if($today > $curQuarterEnd || strcmp($curQuarterStart,"") == 0)
                {
                    http_response_code(400);
                    die("You currently don't have any students in your class. You're restricted from viewing previous quarters students.");
                }*/
                //--- END Get current quarter start and end dates

                $sqlGetStudents = "SELECT U.user_id, U.f_name, U.l_name, U.email, S.state, E.name AS exam_name
                FROM in_class_exam ICE JOIN exam_roster ER USING (exam_id)
                JOIN user U ON (ER.student_id = U.user_id)
                JOIN student S ON (ER.student_id = S.student_id)
                JOIn exam E ON (ICE.exam_id = E.exam_id)
                WHERE ICE.teacher_id = :teacher_id AND DATE(E.date) BETWEEN :date_start AND :date_end";

                $data = array(":teacher_id"=>$_GET["requester_id"], ":date_start"=>$curQuarterStart, ":date_end"=>$curQuarterEnd);

                $sqlResult = sqlExecute($sqlGetStudents, $data, True);

                if (count($sqlResult)==0)
                {
                    //http_response_code(400);
                    die("You currently don't have any students in your class. You're restricted from viewing previous quarters students.");
                }
            }
            else
            {
                $sqlGetAllStudents = "SELECT user_id, f_name, l_name, email, state FROM student JOIN user ON student_id LIKE user_id";
                $sqlResult = sqlExecute($sqlGetAllStudents, null, True);
            }
            

        }
        else 
        {
            $sqlGetAllNonStudents = "SELECT user_id, f_name, l_name, email
                                    FROM faculty JOIN user ON faculty_id LIKE user_id
                                    WHERE faculty.type LIKE :type";
            $sqlResult = sqlExecute($sqlGetAllNonStudents, array('type'=>$type), True);
        }

        echo json_encode($sqlResult);
    }

    /**
    * Gets student account info and state
    * @return: string json
    */
    function getStudentInfo($id)
    {
        $sqlGetAccount = "SELECT user_id, f_name, l_name, email, state
                        FROM student JOIN user ON student_id LIKE user_id
                        WHERE user_id LIKE :id";

        $sqlResult = sqlExecute($sqlGetAccount, array('id'=>$id), True);

        if(strcmp($sqlResult[0]["state"], "Registered") == 0)
        {
            $sqlGetRegisteredExam = "SELECT exam_id
                                    FROM exam_roster
                                    WHERE student_id LIKE :id";
            $sqlResultRegisteredExam = sqlExecute($sqlGetRegisteredExam, array('id'=>$id), True);

            $sqlResult[0]["registered_exam"] = array();
            
            for ($i=0; $i<count($sqlResultRegisteredExam); $i++)
            {
                array_push($sqlResult[0]["registered_exam"], $sqlResultRegisteredExam[$i]["exam_id"]);
            }   

        }
        $sqlResult[0]["type"] = array("Student");
        
        return json_encode($sqlResult);
    }

    /**
    * Gets admin or teacher or grader account info and type
    * @return: string json
    */
    function getNonStudentInfo($id)
    {
        $sqlGetAccount = "SELECT *
                         FROM user
                         WHERE user_id LIKE :id";

        $sqlResult = sqlExecute($sqlGetAccount, array('id'=>$id), True);

        if(count($sqlResult) == 0)
            return "NULL";

        $sqlResult[0]["type"] = array();
           
        //get account type
        $sqlGetType = "SELECT type
                        FROM faculty
                        WHERE faculty_id LIKE :id";
        $sqlResultType = sqlExecute($sqlGetType, array('id'=>$id), True);

        //type is stored as an array
        for ($i=0; $i<count($sqlResultType); $i++)
        {
            array_push($sqlResult[0]["type"], $sqlResultType[$i]["type"]);
        }       

        return json_encode($sqlResult);
    }

?>    