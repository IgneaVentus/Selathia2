<?php
    $req = $_REQUEST["q"];
    define ("CHARPATH", "./funstuff/Characters/data/");
	$debug_log = fopen("./debug.txt", "a");
    date_default_timezone_set("UTC");
    if (isset($req)) {
        if (preg_match("/(char)/", $req)) {
            try {
                $character = require(CHARPATH.(str_replace("char_", "", $req)).".json");
                echo json_encode($character);
                fwrite($debug_log, "\n".date('Y-m-d G:i:s')." [ Characters ] Loaded character: ".str_replace("char_", "", $req));
            }
            catch (Exception $e) {
                fwrite($debug_log, "\n".date('Y-m-d G:i:s')." [ Characters ] Error during loading character: ".(str_replace("char_", "", $req))."\n Error: ".$e->getMessage());
            }
        }
        else if (preg_match("/(all)/", $req)) {
            if ($dh = opendir(CHARPATH)){
                $i = 0;
                try {
                    while (($file = readdir($dh))!== false) {
                        if ($file=="." || $file == "..") continue;
                        else {
                            $temp = str_replace(".json", "", $file);
                            $answer[$i++] = str_replace("_", " ", $temp);
                        }
                    }
                    echo json_encode($answer);
                }
                catch (Exception $e) {
                    fwrite($debug_log, "\n".date('Y-m-d G:i:s')." [ Characters ] Error while loading characters. \nError: ".$e->getMessage());
                }
                closedir($dh);
            }
            else {
                fwrite($debug_log, "\n".date('Y-m-d G:i:s')." [ Characters ] Error while opening directory");
            }
        }
        else {
            fwrite($debug_log, "\n".date('Y-m-d G:i:s')." [ Characters ] Request invalid");
        }
    }
    else {
        fwrite($debug_log, "\n".date('Y-m-d G:i:s')." [ Characters ] Request not found");
    }
	fclose($debug_log);
?>