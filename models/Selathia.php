<?php
	namespace App\Models;

	class Selathia extends \PDO implements iModel {
		function create() {
			return "Hahah, create, lol";
		}
		function read() {
			return "Hahah, read, lol";
		}
		function update() {
			return "Hahah, update, lol";
		}
		function delete() {
			return "Hahah, delete, lol";
		}
	}
?>