function toggleCursos() {
	const div = document.getElementById('cursosRealizados');
	div.style.display = div.style.display === 'none' ? 'block' : 'none';
}
function toggleNavbar() {
	const navbar = document.getElementById("navbar");
	navbar.classList.toggle("responsive");
}

const form = document.getElementById('contactForm');
form.addEventListener('submit', function(event) {
	event.preventDefault();

	const name = document.getElementById('name').value.trim();
	const email = document.getElementById('email').value.trim();
	const message = document.getElementById('message').value.trim();

	if (!name || !email || !message) {
		alert('Por favor completa todos los campos.');
		return;
	}

	if (form.querySelector('input[name="botcheck"]').value !== "") {
		console.log("Envío cancelado.");
		return;
	}

	emailjs.init("HTZF7beur9Fdyt2Kp");
	emailjs.send("service_u5yu2tp", "template_gn1gkym",{
		name: name,
		message: message,
		email: email,
	})
	.then(() => {
		alert('Mensaje enviado con éxito!');
		form.reset();
	}, (error) => {
		alert('Error al enviar el mensaje.');
		console.error(error);
	});
});
