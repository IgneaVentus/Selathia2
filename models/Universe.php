<?php
	namespace App\Models;
	use \PDO;

	class Universe extends \PDO implements iModel {

		private $db;
		public $id;
		public $name;
		public $author;
		public $desc;

		function __construct() {
			$this->db = new PDO("sqlite:./data/central.db", null, null, array(PDO::ATTR_PERSISTENT => true));
			$this->db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		}
		
		function create($dataset) {
			if (isset($dataset["id"])) $this->id = $dataset["id"];
			$this->name = $dataset["name"];
			$this->author = $dataset["author"];
			$this->desc = $dataset["desc"];
		}
		function read($name) {
			$dataset = [];
			$sql = "SELECT * FROM universe";
			isset($name) ? $sql .= " WHERE name = '".$name."';" : $sql .= ";";
			foreach ($this->db->query($sql) as $row) {
				$universe = new Universe();
				$universe->create(
					[
						"id" => $row["id"],
						"name" => $row["name"],
						"author" => $row["author"],
						"desc" => $row["desc"]
					]
				);
				array_push($dataset, $universe);
			}
			return $dataset;
		}
		function update($dataset) {
			return "Hahah, update, lol";
		}
		function delete($name) {
			return "Hahah, delete, lol";
		}
	}
?>