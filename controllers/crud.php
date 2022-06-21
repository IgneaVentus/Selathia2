<?php
	namespace App\Controllers\CRUD;


	function initialize () {
		require "./view/modules/head.html";
		require "./view/crud.html";
		require "./view/modules/foot.html";
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