<?php
    function sanitize_input($data){
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    function validate_name($name){
        //Must be letters and spaces
        check_input_format("`^[a-zA-Z ]+$`", $name);
        return true;
    }

    function validate_email($email){
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            http_response_code(400);
            die("Invalid input");
        }
        return true;
    }

    function validate_date($date){
        //must be in YYYY-MM-DD format
        check_input_format("`^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$`", $date);
        return true;
    }

    function validate_time($time){
        //HH:MM:SS, HH:MM, H:MM:SS, or H:MM in 24hr format
        check_input_format("`^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$`", $time);
        return true;
    }

    function validate_exam_state($state){
        check_input_format("`^(Hidden|Open|In_Progress|Grading|Archived)$`", $state);
        return true;
    }

    function validate_only_numbers($input){
        check_input_format("`^[0-9]+$`", $input);
        return true;
    }

    function validate_numbers_letters($input){
        check_input_format("`^[a-zA-Z0-9]+$`", $input);
        return true;
    }

    function check_input_format($patt, $input){
        if(!preg_match($patt, $input)){
            http_response_code(400);
            die("Invalid input");
        }
    }
?>