<?php
    //require "../pdoconfig.php";

    function student_auth($auth_id, $auth_type, $server, $database, $user, $pass, $conn)
    {
        $conn = openDB($server, $database, $user, $pass, $conn);

            $sql = $conn->prepare("SELECT COUNT(id) as count
                                FROM student
                                WHERE id = :auth_id");

            $sql->execute(array(':auth_id'=>$auth_id));
            $sqlResult = $sql->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($sqlResult);

            if($sqlResult[0]["count"] == 0)
            {
                var_dump(http_response_code(400));
                $conn = null;
                die("Unauthorized access");
            }
            
    }
?>