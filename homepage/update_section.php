<?php
/**
 * Update a section or title content
 * @author: Andrew Robinson
 * @version: 1.0
 */
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/input_validate.php";


	$requesterId = $_POST["requester_id"];
	$requesterType = $_POST["requester_type"];
    $requesterSessionId = $_POST["requester_session_id"];
    $request = $_POST["request"];
    $contentId = $_POST["content_id"];
    $content = $_POST["content"];
    $allowedType = array("Admin");
	
    //Sanitize the input
    $request = sanitize_input($request);
    $contentId = sanitize_input($contentId);
    $content = sanitize_input($content);

    validate_only_numbers($contentId);
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);
	
	switch ($request)
    {

        case ("update_title"): $sqlResult = updateTitle($contentId, $content);
                            break;
        case ("update_body"): $sqlResult = updateBody($contentId, $content);
                            break;
        default: http_response_code(400);
                echo "Unrecognized request string.";
    }

    function updateTitle($id, $content)
    {
        $sqlUpdateTitle = "UPDATE homepage_content
                            SET title = :title
                            WHERE content_id = :content_id";
        
        sqlExecute($sqlUpdateTitle, array(":title"=>$content, ":content_id"=>$id), false);

    }

    function updateBody($id, $content)
    {
        $sqlUpdateBody = "UPDATE homepage_content
                            SET html_content = :content
                            WHERE content_id = :content_id";
        
        sqlExecute($sqlUpdateBody, array(":content"=>$content, ":content_id"=>$id), false);
    }
?>
