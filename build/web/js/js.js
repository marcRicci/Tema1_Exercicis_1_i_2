
//ENTORNO
var g = 1.622;
var dt = 0.016683;
var timer=null;
var pausa=false;
var timerFuel=null;
var encendido=false;
var explotar=false;
var dificultad=5;//Variable de velocidad de impacto.
var vImpacto=null;
var vImpacto2=null;
//NAVE
var y = 10; // altura inicial y0=10%, debe leerse al iniciar si queremos que tenga alturas diferentes dependiendo del dispositivo
var v = 0;//velocidad.
var c = 100;//combustible
var int=0;//variable de intentos.
var velImpacto=0;
var velImpacto2=0;
var a = g;//la aceleración cambia cuando se enciende el motor de a=g a a=-g (simplificado)
//MARCADORES
var velocidad = null;
var altura = null;
var combustible = null;
var intentos=null;

//al cargar por completo la página...
window.onload = function(){
	velocidad = document.getElementById("velocidad");
	altura = document.getElementById("altura");
	combustible = document.getElementById("fuel");
    intentos=document.getElementById("intentos");
    vImpacto=document.getElementById("vImpacto");
    vImpacto2=document.getElementById("vImpacto2");
    funcionalidadGeneral();
    document.getElementById("invisible").style.display="none";
    document.getElementById("naves").src="img/nave_sin_fuego.png";
	//definición de eventos
	
    	
	//encender/apagar el motor al presionar cualquier tecla.
	document.onkeydown = function () {
 	  if (a==g){
  	  	motorOn();
 	  } 
 	  else{
  		motorOff();
 	  }
	}
	//encender/apagar al apretar/soltar una tecla
	document.onkeyup = motorOff;
	document.onkeydown=motorOn;
	//Empezar a mover la nave justo después de cargar la página
	start();
}

//Definición de funciones
function start(){
	//cada intervalo de tiempo mueve la nave
	timer=setInterval(function(){ moverNave(); }, dt*1000);
}

function stop(){
	//Para la nave,apaga el motor y decrementa el fuel.
	motorOff();
	clearInterval(timer);
	clearInterval(timerFuel);
}

function moverNave(){
	var vReal=null;
	var aReal=null;
	//cambiar velocidad y posicion
	v +=a*dt;
	y +=v*dt;
	//velocidad siempre positiva.
	if(v<0){
		vReal=-v;
	}

	else if(v>=0){
		vReal=v;
	}
	//altura baja cuando la nave cae.
	aReal=70-y;
	
	if(aReal<=0){
		vReal=0;
	}
	//límite superior
	if(aReal>=73 && vReal>0){
		v-=v;
		y+=0.01;
		clearInterval(timerFuel);
	}
	else{
		v=v;	
	}
	//actualizar marcadores de aguja (cuentakilometros).
	document.getElementById("aguja").style.transform="rotate("+(vReal-107)*5+"deg)";
	//actualizar marcadores de texto.
	velocidad.innerHTML=vReal.toFixed(2);
	altura.innerHTML=aReal.toFixed(0);
	
	//mover hasta que top sea un 70% de la pantalla
	if (y<70){
		document.getElementById("nave").style.top = y+"%";
	}

	else{ 
		vImpactos();
		mostrar_nave_explotada();
		stop();
	}
}
function motorOn(){
	//el motor puede encenderse cuando el juego no este en pausa, la altura sea superior a 0 y el combustible no se haya agotado.
	if (timerFuel==null && y<70 && pausa==false && c>0){
	//mostramos la imagén del alienigena super saiyan cuando se encienda el motor.
	document.getElementById("alienigena").src="img/Alienigena_con_pelo.png";
	//el motor da aceleración a la nave
	a=-g;
	timerFuel=setInterval(function(){ actualizarFuel(); }, 10);
	//cambiamos el source de la nave sin fuego a la nave con fuego para que mientras acelere muestre la nave con fuego.
	document.getElementById("naves").src="img/nave_con_fuego.png";
	}
		
}
function motorOff(){	
	a=g;
	clearInterval(timerFuel);
	//si la nave o ha explotado mostramos la nave sin fuego y el alienigena sin pelo.
	if(explotar==false){
		document.getElementById("naves").src="img/nave_sin_fuego.png";
		document.getElementById("alienigena").src="img/Alienigena.png";
	}
	timerFuel=null;
}
function actualizarFuel(){
	//Restamos combustible hasta que se agota
	c-=0.1;
	if (c < 0 ){
		c = 0;	
	} 
	//si el combustible es inferior o igual a 0 se apaga el motor.
	if(c<=0){
    	motorOff();
	}	
	if(pausa==true){
		c=100;
	}
	document.getElementById("movimiento").style.bottom=(c*0.6-60)+"%";
	combustible.innerHTML=c.toFixed(1);		
}

function mostrar_nave_explotada (){/*Si la velocidad es superior a la dificultad(velocidad de impacto)                          la nave se estrella y se incrementa el marcador*/
	if(v>dificultad){
		mostrarMensajeExplosion();
    	explotar=true;
		incrementarMarcador();
		document.getElementById("naves").src="img/nave_explotada.gif";
	}	
	else{
		mostrarMensajeAterrizaje();
	}
}

function reiniciar(){//reinicia la partida (sin reiniciar el marcador de intentos fállidos).
	document.getElementById("reiniciar_img").onclick=function(){
		esconder();
		y = 10;
		v = 0;
		c = 100;
		explotar=false;
	//ponemos a 100 el marcador de fuel para que cuando reinicie el juego vuelva a 100 sin necesidad de apretar el espacio.
		combustible.innerHTML=100;
		document.getElementById("movimiento").style.bottom=(c*0.6-60)+"%";
		clearInterval(timer);
		document.getElementById("naves").src="img/nave_sin_fuego.png";
		start();
}
}
function pausa_continuar(){/*mostrar menú de pausa y ocultar o mostrar capas invisibles que
                       sirven para evitar la interacción con los botones cuando el juego esta pausado.*/
	var menu=document.getElementById("menu");
	var invisible=document.getElementById("invisible");
	document.getElementById("pausa_img").onclick=function(){
		stop();
		pausa=true;
		menu.style.display="block";
		invisible.style.display="block";
	}
	document.getElementById("Continuar").onclick=function(){
		menu.style.display="none";
		pausa=false;
		start();
		invisible.style.display="none";
	}
}

//función para incrementar marcador de intentos fállidos.
function incrementarMarcador(){
	int++;
	intentos.innerHTML=int;
}
function mostrarMenuDif(){//Permite mostrar el menú de dificultades
	var menuDif=document.getElementById("menuDificultad");
	document.getElementById("Dificultad").onclick=function(){
		menuDif.style.display="block";
	}
	document.getElementById("volver").onclick=function(){
 		menuDif.style.display="none";	
	}
}
function funcionalidadGeneral(){//Permite arrancar los métodos para que muchas funciones funcionen.
	reiniciar();
	pausa_continuar();
	mostrarMenuDif();
	dificultades();
	apretarAlien();
	salirPagina();
}
function dificultades(){//Permite elegir las dificultades y cambia de color la elegida.
	/*var facil=document.getElementById("Facil");
	var normal=document.getElementById("Normal");
	var dificil=document.getElementById("Dificil");
	facil.style.backgroundColor="#120229";
	dificil.onclick=function(){
		//dificultad=1;
		dificil.style.backgroundColor="#120229";
		normal.style.backgroundColor="#020140";
		facil.style.backgroundColor="#020140";
	}
	normal.onclick=function(){
		//dificultad=3;
		normal.style.backgroundColor="#120229";
		dificil.style.backgroundColor="#020140";
		facil.style.backgroundColor="#020140";
	}
	facil.onclick=function(){
		//dificultad=5;
		facil.style.backgroundColor="#120229";
		normal.style.backgroundColor="#020140";
		dificil.style.backgroundColor="#020140";
	}*/
}

function apretarAlien(){/*Permite apretar el alien para acelerar
                        la nave en la versión móvil(en la de escritorio el alien esta tapado con una capa invisible)*/
	var click=1;
	document.getElementById("alien").onclick=function(){
		click++;	
		if(click%2==0){
			motorOn();		
		}	
		else{
			motorOff();	
		}
	}
}

function mostrarMensajeExplosion(){
	document.getElementById("pantallaDerrota").style.display="block";
}
function mostrarMensajeAterrizaje(){
  	document.getElementById("pantallaVictoria").style.display="block";
}
function esconder(){
	document.getElementById("pantallaDerrota").style.display="none";
	document.getElementById("pantallaVictoria").style.display="none";
}
function vImpactos(){
	velImpacto=v;
	vImpacto.innerHTML=velImpacto.toFixed(2);
	velImpacto2=v;
	vImpacto2.innerHTML=velImpacto2.toFixed(2);
}

function salirPagina(){
	var con;
	document.getElementById("About").onclick=function(){
	    con=confirm("Estas a punto de salir de la página, ¿seguro que quieres salir?");
		if(con==true){
        location.replace("About.html")
		}
	}
	document.getElementById("Instrucciones").onclick=function(){
		con=confirm("Estás a punto de salir de la página. ¿Seguro que quieres salir?");
		if(con==true){
        location.replace("Instrucciones.html")
		}
	}

}

$(document).ready(function () {
    var emess="Error desconocido";
    $.ajax({
        type:"GET",
        url: "GetDatos",
        dataType:"json",
        success: function(u){
            dificultad=u.dificultad;
            alert("La dificultat vigent és de "+dificultad);
        },
        error: function(e){
            if (e["responseJSON"]===undefined) alert(emess);
            else alert(e["responseJSON"]["error"]);
        }
    });

    $("#Facil").click(function () {
        var url="GetDatos"; //doPost->SaveFile
        $.ajax({
            method: "POST",
            url: url,
            dataType:"json",
            data: {dificultad:5},
            success: function (rsp) {
                alert(rsp["mess"]);
            },
            error: function (e) {
                if (e["responseJSON"] === undefined)
                    alert(emess);
                else
                    alert(e["responseJSON"]["error"]);
            }
        });
    });

    $("#Normal").click(function () {
        var url="GetDatos"; //doPost->SaveFile
        $.ajax({
            method: "POST",
            url: url,
            dataType:"json",
            data: {dificultad:3},
            success: function (rsp) {
                alert(rsp["mess"]);
            },
            error: function (e) {
                if (e["responseJSON"] === undefined)
                    alert(emess);
                else
                    alert(e["responseJSON"]["error"]);
            }
        });
    });

    $("#Dificil").click(function () {
        var url="GetDatos"; //doPost->SaveFile
        $.ajax({
            method: "POST",
            url: url,
            dataType:"json",
            data: {dificultad:1},
            success: function (rsp) {
                alert(rsp["mess"]);
            },
            error: function (e) {
                if (e["responseJSON"] === undefined)
                    alert(emess);
                else
                    alert(e["responseJSON"]["error"]);
            }
        });
    });
 });