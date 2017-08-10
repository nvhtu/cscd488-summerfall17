<?php
    session_start();
    $userInfo = array('userId' => $_SESSION['ewuid'], 
                      'userType' => $_SESSION["phpCAS"]["attributes"]["UserType"], 
                      'userSession' => session_id(),
                      'userFname' => $_SESSION["phpCAS"]["attributes"]["FirstName"],
                      'userLname' => $_SESSION["phpCAS"]["attributes"]["LastName"],
                      'userEmail' => $_SESSION["phpCAS"]["attributes"]["Email"] );
    
    echo json_encode($userInfo);
?>