var formulario = document.getElementById("form-login");
var mensaje = document.getElementById("mensaje");

var URL_API = "https://portfolio-api-three-black.vercel.app/api/v1";

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  var datos = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {
    var respuesta = await fetch(URL_API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (respuesta.ok) {
      var resultado = await respuesta.json();
      localStorage.setItem("token", resultado.token);
      window.location.href = "home.html";
    } else {
      mensaje.className = "mensaje error";
      mensaje.textContent = "Correo o contrasena incorrectos";
    }
  } catch (error) {
    mensaje.className = "mensaje error";
    mensaje.textContent = "No se pudo conectar con el servidor";
  }
});