<?php
	namespace App\Models;
	use \PDO;


	function initialize () {
		try {
			$db = new PDO("sqlite:./data/central.db", null, null, array(PDO::ATTR_PERSISTENT => true));
			$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
			
			$sth = $db->exec("DROP TABLE IF EXISTS universe");
			$sth = $db->exec("DROP TABLE IF EXISTS category");
			$sth = $db->exec("DROP TABLE IF EXISTS article_tag");
			$sth = $db->exec("DROP TABLE IF EXISTS article");
			$sth = $db->exec("DROP TABLE IF EXISTS tag");

			$sth =  $db->exec(
				"CREATE TABLE universe (
					id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
					name text NOT NULL UNIQUE,
					author text NOT NULL,
					desc text NOT NULL
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
				"INSERT INTO universe (name, author, desc) VALUES 
				('Selathia', 'IgneaVentus', 'Świat oparty o tematykę Miecza i Czarnej magii, niskie fantasy.'),
				('Nimoria', 'Mieczu', 'Pełne fetyszy uniwersum, które posiada zadziwiająco wysoką grywalność.');"
			);
		}
		catch (PDOException $e) {
			echo $e->getMessage();
		}
	}
?>