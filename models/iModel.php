<?php
	namespace App\Models;
	
	interface iModel {
		function __construct();
		function create ($dataset);
		function read ($name);
		function update ($dataset);
		function delete ($name);
	}
?>