<?php
	namespace App\Models;
	use \PDO;
	
	interface iModel {
		function __construct();
		function create ($dataset);
		function read ($name);
		function update ($dataset);
		function delete ($name);
	}

	class Universe extends \PDO implements iModel {

		private $db;
		public $id;
		public $name;
		public $desc;
		public $author_id;

		function __construct() {
			$this->db = new PDO("sqlite:./data/central.db", null, null, array(PDO::ATTR_PERSISTENT => true));
			$this->db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		}
		
		function create($dataset) {
			if (isset($dataset["id"])) $this->id = $dataset["id"];
			$this->name = $dataset["name"];
			$this->author_id = $dataset["author_id"];
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
						"author_id" => $row["author_id"],
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

	function initialize () {
		try {
			$db = new PDO("sqlite:./data/central.db", null, null, array(PDO::ATTR_PERSISTENT => true));
			$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
			
			$sth = $db->exec("DROP TABLE IF EXISTS user");
			$sth = $db->exec("DROP TABLE IF EXISTS universe");
			$sth = $db->exec("DROP TABLE IF EXISTS category");
			$sth = $db->exec("DROP TABLE IF EXISTS article_tag");
			$sth = $db->exec("DROP TABLE IF EXISTS article");
			$sth = $db->exec("DROP TABLE IF EXISTS tag");


			$sth =  $db->exec(
				"CREATE TABLE user (
					id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
					name text NOT NULL UNIQUE,
					password text NOT NULL
				)"
			);
			$sth =  $db->exec(
				"CREATE TABLE universe (
					id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
					name text NOT NULL UNIQUE,
					desc text NOT NULL,
					author_id text NOT NULL,
					FOREIGN KEY (author_id) REFERENCES user (id)
				)"
			);
			$sth =  $db->exec(
				"CREATE TABLE category (
					id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
					name text NOT NULL
				)"
			);
			$sth =  $db->exec(
				"CREATE TABLE article (
					id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
					title text NOT NULL,
					desc text NOT NULL,
					content text NOT NULL,
					index INTEGER NOT NULL,
					category_id INTEGER,
					FOREIGN KEY (category_id) REFERENCES category(id)
				)"
			);
			$sth =  $db->exec(
				"CREATE TABLE tag (
					id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
					name text NOT NULL,
					desc text NOT NULL
				)"
			);
			$sth =  $db->exec(
				"CREATE TABLE article_tag (
					article_id INTEGER NOT NULL,
					tag_id INTEGER NOT NULL,
					FOREIGN KEY (article_id) REFERENCES article(id),
					FOREIGN KEY (tag_id) REFERENCES tag(id)
				)"
			);
			$sth = $db->exec(
				"INSERT INTO universe (name, author_id, desc) VALUES 
				('Selathia', 'IgneaVentus', 'Świat oparty o tematykę Miecza i Czarnej magii, niskie fantasy.'),
				('Nimoria', 'Mieczu', 'Pełne fetyszy uniwersum, które posiada zadziwiająco wysoką grywalność.');"
			);
		}
		catch (PDOException $e) {
			echo $e->getMessage();
		}
	}
?>