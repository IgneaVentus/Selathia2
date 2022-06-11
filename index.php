<?php
    $request_uri = explode("?", $_SERVER["REQUEST_URI"], 2);
    $request_method = $_SERVER["REQUEST_METHOD"];

    switch ($request_method) {
        case "POST":
            break;
        case "DELETE":
            break;
        case "PUT":
            break;
        case "GET":
        default:
            switch ($request_uri[0]) {
                case "/":
                case "/Home":
                    require "controllers/home.php";
                    break;
                case "/Schools":
                    require "./funstuff/schools.html";
                    break;
                case "/Chillapp":
                    require "./funstuff/chillapp.html";
                    break;
                case "/Special":
                    require "./funstuff/infu.html";
                    break;
                default :
                    phpinfo();
                    break;
            }
            break;
    }
?>