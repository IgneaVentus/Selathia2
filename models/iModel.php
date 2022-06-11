<?php
	namespace App\Models;
	
	interface iModel {
		function create ();
		function read ();
		function update ();
		function delete ();
	}
?>