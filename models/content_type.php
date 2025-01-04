<?php

namespace App\Models;
use \PDO;
use \Exception;

class Article extends \PDO implements iModel {
	private $db;
	public $id;
	public $type;

	function __construct() {
		$this->db = new PDO("sqlite:./data/central.db", null, null, array(PDO::ATTR_PERSISTENT => true));
		$this->db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
	}

	# Fill data of the object and save it to database.
	# Return exception on wrong data, 0 on failure of write and 1 on success
	function create ($dataset) {
		if (isset($dataset["type"])) $this->parent_id = $dataset["type"];
		else throw new Exception ("Improperly defined type!");
		
		$sql = "INSERT INTO ContentType (";
		if (isset ($this->id)) $sql .= "id, ";
		$sql .= "parent_id, main_content, order_index) VALUES (";
		if (isset ($this->id)) $sql .= $this->id.", ";
		$sql .= $this->parent_id.", ".$this->main_content.", ".$this->order_index.")";
		$stmt = $this->db->prepare($sql);
		if($stmt->execute()) return 1;
		else return 0;
	}

	# Read an object from database and return it as an object of this class
	function read ($id) {
		$stmt = $this->db->prepare("SELECT * FROM articles WHERE id = ?");
		$stmt->execute([$id]);
		return $stmt->fetchObject(__CLASS__);
	}

	# Overhead for create function adding ID to the mix
	function update ($dataset) {
		if (isset($dataset["id"])) $this->id = $dataset["id"];
		else throw new Exception ("Improperly defined ID!");
		$this->create($dataset);
	}

	# Remove object from database. Return 1 on success and 0 on failure.
	function delete ($id) {
		$stmt = $this->db->prepare("DELETE FROM articles WHERE id = ?");
		if ($stmt->execute([$id])) return 1;
		else return 0;
	}
}