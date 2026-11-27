var URL_API = "https://portfolio-api-three-black.vercel.app/api/v1";
var token = localStorage.getItem("token");

var panel = document.getElementById("panel");
var seccionForm = document.getElementById("seccion-form");
var formulario = document.getElementById("form-proyecto");
var mensaje = document.getElementById("mensaje");
var tituloForm = document.getElementById("titulo-form");
var idEditando = "";

async function cargarProyectos() {
  try {
    var respuesta = await fetch(URL_API + "/projects", {
      headers: { "auth-token": token }
    });

    if (respuesta.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    var proyectos = await respuesta.json();
    mostrarProyectos(proyectos);
  } catch (error) {
    mensajePanel("No se pudo conectar con el servidor");
  }
}

function mensajePanel(texto) {
  panel.innerHTML = "";
  var p = document.createElement("p");
  p.className = "vacio";
  p.textContent = texto;
  panel.appendChild(p);
}

function mostrarProyectos(proyectos) {
  panel.innerHTML = "";

  if (proyectos.length === 0) {
    mensajePanel("Todavia no tienes proyectos");
    return;
  }

  for (var i = 0; i < proyectos.length; i++) {
    panel.appendChild(crearTarjeta(proyectos[i]));
  }
}

function crearTarjeta(proyecto) {
  var tarjeta = document.createElement("article");
  tarjeta.className = "proyecto";

  var titulo = document.createElement("h3");
  titulo.textContent = proyecto.title;

  var descripcion = document.createElement("p");
  descripcion.textContent = proyecto.description;

  var etiquetas = document.createElement("div");
  etiquetas.className = "etiquetas";
  var tecnologias = proyecto.technologies;
  for (var i = 0; i < tecnologias.length; i++) {
    var etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = tecnologias[i];
    etiquetas.appendChild(etiqueta);
  }

  var botones = document.createElement("div");
  botones.className = "botones-proyecto";

  var botonEditar = document.createElement("button");
  botonEditar.type = "button";
  botonEditar.className = "boton-editar";
  botonEditar.textContent = "Editar";

  var botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.className = "boton-eliminar";
  botonEliminar.textContent = "Eliminar";
  
  
  botonEditar.onclick = function () {
    pedirProyecto(proyecto._id);
  };
  botonEliminar.onclick = function () {
    eliminarProyecto(proyecto._id);
  };

  botones.appendChild(botonEditar);
  botones.appendChild(botonEliminar);

  tarjeta.appendChild(titulo);
  tarjeta.appendChild(descripcion);
  tarjeta.appendChild(etiquetas);
  tarjeta.appendChild(botones);

  return tarjeta;
}

// pide un proyecto por id y lo pasa al formulario
async function pedirProyecto(id) {
  var respuesta = await fetch(URL_API + "/projects/" + id, {
    headers: { "auth-token": token }
  });

  if (respuesta.ok) {
    var proyecto = await respuesta.json();
    llenarFormulario(proyecto);
  } else {
    alert("No se pudo cargar el proyecto");
  }
}

// pasa los datos del proyecto al formulario
function llenarFormulario(proyecto) {
  idEditando = proyecto._id;
  tituloForm.textContent = "Editar proyecto";
  mensaje.textContent = "";

  document.getElementById("titulo").value = proyecto.title;
  document.getElementById("descripcion").value = proyecto.description;
  document.getElementById("tecnologias").value = proyecto.technologies.join(", ");

  document.getElementById("repositorio").value = "";
  if (proyecto.repository) {
    document.getElementById("repositorio").value = proyecto.repository;
  }

  seccionForm.classList.remove("oculto");
}

// eliminar proyecto
async function eliminarProyecto(id) {
  var seguro = confirm("Seguro que quieres eliminar este proyecto?");

  if (seguro) {
    var respuesta = await fetch(URL_API + "/projects/" + id, {
      method: "DELETE",
      headers: { "auth-token": token }
    });

    if (respuesta.ok) {
      cargarProyectos();
    } else {
      alert("No se pudo eliminar el proyecto");
    }
  }
}

// formulario
document.getElementById("btn-agregar").addEventListener("click", function () {
  formulario.reset();
  mensaje.textContent = "";
  idEditando = "";
  tituloForm.textContent = "Nuevo proyecto";
  seccionForm.classList.remove("oculto");
});

document.getElementById("btn-cancelar").addEventListener("click", function () {
  seccionForm.classList.add("oculto");
});

function separarTecnologias(texto) {
  var lista = [];
  var partes = texto.split(",");
  for (var i = 0; i < partes.length; i++) {
    var tecnologia = partes[i].trim();
    if (tecnologia !== "") {
      lista.push(tecnologia);
    }
  }
  return lista;
}

// crear proyecto
formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  var proyecto = {
    title: document.getElementById("titulo").value,
    description: document.getElementById("descripcion").value,
    technologies: separarTecnologias(document.getElementById("tecnologias").value)
  };

  var repositorio = document.getElementById("repositorio").value;
  if (repositorio !== "") {
    proyecto.repository = repositorio;
  }

  
  var metodo = "POST";
  var url = URL_API + "/projects";

  if (idEditando !== "") {
    metodo = "PUT";
    url = URL_API + "/projects/" + idEditando;
  }

  try {
        var respuesta = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        "auth-token": token
      },
      body: JSON.stringify(proyecto)
    });

    var resultado = await respuesta.json();

    if (respuesta.ok) {
      seccionForm.classList.add("oculto");
      cargarProyectos();
    } else {
      mensaje.className = "mensaje error";
      mensaje.textContent = resultado.message;
    }
  } catch (error) {
    mensaje.className = "mensaje error";
    mensaje.textContent = "No se pudo conectar con el servidor";
  }
});

// cerrar sesion
document.getElementById("btn-salir").addEventListener("click", function () {
  localStorage.removeItem("token");
});

cargarProyectos();