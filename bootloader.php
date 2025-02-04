<?php
	$loadList = [
		"./Modules/Characters/scripts/Charview.php", // Charview Controller
		"./Modules/Global/Controllers/Auth.php", // Authentication Controller
		"./Modules/Global/Controllers/controllers.php", // Depreciated patchwork of Controllers
		"./Modules/Global/Models/Users.php" // Global User model
	];

	foreach ($loadList as $module) {
		require_once $module;
	}
?>