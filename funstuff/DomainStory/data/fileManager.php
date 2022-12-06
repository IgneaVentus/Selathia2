<?php
	$queryType = $_SERVER["REQUEST_METHOD"];

	class Response {
		public $success = false;
		public $content = null;
	}

	class Data {
		public $id = null;
		private $password = null;
		public $title = null;
		public $url = null;
		public $content = null;
		public $dbpath = "sqlite:funstuff/DomainStory/data/data.db";

		public function create($passwd) {
			if (!empty($passwd)) $this->password = $passwd;
			$conn = new PDO($this->dbpath);
			$stmt = $conn->prepare("INSERT INTO articles (password, title, url, content) VALUES (:password, :title, :url, :content)");

			$stmt->bindParam(":password", $this->password);
			$stmt->bindParam(":title", $this->title);
			$stmt->bindParam(":url", $this->url);
			$stmt->bindParam(":content", $this->content);

			$result = $stmt->execute();
			$this->id = $conn->lastInsertId();
			$conn = null;
			return $result;
		}

		public function read() {
			$conn = new PDO($this->dbpath);
			$stmt = $conn->prepare("SELECT * FROM articles WHERE id = :id");
			$stmt->bindParam(":id", $this->id);

			$stmt->execute();

			$result = $stmt->fetch(PDO::FETCH_NAMED);
			$conn = null;

			$this->id = $result["id"];
			$this->password = $result["password"];
			$this->title = $result["title"];
			$this->url = $result["url"];
			$this->content = $result["content"];

			return $result["id"];
		}

		public function update() {
			$conn = new PDO($this->dbpath);
			$stmt = $conn->prepare("UPDATE TABLE articles SET password = :password, title = :title, url = :url, content = :content WHERE id = :id");

			$stmt->bindParam(":id", $this->id);
			$stmt->bindParam(":password", $this->password);
			$stmt->bindParam(":title", $this->title);
			$stmt->bindParam(":url", $this->url);
			$stmt->bindParam(":content", $this->content);

			$result = $stmt->execute();
			$conn = null;
			return $result;
		}

		public function delete() {
			$conn = new PDO($this->dbpath);
			$stmt = $conn->prepare("DELETE FROM article WHERE id = :id");
			
			$stmt->bindParam(":id", $this->id);

			$result = $stmt->execute();
			$conn = null;
			return $result;
		}

		public function reinit() {
			$conn = new PDO($this->dbpath);
			$conn->exec("DROP TABLE IF EXISTS articles");
			$conn->exec(
				"CREATE TABLE articles (
					id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
					password TEXT,
					title TEXT NOT NULL,
					url TEXT,
					content TEXT NOT NULL
				)"
			);
			$conn = null;
		}

		public function passwordMatch($passwd) {
			if ($this->password == $passwd) return true;
			else return false;
		}
	}

	$res = new Response();
	$buf = new Data();

	if ($queryType == "GET") {
		if (isset($_GET["id"])) {
			$buf->id = $_GET["id"];
			if ($buf->read()) {
				$res->content = $buf;
				$res->success = true;
			}
			else $res->content = "Loading failed.";
		}
		else $res->content = "Error: No parameter to load!";
		echo json_encode($res);
	}

	elseif ($queryType == "POST") {
		$update = false;
		$buf->reinit();
		if (isset($_POST["title"]) && isset($_POST["url"]) && isset($_POST["content"])) {
			// Check whether the ID and Password are both set. If they are it means update takes place
			// If so, check if password is correct and then proceed to allow update if it is, else stop
			if (isset($_POST["id"]) && isset($_POST["password"])) {
				$buf->id = $_POST["id"];
				$succ = $buf->read();
				if ($succ) {
					if ($buf->passwordMatch($_POST["password"])) $update = true;
					else {
						$res->content = "Error: Wrong password";
						echo json_encode($res);
						return 0;
					}
				}
				else {
					$res->content = "Error: Article not found";
					echo json_encode($res);
					return 0;
				}
			}
			$buf->title = $_POST["title"];
			$buf->url = $_POST["url"];
			$buf->content = $_POST["content"];
			if ($update) $succ = $buf->update();
			else  $succ = $buf->create($_POST["password"]);
			if ($succ) {
				$res->success = true;
				if ($buf->read($succ)) $res->content = $buf;
			}
		}
		else $res->content = "Error: Not all inputs given";
		echo json_encode($res);
	}

	elseif ($queryType == "DELETE") {
		if (isset($_POST["id"]) && isset($_POST["password"])) {
			$buf->id = $_POST["id"];
			$succ = $buf->read($buff->id);
			if ($succ) {
				if ($buf->password == $_POST["password"]) {
					$buff->delete();
					$res->success = true;
				}
			}
			else $res->content = "Error: Article not found";
		}
		else $res->content = "Error: Not all inputs given";
		echo json_encode($res);
	}
	
	else echo "ERROR";
?>