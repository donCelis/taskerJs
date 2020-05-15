/*
	--Validar el ingreso de la tarea -> ok
	--Capturar el valor de la tarea con su estado, pasarlo en un objeto. -> ok
	--Imprimir la tarea. -> ok
	--Diseñar la función plantilla (id, texto) -> ok
	--Animaciones de estado -> ok
	--Capturar los elementos del DOM -> ok
	--Cambiar el color del placeholder con js -> ok
	--Iniciar sesión
	--Anidar tareas
*/

/* const firebaseConfig = {
	apiKey: "AIzaSyBbCq8NiyEfPbkII91QzbhAqa8VcPAZo68",
	authDomain: "listatareasf1829152.firebaseapp.com",
	databaseURL: "https://listatareasf1829152.firebaseio.com",
	projectId: "listatareasf1829152",
	storageBucket: "",
	messagingSenderId: "5124718614",
	appId: "1:5124718614:web:b8aa39aa3bb5d3ec"
}; */

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//Esta variable debe ser goblal
let db = firebase.firestore();

let enviarTarea = document.querySelector('.iconAdd');
let entrada = document.getElementById('entrada');
let tareas = document.querySelector('.tareas');

function crearTarea(id,texto,estado){
	let color = '';
	let raya = '';

	if (estado === 'completo') {
		color = 'verde';
		raya = 'tachar';
	}

	let item = `
		<div id="${id}" estado="${estado}">
			<p class="${raya}">${texto}</p>
			<i class="ok fas fa-check-circle ${color}"></i>
		</div>`;
	return item;
}

function on(evento, selector, ejecutar) {
	document.addEventListener(evento, function(e) {
		const elementos = document.querySelectorAll(selector);
		const ruta = e.composedPath();
		ruta.forEach(function(nodo) {
			elementos.forEach(function(elem) {
				if (nodo === elem) {
					ejecutar.call(elem, e);
				}
			});
		});
	}, true);
}

//Evento de click para agregar la tarea
enviarTarea.addEventListener('click', ()=>{
	if (entrada.value == '') {
		entrada.placeholder = 'Campo obligatorio';
		entrada.style.border = '1px solid rgb(231, 76, 60)';
		entrada.classList.add('error', 'mover');

		setTimeout(()=>{
			entrada.classList.remove('mover');
		}, 500);
	}else{
		function enviarTarea(){
			db.collection('appTareas').add({
				nombre: entrada.value,
				estado: 'incompleto',
				fecha: firebase.firestore.FieldValue.serverTimestamp()
			})
			.then((docRef) => {
				console.log("Document written with ID: ", docRef.id);
				entrada.value = '';
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			});
		}
		enviarTarea();
	}
});

db.collection('appTareas').orderBy('fecha', 'desc').onSnapshot((querySnapshot) => {
	tareas.innerHTML = '';
	querySnapshot.forEach(function(doc){
		//console.log(`${doc.id} => ${doc.data()}`);
		let texto = doc.data().nombre;
		let unico = doc.id;
		let estado = doc.data().estado;
		tareas.innerHTML += crearTarea(unico,texto,estado);
	});
});

//Evento de click en el input del formulario
entrada.addEventListener('focus',function(){
	this.classList.remove('error', 'mover');
	this.placeholder = 'Ingresar tarea';
	this.style.border = '1px solid rgb(41, 128, 185)';
});

//Evento de dar click afuera del input del formulario
entrada.addEventListener('blur',function(){
	this.style.border = '1px solid rgba(44, 62, 80, 0.5)';
});

//Evento para agregar el estado de ok
on('click', '.ok', function(doc){
	this.classList.toggle('verde');
	this.previousElementSibling.classList.toggle('tachar');

	let idUnico = this.parentNode.getAttribute('id');
	let datos = db.collection('appTareas').doc(idUnico);
	datos.update({estado: 'completo'});
});

//Iniciar la sesión
function iniciarSesion(usuario, contra){
	firebase.auth().signInWithEmailAndPassword(usuario, contra)
	.then(function(){
		console.log('La sesión fue iniciada');
	})
	.catch(function(error) {
		// Handle Errors here.
		let errorCode = error.code;
		let errorMessage = error.message;

		console.log(`${errorCode} ${errorMessage}`);
	});
}

let btnSesion = document.querySelector('.iniSesion input');

btnSesion.addEventListener('click', function(e){
	e.preventDefault();
	let usuario = document.querySelector('#usuario').value;
	let contra = document.querySelector('#contra').value;
	iniciarSesion(usuario, contra);
});

let seleIniciarSesion = document.querySelector('.iniciarSesion');
let seleSesionActiva = document.querySelector('.sesionActiva');

let btnCerrar = document.querySelector('.cerrar');
let nombreUsuario = document.querySelector('.titulo span');

function sesionActiva(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			let uid = user.uid;
			console.log(user.email);
			seleSesionActiva.style.display = 'block';
			seleIniciarSesion.style.display = 'none';
			btnCerrar.style.display = 'block';
			nombreUsuario.innerHTML = ` de ${user.displayName}`;
			console.log('la sesión esta activa');
			let providerData = user.providerData;
			console.log(providerData);
		} else {
			seleIniciarSesion.style.display = 'block';
		}
	});
}
sesionActiva();

//Cerrar la sesión
function cerrarSesion(){
	firebase.auth().signOut().then(()=>{
		console.log('Sesión finalizada');
		seleIniciarSesion.style.display = 'block';
		seleSesionActiva.style.display = 'none';
		btnCerrar.style.display = '';
		nombreUsuario.innerHTML = '';
	});
}

btnCerrar.addEventListener('click', ()=>{
	cerrarSesion();
});