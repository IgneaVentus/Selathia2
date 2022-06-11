<?php
	namespace App\Controllers\Home;


	function initialize () {
		require "./view/modules/head.html";
		require "./view/modules/foot.html";
	}

	function requestManager ($method) {
		switch ($method) {
			case "GET":
			default:
				echo "Long, long fucking ago there was a fucking peaceful land of fucking dimfuckers in a fucking middle of bloody nowhere";
		}
	}
?>