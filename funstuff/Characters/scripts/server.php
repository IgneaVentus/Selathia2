<?php
    $method = $_SERVER["REQUEST_METHOD"];
    define ("CHARPATH", "./funstuff/Characters/data/");
	$debug_log = fopen("./debug.txt", "a");
    date_default_timezone_set("UTC");

    if ($method == "GET") {
        $character = file_get_contents(CHARPATH.$_GET["q"].".json");
        fwrite($debug_log, $character);
        echo $character;
    }
    else {
        fwrite($debug_log, "\n".date('Y-m-d G:i:s')." [ Characters ] Request not found");
    }
	fclose($debug_log);
?>