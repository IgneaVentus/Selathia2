async function dummy (e) {
	let form = new FormData();
	form.append("username", document.getElementById("userLoginInput").value);
	form.append("password", document.getElementById("userPasswordInput").value);
	fetch(window.location.origin+"/API/Login", {
		method: "POST",
		body: form
	})
	.then(response => {
		if (response.ok) return response.text();
	})
	.then (data => {
		if (data == 1) {
			sessionStorage.setItem("loggedIn", "Demdaru");
			document.dispatchEvent(new CustomEvent("loginAttempt", { detail: "success" }));
		}
		else throw new Exception("");
	})
	.catch ((e) => {
		console.log(e.message);
		document.dispatchEvent(new CustomEvent("loginAttempt", { detail: "failed" }))
	});
	// if (loginInput == "Demdaru" && passwordInput == "Maven") {
	// 	loginInput = null;
	// 	passwordInput = null;
	// 	sessionStorage.setItem("loggedIn", "Demdaru");
	// 	document.dispatchEvent(new CustomEvent("loginAttempt", { detail: "success" }));
	// }
	// else document.dispatchEvent(new CustomEvent("loginAttempt", { detail: "failed" }));
}

window.addEventListener("load", (e) => {
	document.getElementById("userLoginSubmit").addEventListener("click", dummy);
})