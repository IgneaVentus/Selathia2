<?php

	namespace App\Controllers\Auth;
	use App\Models\User;

	function createNewUser (String $nickname, String $password) {
		$user = User::create($nickname, $password);
		if ($user == 0) {
			error_log("Failed to create new user! Reason: ");
			return 0;
		}
		else return 1;
	}

	function authenticate () {
		if (!isset($_POST["username"]) || !isset($_POST["password"])) return 0;
		else {
			$nickname = $_POST["username"];
			$password = $_POST["password"];
		}
		$user = User::read($nickname);
		if ($user == 0) {
			error_log("Failed to load requested user! Nickname: ".$nickname);
			return 0;
		}
		else {
			if (password_verify($password, $user->password)) {
				return 1;
			}
			else {
				error_log("Failed login attempt! Nickname: ".$nickname);
				return 0;
			}
		}
	}
?>