<?php
	namespace App;
	
	// Loading models and controllers
	foreach (glob("./controllers/*.php") as $filename) {
		require_once $filename;
	}
	require_once "./models/iModel.php";
	require_once "./models/Selathia.php";
	require_once "./models/maintenance.php";
	
	// Section for opening database connection. 
	use \PDO;

	$db = new PDO("sqlite:./data/central.db", null, null, array(PDO::ATTR_PERSISTENT => true));
	$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

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
		case "Serverside":
			if ($request_tree[1]=="/Initialize") Models\initialize($db);
			break;
		case "api":
			switch ($request_tree[1]) {
				case "Home":
				case "":
					Controllers\Home\requestManager($request_method);
					break;
			}
			break;
		case "Home":
		case "":
			return Controllers\Home\initialize();
			break;
		default: 
			break;
	}
?>