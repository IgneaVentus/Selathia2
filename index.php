<?php
	namespace App;
	
	// Loading models and controllers
	foreach (glob("./controllers/*.php") as $filename) {
		require_once $filename;
	}
	require_once "./models/iModel.php";
	foreach (glob("./models/*.php") as $filename) {
		if (!str_contains($filename, "iModel")) require_once $filename;
	}

	// Routing section
	$request_uri = explode("?", $_SERVER["REQUEST_URI"], 2);
	$request_tree = explode("/", trim($request_uri[0], " /"));
	$request_method = $_SERVER["REQUEST_METHOD"];

	switch ($request_tree[0]) {
		case "Schools":
			require "./funstuff/schools.html";
			break;
		case "Chillapp":
			require "./funstuff/chillapp.html";
			break;
		case "Special":
			require "./funstuff/infu.html";
			break;
		case "Characters":
			if (isset($request_tree[1])) require "./funstuff/Characters/scripts/server.php";
			else require "./funstuff/Characters/home.html";
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
		default: 
			break;
	}
?>