<?php
/**
 * Create new Student account first time log in
 * Use this to hide the System account cred from client
 * @author: Tu Nguyen
 * @version: 1.0
 */


    $systemId = "999999";
    $systemType = "System";

    $_POST["requester_id"] = $systemId;
    $_POST["requester_type"] = $systemType;

    var_dump($_POST);

    include "create_account.php";
?>    