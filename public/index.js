document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("copyright-year")?.replaceWith(new Text(new Date().getFullYear()));
	document.body.normalize();
}, {once: true, passive: true, capture: false});