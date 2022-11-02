const formulario = document.querySelector('#formulario');
const contenedor = document.querySelector('.container');
const resultado = document.querySelector('#resultado');

document.addEventListener('DOMContentLoaded', () => {
  formulario.addEventListener('submit', obtenerTemperatura);
});

function obtenerTemperatura(e) {
  e.preventDefault();

  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;

  if (ciudad == '' || pais == '') {
    mostrarMensaje('Debe Rellenar Todos Los Campos');
    return;
  }

  consultarAPI(ciudad, pais);
}

function consultarAPI(ciudad, pais) {
  const APIKey = '746718d44318fcbf6ee7b26cc35fa1c5';
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${APIKey}`;

  console.log(APIUrl);
  spinner();
  fetch(APIUrl)
    .then((respuesta) => respuesta.json())
    .then((resultadoPeticion) => {
      limpiarHTML();
      if (resultadoPeticion.cod === '404') {
        mostrarMensaje('Ciudad No Encontrada');
        const p = document.createElement('p');
        p.classList.add('text-center', 'text-white', 'mt-6');
        p.textContent = 'Intenta de nuevo';
        resultado.appendChild(p);
        return;
      }

      mostrarHTML(resultadoPeticion);
    });
}

function mostrarHTML(resultado) {
  const {
    name,
    main: { temp, temp_min, temp_max },
  } = resultado;

  let temperaturaActual = kelvinACelcius(temp);
  let temperaturaMaxima = kelvinACelcius(temp_max);
  let temperaturaMinima = kelvinACelcius(temp_min);

  construirHTML(name, temperaturaActual, temperaturaMaxima, temperaturaMinima);
}

function spinner() {
  limpiarHTML();
  const spinner = document.createElement('div');
  spinner.classList.add('sk-fading-circle');
  spinner.innerHTML = `
  <div class="sk-circle1 sk-circle"></div>
  <div class="sk-circle2 sk-circle"></div>
  <div class="sk-circle3 sk-circle"></div>
  <div class="sk-circle4 sk-circle"></div>
  <div class="sk-circle5 sk-circle"></div>
  <div class="sk-circle6 sk-circle"></div>
  <div class="sk-circle7 sk-circle"></div>
  <div class="sk-circle8 sk-circle"></div>
  <div class="sk-circle9 sk-circle"></div>
  <div class="sk-circle10 sk-circle"></div>
  <div class="sk-circle11 sk-circle"></div>
  <div class="sk-circle12 sk-circle"></div>
  `;

  resultado.appendChild(spinner);
}

function construirHTML(nombre, actual, maxima, minima) {
  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center', 'text-white');
  const actualTemp = document.createElement('p');
  actualTemp.classList.add('font-bold', 'text-6xl');
  actualTemp.innerHTML = `${actual} &#8451`;
  const tempMax = document.createElement('p');
  tempMax.classList.add('text-xl');
  tempMax.innerHTML = `Temperatura Maxima: ${maxima} &#8451`;
  const tempMin = document.createElement('p');
  tempMin.classList.add('text-xl');
  tempMin.innerHTML = `Temperatura Minima: ${minima} &#8451`;
  const nombreCiudad = document.createElement('p');
  nombreCiudad.classList.add('text-2xl', 'font-bold');
  nombreCiudad.textContent = nombre;

  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actualTemp);
  resultadoDiv.appendChild(tempMax);
  resultadoDiv.appendChild(tempMin);
  resultado.appendChild(resultadoDiv);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}
const kelvinACelcius = (temp) => parseInt(temp - 273.15);

function mostrarMensaje(mensaje) {
  const alerta = document.querySelector('.mensaje-alerta');
  if (!alerta) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.classList.add(
      'mensaje-alerta',
      'bg-red-100',
      'border-red-400',
      'text-red-700',
      'mt-6',
      'px-4',
      'py-3',
      'rounded',
      'max-w-md',
      'mx-auto',
      'text-center'
    );
    mensajeDiv.innerHTML = `<strong class="font-bold">Error!</strong> <span class="block">${mensaje}</span>`;
    contenedor.appendChild(mensajeDiv);

    setTimeout(() => {
      mensajeDiv.remove();
    }, 2000);
  }
}
