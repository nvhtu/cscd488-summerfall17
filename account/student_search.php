<?php
/**
 * Search student accounts with a string
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";

    
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $allowedType = array("Admin", "Teacher", "System");

    //if searchStr contains white space, split it into f_name and l_name

    $searchStr = explode(" ", $_GET["search_str"]);

    for($i=0; $i<count($searchStr); $i++)
    {
        $searchStr[$i] = "%" . $searchStr[$i] . "%";
    }



    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);


    //Validate strings not empty

    //Validate strings

    
    if(count($searchStr) == 1)
    {
        $sqlSearchUser = "SELECT user_id, f_name, l_name, email, state 
        FROM `user` JOIN student ON user_id LIKE student_id 
        WHERE user_id LIKE :search OR f_name LIKE :search OR l_name LIKE :search OR email LIKE :search";
        $result = sqlExecute($sqlSearchUser, array(':search'=>$searchStr[0]), True);
        echo json_encode($result);
    }
    else 
    {
        $sqlSearchUser = "SELECT user_id, f_name, l_name, email, state 
        FROM `user` JOIN student ON user_id LIKE student_id 
        WHERE f_name LIKE :searchFname OR l_name LIKE :searchLName";
        $result = sqlExecute($sqlSearchUser, array(':searchFname'=>$searchStr[0], ':searchLName'=>$searchStr[1]), True);
        echo json_encode($result);
    }
    



?>    