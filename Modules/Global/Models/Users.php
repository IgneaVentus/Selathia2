<?php
	namespace App\Models;
	use \PDO;

	class User extends PDO {
		public string $username;
		public string $password;
		public string $id;
		private bool $is_auth;

		private function __construct(string $username, string $password, int $id, bool $auth) {
			$this->username = $username;
			$this->password = $password;
			$this->id = $id;
			$this->is_auth = $auth;
		}

		public static function create(string $username, string $password) {
			$db = create_connection();

			$sth = $db->prepare("INSERT INTO User (username, password) VALUES (?, ?)");

			$hashed_password = password_hash($password, PASSWORD_BCRYPT);

			if ($sth->execute([$username, $hashed_password])) return new self($username, $hashed_password, $db->lastInsertId(), true);
			else return 0;
		}

		public static function read (string $username) {
			$db = create_connection();

			// $sth = $db->prepare("SELECT * FROM User WHERE username = ?");

			// $result = $sth->execute([$username]);
			$result = $db->query("SELECT * FROM User WHERE username = \"".$username."\"")->fetch();

			if ($result) return new self ($result["username"], $result["password"], $result["id"], false);
			else return 0;
		}

		public static function restartTable () {
			$db = create_connection();
			$db->exec("DROP TABLE IF EXISTS User");
			$db->exec(
				"CREATE TABLE User (
					id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
					username text NOT NULL UNIQUE,
					password text NOT NULL
				)"
			);
			$db->exec(
				"INSERT INTO User (username, password) VALUES ('Demdaru', '".password_hash("Maven", PASSWORD_BCRYPT)."');"
			);
			return "Restart finished.";
		}

		public function update (string $field, string $value) {
			if (!$this->is_auth) return 0;

			$sql = "";
			switch ($field) {
				case "username":
					$sql = "UPDATE User SET username = ? WHERE id = ?";
					break;
				case "password":
					$value = password_hash($value, PASSWORD_BCRYPT);
					$sql = "UPDATE User SET password = ? WHERE id = ?";
					break;
			}
			if ($sql == "") return 0;

			$db = create_connection();
			$sth = $db->prepare($sql);

			if ($sth->execute([$value, $this->id])) {
				if ($field = "username") $this->username = $value;
				else $this->password = $value;
				return 1;
			}
			else return 0;
		}

		public function authenticate() {
			$this->is_auth = true;
		}
	}

	function create_connection() {
		$db = new PDO("sqlite:./Modules/Global/Data/central.db", null, null, array(PDO::ATTR_PERSISTENT => true));
		$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		return $db;
	}
?>