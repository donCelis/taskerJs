//document => Captura el documento html con sus hijos
let documento = document;
console.log(documento)

//Capturar un id
let idLista = document.getElementById('lista1');
console.log(idLista);
console.log(typeof idLista);

//Capturar una clase
let clasElemento = document.getElementsByClassName('elemento');
console.log(clasElemento);
console.log(typeof clasElemento);
console.log(clasElemento[1]);

//Capturar una etiqueta
let etiqueta = document.getElementsByTagName('li');
console.log(etiqueta);

idLista.style.background = 'green';
clasElemento[1].style.background = 'red';

//Capturar selectores
let selector = document.querySelector('#lista2 .elemento:last-child');
console.log(selector);

//Evento de mouse: click
let enviar = document.getElementById('enviar');

enviar.addEventListener('click', function(e) {
	e.preventDefault();
	//Datos del formulario
	let datos = {
		nombre: document.querySelector('#formulario input:nth-child(1)').value,
		apellido: document.querySelector('#formulario input:nth-child(2)').value
	}
	//Imprimir mensaje
	//innerHTML:Agrega contenido html al selector
	let contenido = document.querySelector('.contenido');

	contenido.innerHTML = `<h1>
		Gracias por enviar tus datos.
		<br>
		${datos.nombre} ${datos.apellido}
	</h1>`;
});