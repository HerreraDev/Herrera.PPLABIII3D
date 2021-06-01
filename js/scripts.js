import Anuncio_Auto from "./Anuncio_Auto.js";

const anuncios = JSON.parse(localStorage.getItem("lista")) || [];

window.addEventListener("DOMContentLoaded", () => {
  document.forms[0].addEventListener("submit", handlerSubmbit);

  document.addEventListener("click", handlerClick);

  if (anuncios.length > 0) {
    handlerLoadList(anuncios);
  }
});

function limpiarFormulario(frm) {
  //saco los datos de los campos
  frm.reset();

  //oculto el boton eliminar
  document.getElementById("btnEliminar").classList.add("oculto");

  //oculto el boton cancelar
  document.getElementById("btnCancelar").classList.add("oculto");


  //vuelvo el boton de alta al original
  document.getElementById("btnSubmit").value = "Guardar";

  //seteo en cadena vacia el valor del id
  document.forms[0].id.value = "";
}

function handlerSubmbit(e) {
  e.preventDefault();
  const frm = e.target;

  if (frm.id.value) {
    const anuncioEditado = new Anuncio_Auto(
      parseInt(frm.id.value),
      frm.titulo.value,
      frm.transaccion.value,
      frm.descripcion.value,
      parseFloat(frm.precio.value),
      parseInt(frm.cantPuertas.value),
      parseInt(frm.cantKMS.value),
      parseInt(frm.potencia.value)
    );

    if (confirm("Confirma Modificacion?")) {
      agregarSpinner();

      setTimeout(() => {
        modificarAnuncio(anuncioEditado);
        eliminarSpinner();
      }, 3000);
    }
  } else {
    console.log("Dando de alta");
    const nuevoAnuncio = new Anuncio_Auto(
        Date.now(),
        frm.titulo.value,
        frm.transaccion.value,
        frm.descripcion.value,
        parseFloat(frm.precio.value),
        parseInt(frm.cantPuertas.value),
        parseInt(frm.cantKMS.value),
        parseInt(frm.potencia.value)
      );

    agregarSpinner();

    setTimeout(() => {
      altaAnuncio(nuevoAnuncio);
      eliminarSpinner();
    }, 3000);
  }
  limpiarFormulario(frm);
}


//------------------------------Spinner------------------------------------//
function agregarSpinner() {
  let spinner = document.createElement("img");
  spinner.setAttribute("src", "./assets/spinner.gif");
  spinner.setAttribute("alt", "imagen spinner");
  spinner.setAttribute("width","60px");

  document.getElementById("spinner-container").appendChild(spinner);
}

function eliminarSpinner() {
  document.getElementById("spinner-container").innerHTML = "";
}
//-------------------------------------------------------------------------//


//------------------------------LocalStorage-------------------------------//

function almacenarDatos(data) {
  localStorage.setItem("lista", JSON.stringify(data));

  handlerLoadList();
}
//-------------------------------------------------------------------------//

//------------------------------ABM----------------------------------------//

function modificarAnuncio(p) {
  let index = anuncios.findIndex((per) => {
    return per.id == p.id;
  });

  anuncios.splice(index, 1, p);

  almacenarDatos(anuncios);
}

function altaAnuncio(p) {
  anuncios.push(p);

  almacenarDatos(anuncios);
}

//-------------------------------------------------------------------------//


//----------------------Renderizar y crear tablas--------------------------//
function handlerLoadList(e) {
  renderizarLista(crearTabla(anuncios), document.getElementById("divLista"));
}

function renderizarLista(lista, contenedor) {
  //vaciar el contenedor
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild);
  }

  if (lista) {
    contenedor.appendChild(lista);
  }
}

function crearTabla(items) {
  const tabla = document.createElement("table");

  tabla.appendChild(crearThead(items[0]));
  tabla.appendChild(crearTbody(items));

  return tabla;
}

function crearThead(item) {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  for (const key in item) {
    if (key !== "id") {
      const th = document.createElement("th");
      const texto = document.createTextNode(key);
      th.appendChild(texto);
      tr.appendChild(th);
    }
  }
  thead.appendChild(tr);

  return thead;
}

function crearTbody(items) {
  const tbody = document.createElement("tbody");

  items.forEach((item) => {
    const tr = document.createElement("tr");

    for (const key in item) {
      if (key === "id") {
        tr.setAttribute("data-id", item[key]);
      } else {
        const td = document.createElement("td");
        const texto = document.createTextNode(item[key]);
        td.appendChild(texto);
        tr.appendChild(td);
      }
    }
    tbody.appendChild(tr);
  });

  return tbody;
}

//-------------------------------------------------------------------------//


//---------------------Click y carga form----------------------------------//
function handlerClick(e) {
  if (e.target.matches("td")) {
    //dataset.id es porque al tr le puse atributo "data-id"
    let id = e.target.parentNode.dataset.id;
    console.log(id);
    cargarFormulario(id);
  } else if (e.target.matches("#btnEliminar")) {
    let id = parseInt(document.forms[0].id.value);
    if (confirm("Confirma Eliminacion?")) {
      agregarSpinner();

      setTimeout(() => {
        let index = anuncios.findIndex((el) => el.id === id);

        anuncios.splice(index, 1);

        almacenarDatos(anuncios);

        eliminarSpinner();
      }, 3000);
    }

    limpiarFormulario(document.forms[0]);
  }
  else if (e.target.matches("#btnCancelar")){
    agregarSpinner();
    setTimeout(() => {

      limpiarFormulario(document.forms[0]);

      eliminarSpinner();
    }, 3000);
  }
}

function cargarFormulario(id) {
  //desestructuro y devuelvo a la persona
  const { titulo, transaccion, descripcion, precio, cantPuertas, cantKMS, potencia } = anuncios.filter(
    (p) => p.id === parseInt(id)
  )[0];

  //referencia al form
  const frm = document.forms[0];

  //cargo el form con los datos
  frm.titulo.value = titulo;
  frm.transaccion.value = transaccion;
  frm.descripcion.value = descripcion;
  frm.id.value = id;
  frm.precio.value = precio;
  frm.cantPuertas.value = cantPuertas;
  frm.cantKMS.value = cantKMS;
  frm.potencia.value = potencia;

  document.getElementById("btnSubmit").value = "Modificar";
  document.getElementById("btnEliminar").classList.remove("oculto");
  document.getElementById("btnCancelar").classList.remove("oculto");
  
}

//-------------------------------------------------------------------------//

