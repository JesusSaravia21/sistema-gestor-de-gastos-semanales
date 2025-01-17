//Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos

eventListeners();

function eventListeners(){

    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}



//Classes

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total+ gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
        console.log(this.restante);
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }

}

class UI{
    
    insertarPresupuesto(cantidad){

        const {presupuesto, restante} = cantidad;

        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }

    imprimirAlerta(mensaje, tipo){

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() =>{

            divMensaje.remove();

        }, 3000);

    }

    mostrarGastos(gastos){

        this.limpiarHTML(); //Elimina el HTML previo
        //Iterar sobre el arreglo gastos
        gastos.forEach(gasto =>{
            
            const {cantidad, nombre, id} = gasto;

            //Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;


            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`;

            //Agregar boton para borrar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;';
            btnBorrar.onclick = ()=>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar al HTML
            
            gastoListado.appendChild(nuevoGasto);


        })
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }


    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    comprobarPresupuesto(presupuestObj){
        const {presupuesto, restante} = presupuestObj;
        const restanteDiv = document.querySelector('.restante');
        //Comprobar el 25% (Si ya se gasto mas del 75%)
        if((presupuesto / 4) > restante){
           restanteDiv.classList.remove('alert-success', 'alert-warning');
           restanteDiv.classList.add('alert-danger');
        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }
        //Si el restante es igual o menor a 0
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;

        }
    }
}

//Instanciar
const ui = new UI();

let presupuesto;


//Funciones

function preguntarPresupuesto() {

    const presupuestoUsuario = prompt('Cual es tu presupuesto?');

    //console.log(Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario<=0){
        window.location.reload();
    }

    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}


//Agregar gasto

function agregarGasto(e){
    e.preventDefault();

    //Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

   const gasto = {nombre, cantidad, id: Date.now()};

   presupuesto.nuevoGasto(gasto);

   //Mensaje de exito
   ui.imprimirAlerta('Gasto agregado correctamente');

   //Imprimir los gastos en el HTML:
   const {gastos, restante} = presupuesto;
   ui.mostrarGastos(gastos);
   ui.actualizarRestante(restante);
   ui.comprobarPresupuesto(presupuesto);

   //Resetear formulario
   formulario.reset();

}

function eliminarGasto(id){
    //Elimina los gastos del objeto
    presupuesto.eliminarGasto(id);


    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}







