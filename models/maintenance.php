<?php
	namespace App\Models;

	function initialize ($db) {
		try {
			$sth = $db->exec("DROP TABLE IF EXISTS universe");
			$sth = $db->exec("DROP TABLE IF EXISTS category");
			$sth = $db->exec("DROP TABLE IF EXISTS article_tag");
			$sth = $db->exec("DROP TABLE IF EXISTS article");
			$sth = $db->exec("DROP TABLE IF EXISTS tag");

			$sth =  $db->exec(
				"CREATE TABLE universe (
					id int PRIMARY KEY  NOT NULL,
					name text NOT NULL,
					author text NOT NULL,
					desc text NOT NULL
				)"
			);
			$sth =  $db->exec(
				"CREATE TABLE category (
					id int PRIMARY KEY  NOT NULL,
					name text NOT NULL
				)"
			);
			$sth =  $db->exec(
				"CREATE TABLE article (
					id int PRIMARY KEY  NOT NULL,
					title text NOT NULL,
					desc text NOT NULL,
					content text NOT NULL
				)"
			);
			$sth =  $db->exec(
				"CREATE TABLE tag (
					id int PRIMARY KEY  NOT NULL,
					name text NOT NULL,
					desc text NOT NULL
				)"
			);
			$sth =  $db->exec(
				"CREATE TABLE article_tag (
					article_id int NOT NULL,
					tag_id int NOT NULL,
					FOREIGN KEY (article_id) REFERENCES article(id),
					FOREIGN KEY (tag_id) REFERENCES tag(id)
				)"
			);
		}
		catch (PDOException $e) {
			echo $e->getMessage();
		}
	}
?>