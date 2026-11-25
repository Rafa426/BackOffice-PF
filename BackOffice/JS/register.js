var formulario = document.getElementById("form-register");
var mensaje = document.getElementById("mensaje");

var URL_API = "https://portfolio-api-three-black.vercel.app/api/v1";

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  var datos = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    itsonId: document.getElementById("itsonId").value,
    password: document.getElementById("password").value
  };

  try {
    var respuesta = await fetch(URL_API + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    var resultado = await respuesta.json();

    if (respuesta.ok) {
      mensaje.className = "mensaje exito";
      mensaje.textContent = "Cuenta creada, ya puedes iniciar sesion";
      setTimeout(function () {
        window.location.href = "login.html";
      }, 1500);
    } else {
      mensaje.className = "mensaje error";
      mensaje.textContent = resultado.message;
    }
  } catch (error) {
    mensaje.className = "mensaje error";
    mensaje.textContent = "No se pudo conectar con el servidor";
  }
});