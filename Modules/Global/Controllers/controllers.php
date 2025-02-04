<?php

	namespace App\Controllers;

	interface iController {
		function initialize();
		function requestHandler($method);
		function GETHandler();
		function POSTHandler();
	}

	class Home implements iController {
		function initialize () {
			require "./Universes/view/modules/head.html";
			require "./Universes/view/modules/foot.html";
		}
	
		function requestHandler ($method) {
			if ($method == "GET") {
				if (isset($_GET["q"])) $this->GETHandler();
			}
			if ($method == "POST") {
				if (isset($_POST["q"])) $this->POSTHandler();
			}
		}

		function GETHandler () {
			switch ($_GET["q"]) {
				default: 
					echo json_encode("Long, long fucking ago there was a fucking peaceful land of fucking dimfuckers in a fucking middle of bloody nowhere");
					break;
			}
			return 0;
		}

		function POSTHandler () {
			return 0;
		}
	}

	namespace App\Controllers\CRUD;


	function initialize () {
		require "./Universes/view/modules/head.html";
		require "./Universes/view/crud.html";
		require "./Universes/view/modules/foot.html";
	}

	function requestManager ($method) {
		$debug_log = fopen("./debug.txt", "a");
		switch ($method) {
			case "GET":
			default:
				$universe = new \App\Models\Universe ();
				$dataset = $universe->read(null);
				echo json_encode($dataset);
		}
		fclose($debug_log);
	}

?>