<?php
	namespace App;

	require_once("./bootloader.php");

	use App\Characters\DataServer;
use App\Models\User;

	use function App\Controllers\Auth\authenticate;

	//Error shit
	error_reporting(E_ALL);
	ini_set('ignore_repeated_errors', TRUE);
	ini_set('display_errors', TRUE);
	ini_set('log_errors', TRUE);
	ini_set("error_log", "./debug.log");

	// Routing section
	$request_uri = explode("?", $_SERVER["REQUEST_URI"], 2);
	$request_tree = explode("/", trim($request_uri[0], " /"));
	$request_method = $_SERVER["REQUEST_METHOD"];

	switch ($request_tree[0]) {
		case "Misc":
			if (!isset($request_tree[1])) require "./funstuff/home.html";
			else switch($request_tree[1]) {
				case "DomainStory":
					if (isset($request_tree[2])) {
						if ($request_tree[2] == "API") require "./funstuff/DomainStory/data/fileManager.php";
					}
					else require "./funstuff/DomainStory/index.html";
					break;
				case "ChillApp":
					require "./funstuff/chillapp.html";
					break;
				case "Schools":
					require "./funstuff/schools.html";
					break;
				case "Shimmer":
					require "./funstuff/shimmer.html";
					break;
				case "Glow":
					require "./funstuff/glow.html";
					break;
				case "Eighties":
					require "./funstuff/eighties.html";
					break;
				case "adRespect":
					require "./funstuff/adRespect/index.html";
					break;
				case "RPS":
					require "./funstuff/RPS/index.html";
					break;
				default:
					require "./funstuff/home.html";
					break;
			}
			break;
		case "Special":
			require "./funstuff/infu.html";
			break;
		case "API":
			if (isset($request_tree[1])) {
				switch ($request_tree[1]) {
					case "Login": 
						echo authenticate();
						return 1;
						break;
					case "Reboot":
						echo User::restartTable();
						return 1;
						break;
				}
			}
		case "Characters":
		case "Home":
		case "":
			if (isset($request_tree[1])) DataServer::view($request_tree[1]);
			else DataServer::view("");
			break;
		default: 
			phpinfo();
			break;
	}
?>