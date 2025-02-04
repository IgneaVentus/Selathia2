<?php
	namespace App\Characters;

	use App\Models\User;

    define ("METHOD", $_SERVER["REQUEST_METHOD"]);
	define ("PATH", dirname(__FILE__) . "\..");
    date_default_timezone_set("UTC");

	class DataServer {

		public static function view (string $view) {
			switch ($view) {
				case "API": 
					DataServer::readCharacter();
					break;
				case "TEST":
					break;
				case "CRUD":
					require PATH."\\view\\crud.html";
					break;
				default:
					require PATH."\\view\\home.html";
					break;
			}
		}

		public static function readCharacter () {
			if (METHOD == "GET") {
				$character = file_get_contents(PATH."\\data\\".$_GET["q"].".json");
				if ($character != null && $character != "" ) echo $character;
				else error_log("[ Characters ] Error while loading! File: ".$_GET["q"].".json");
			}
			else {
				error_log("[ Characters ] Request not found");
			}
		}
	}




?>