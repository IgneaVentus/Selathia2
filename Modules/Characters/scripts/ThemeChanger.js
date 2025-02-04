const colorFields = new Map();
colorFields.set("gradientBase", "#770059");
colorFields.set("navColorA", "#ff33ccaa");
colorFields.set("navColorB", "#770059cc");
colorFields.set("mainBase", "#360029a1");

const rootColors = document.querySelector(":root").style;

var letterSequence = "aaaa";

function switchTheme(themeName) {
	switch (themeName){
		case "blue":
			colorFields.set("gradientBase", "#000077");
			colorFields.set("navColorA", "#3333ffaa");
			colorFields.set("navColorB", "#000077cc");
			colorFields.set("mainBase", "#000036a1");
			break;
		case "red":
			colorFields.set("gradientBase", "#770000");
			colorFields.set("navColorA", "#ff3333aa");
			colorFields.set("navColorB", "#770000cc");
			colorFields.set("mainBase", "#360000a1");
			break;
		case "cyan":
			colorFields.set("gradientBase", "#005977");
			colorFields.set("navColorA", "#33ccffaa");
			colorFields.set("navColorB", "#005977cc");
			colorFields.set("mainBase", "#002936a1");
			break;
		case "ambr":
			colorFields.set("gradientBase", "#774400");
			colorFields.set("navColorA", "#ffac59aa");
			colorFields.set("navColorB", "#613700cc");
			colorFields.set("mainBase", "#361400a1");
			break;
		default:
			colorFields.set("gradientBase", "#770059");
			colorFields.set("navColorA", "#ff33ccaa");
			colorFields.set("navColorB", "#770059cc");
			colorFields.set("mainBase", "#360029a1");
	}
	colorFields.forEach((value, key) => {
		switchColor(key, value);
	})
}

function switchColor(field, color) {
	if (colorFields.has(field)) rootColors.setProperty("--"+field, color);
}

function keyReader (e) {
	letterSequence = letterSequence.slice(-3) + e.key;
	if (letterSequence.includes("red")) switchTheme("red");
	if (letterSequence.includes("blue")) switchTheme("blue");
	if (letterSequence.includes("cyan")) switchTheme("cyan");
	if (letterSequence.includes("ambr")) switchTheme("ambr");
	if (letterSequence.includes("base")) switchTheme();
}

document.addEventListener("keydown", keyReader);