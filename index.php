<?php
	namespace App;

	// Loading models and controllers
	require "./controllers/crud.php";
	require "./controllers/home.php";
	require "./models/iModel.php";
	require "./models/maintenance.php";
	require "./models/Universe.php";

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
				case "Characters":
					if (isset($request_tree[2])) {
						if ($request_tree[2] == "API") require "./funstuff/Characters/scripts/server.php";
					}
					else require "./funstuff/Characters/home.html";
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
				default:
					require "./funstuff/home.html";
					break;
			}
			break;
		case "Special":
			require "./funstuff/infu.html";
			break;
		case "Serverside":
			echo "Got ere' ".$request_tree[1];
			if ($request_tree[1]=="Initialize") {
				Models\initialize();
			}
			break;
		case "api":
			switch ($request_tree[1]) {
				case "CRUD":
					Controllers\CRUD\requestManager($request_method);
					break;
				case "Home":
				case "":
					Controllers\Home\requestManager($request_method);
					break;
			}
			break;
		case "CRUD":
			return Controllers\CRUD\initialize();
			break;
		case "Home":
		case "":
			return Controllers\Home\initialize();
			break;
		case "TEST":
			require "./tester.php";
			break;
		default: 
			phpinfo();
			break;
	}
?>