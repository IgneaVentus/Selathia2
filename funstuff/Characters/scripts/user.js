function dummy (e) {
	let loginInput = document.getElementById("userLoginInput").value;
	let passwordInput = document.getElementById("userPasswordInput").value;
	if (loginInput == "Demdaru" && passwordInput == "Maven") {
		loginInput = null;
		passwordInput = null;
		sessionStorage.setItem("loggedIn", "Demdaru");
		document.dispatchEvent(new CustomEvent("loginAttempt", { detail: "success" }));
	}
	else document.dispatchEvent(new CustomEvent("loginAttempt", { detail: "failed" }));
}

window.addEventListener("load", (e) => {
	document.getElementById("userLoginSubmit").addEventListener("click", dummy);
})