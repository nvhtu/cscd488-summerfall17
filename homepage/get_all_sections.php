<?php
/**
 * Get all sections of the homepage
 * @author: Tu Nguyen
 * @version: 1.0
 */
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/input_validate.php";

	$requesterId = $_GET["requester_id"];
	$requesterType = $_GET["requester_type"];
    $requesterSessionId = $_GET["requester_session_id"];
    $request = $_GET["request"];
    $allowedType = array("Admin", "Teacher", "Student", "000");

    //Sanitize the input
    $request = sanitize_input($request);

	//User authentication
	user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);
	
    switch ($request)
    {

        case ("get_by_id"): $id = $_GET["content_id"];
                            $id = sanitize_input($id);
                            validate_only_numbers($id);

                            $sqlResult = getSectionById($id);
                            break;
        case ("get_all"): $sqlResult = getAllSections();
                            break;
        default: http_response_code(400);
                echo "Unrecognized request string.";
    }
    
    echo json_encode($sqlResult, JSON_HEX_QUOT | JSON_HEX_TAG);


    function getSectionById($id)
    {
        $sqlGetSection = "SELECT *
                        FROM homepage_content
                        WHERE content_id = :content_id";

        $sqlResult = sqlExecute($sqlGetSection, array(":content_id"=>$id), true);

        return decodeHTMLEntities($sqlResult);
    }

    function getAllSections()
    {
        $sqlGetAllSections = "SELECT *
                        FROM homepage_content";
        $sqlResult = sqlExecute($sqlGetAllSections, array(), true);
        
        return decodeHTMLEntities($sqlResult);
    }

    function decodeHTMLEntities($sectionsArr)
    {
        for($i=0; $i<count($sectionsArr); $i++)
        {
            $sectionsArr[$i]["html_content"] = html_entity_decode($sectionsArr[$i]["html_content"]);
        }

        return $sectionsArr;
        
    }

	
?>
