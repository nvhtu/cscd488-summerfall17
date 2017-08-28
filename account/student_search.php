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

    $searchStr = "%" . $_GET["search_str"] . "%";

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);


    //Validate strings not empty

    //Validate strings

    

    $sqlSearchUser = "SELECT user_id, f_name, l_name, email, state 
                        FROM `user` JOIN student ON user_id = student_id 
                        WHERE user_id LIKE :search OR f_name LIKE :search OR l_name LIKE :search OR email LIKE :search";
    $result = sqlExecute($sqlSearchUser, array(':search'=>$searchStr), True);

    echo json_encode($result);

?>    