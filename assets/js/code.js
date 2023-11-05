'use strict'; //Mejores prácticas de codificación en Javascript, si algo en el código no está correctamente declarado se reciben errores en la consola.

let productos = []; //arreglo para guardar la lista de productos agregados

let eliminados = []; //arreglo para guardar la lista de productos eliminados (EN DESUSO)

let alertPlaceholder = document.getElementById('alerts'); //Usado para mostrar los mensajes y alertas

const btnGuardar = document.getElementById('btnGuardar'); // Button guardar datos

const btnLimpiar = document.getElementById('btnLimpiar'); // Button limpiar inputs

/* Funcion para revisar que el dato del input es correcto */
const isNumeric = (valor) => {

    if( isNaN(valor) ) // Si el valor no es numérico se retorna false

        return false;

    return true;

}

/* Funcion que revisa que los inputs contengan valores*/
const checaCarga = (elemento) => {

    let agregar = true;

    let elemid = elemento.id;

    let elemval = elemento.value;

    console.log(`El ID del elemento es ${elemid} y su valor es ${elemval}`);

    if(elemid == 'codigo') //Se busca el código en la lista y si existe en el local storage se llenan los inputs

        llenaInputs(elemval);

    if(elemid == 'descripcion') // Como descripcion debe ser alfanumérico se debe revisar de forma específica

        agregar = checaDato(elemval,elemid);

    if(elemval === '') // Para cualquier otro input vacio se retorna false

        agregar = false;

    console.log(`Agregar es ${agregar}`);

    if(agregar === true) //Si agregar es true se habilita el button para agregar el producto al local storage

        btnGuardar.disabled = false;

}

/* Funcion para revisar el tipo de dato que contiene cada input*/
const checaDato = (valor,elemento = null) => {

    console.log(`este dato ${valor} es a number? ${isNumeric(valor)}`);

    if(isNumeric(valor) === true) { //Se revisa si el valor es numérico

        if(elemento === 'descripcion') // En caso que sea numérico y sea el input descripcion (debe ser alfanumérico) se retorna false

            return false;

    }

    return isNumeric(valor); // Si la condición anterior no aplica, se retorna el valor de la funcion

}

/* Funcion en desuso, consiste en guardar en otra key de local storage, la lista de productos eliminados */
const guardarEliminados = (eliminado) => {

    if(localStorage.getItem('eliminados'))  //Se verifica que exista la clave

        eliminados = JSON.parse(localStorage.getItem('eliminados')); // Se obtiene la lista de productos eliminados
    
    const productoEliminado = { // Se crea el objeto del producto eliminado

        codigo: eliminado.codigo,

        descripcion:eliminado.descripcion,

        cantidad: eliminado.cantidad,

        punit: eliminado.punit,

        importe: (eliminado.cantidad * eliminado.punit)

    }

    eliminados.push(productoEliminado); // Se agrega al array el producto

    localStorage.setItem('eliminados',JSON.stringify(eliminados));  // Se actualiza local storage

    mostrarEliminados();  //Se muestra la lista de productos eliminados

}

/* Function que agrega a Local Storage el nuevo producto */
const guardarDatos = (codigo,descripcion,cantidad,punit) => {

    if(localStorage.getItem('productos')) // Se revisa que exista la lista en Local Storage

        productos = JSON.parse(localStorage.getItem('productos')); // Se obtiene la lista actual de productos
    
    const actualizado = productos.find( (producto) => { // Primero se busca el objeto para proceder a actualizarlo

        console.log(`Código en map es ${codigo}`)

        return producto.codigo == codigo;

    })

    console.log(`Actualizado es ${JSON.stringify(actualizado)}`);

    let statusProducto = 'guardado'; // se inicializa el status como guardado

    let alertProducto = 'success'; // Se inicializa el tipo de mensaje a mostrar

    if(actualizado) { // Si el producto existe, se procede a actualizar la data

        statusProducto = 'actualizado';

        alertProducto = 'primary';

        actualizado.descripcion = descripcion;

        actualizado.cantidad = cantidad;

        actualizado.punit = punit;

        actualizado.importe = (cantidad * punit);

    } else { // Si el producto no existe, se agrega

        const producto = { // Se crea el objeto del producto

            codigo: codigo,
    
            descripcion:descripcion,
    
            cantidad: cantidad,
    
            punit: punit,
    
            importe: (cantidad * punit),

            status: 'agregado'
    
        }
    
        productos.push(producto); // Se agrega el objeto al arreglo de productos

    }

    localStorage.setItem('productos',JSON.stringify(productos)); // se actualiza la lista de productos en local storage

    vaciaInputs(); // Se limpian los inputs

    //alert(`Producto ${descripcion} con código ${codigo} ha sido ${statusProducto}`, alertProducto);
    showModal(alertProducto,`Producto ${descripcion} con código ${codigo} ha sido ${statusProducto}`); //Se muestra mensaje mediante un modal
    

}

/* Function que realiza el llenado de los inputs cuando el producto ya existe */
const llenaInputs = (codigo) => {

    const producto = existeProducto(codigo); //Revisa si el producto existe

    if(producto) {

        document.getElementById('descripcion').value = producto.descripcion;

        document.getElementById('cantidad').value = producto.cantidad;

        document.getElementById('punit').value = producto.punit;

        //Se crea alert para notificar al usuario
        alert(`El producto existe y será actualizado al pulsar el button <span class="material-symbols-outlined">add_circle</span>`,'info'); 

    }

}

/* Funcion que limpia los inputs para agregar otro producto */
const vaciaInputs = () => {

    const inputs = document.querySelectorAll('.input'); // Se obtiene la lista de inputs

    inputs.forEach((input) => { //Se recorre la lista de inputs

        input.value=''; // El valor queda vacío

    });

    btnGuardar.disabled = true; // Se deshabilita el button Agregar

    document.getElementById('codigo').focus(); // Se envía el cursor al input código

}

/* Funcion que permite modificar los datos de un producto existente */
const editarDatos = (codigo) => {
    
    document.getElementById('codigo').focus(); // Al pulsar el button Editar en la tabla, se envía el cursor al input

    document.getElementById('codigo').value = codigo; // Se asigna el código que se recibe desde la función al ejecutarse

    document.getElementById('codigo').onchange(); // Se ejecuta el evenot onchange que al producirse, se ejecuta la funcion checaCarga() que recibe el objeto completo

}

/* Funcion que muestra un mensaje que pide confirmar cuando se descarta un producto*/
const confirmaDescartarProducto = (codigo) => {

    const thisProducto = existeProducto(codigo); //Se busca el producto usando el código como dato de búsqueda

    console.log(`El producto recuperado es ${JSON.stringify(thisProducto)}`);

    if(thisProducto !== null) // Se muestra mensaje para confirmar

        showModal('warning',`<div class="row"><div class="col-6"><p class="text-primary">El producto selecionado es<br>Código: ${thisProducto.codigo}<br>Descripción: ${thisProducto.descripcion}<br>Cantidad: ${thisProducto.cantidad}<br>Precio Unitario: ${thisProducto.punit}</p></div><div class="col-6"><p class="text-danger">¿Está seguro que desea descartar el producto?</p><p><button class="btn btn-md btn-danger" value="${codigo}" onClick="descartarDatos(${codigo})" data-bs-dismiss="offcanvas">Sí</button><span class="vr"></span><button class="btn btn-md btn-dark" data-bs-dismiss="offcanvas">No</button></p></div></div>`,0);

    else

        showModal('danger','El producto no existe');

}

/* Funcion para cambiar status a descartado y mostrar el producto en la tabla para tal fin */
const descartarDatos = (codigo) => {

    if(localStorage.getItem('productos')) // Se revisa que la lista exista en Local Storage

        productos = JSON.parse(localStorage.getItem('productos')); //La lista se guarda en el arreglo

    const thisProducto = existeProducto(codigo); //Se busca el producto 

    thisProducto.status = 'descartado'; // se actualiza el status del producto

    localStorage.setItem('productos',JSON.stringify(productos)); //Se actualiza la lista de productos en local storage

    mostrarProductos(); //Se muestran las tablas de productos

}

/* Funcion que cambia el status de un producto a agregado, pasándolo a la lista de productos */
const restaurarDatos = (codigo) => {

    if(localStorage.getItem('productos')) //Se revisa que exista la lista en local storage

        productos = JSON.parse(localStorage.getItem('productos')); // se guarda la lista en el arreglo

    const thisProducto = existeProducto(codigo); //Se busca mediante el código y se recupera el producto de la lista

    thisProducto.status = 'agregado'; //Se actualiza el status del producto

    showModal('success',`El producto <strong>${thisProducto.descripcion}</strong> ha sido agregado a la lista`); //Se muestra mensaje 

    localStorage.setItem('productos',JSON.stringify(productos)); //Se actualiza la lista en local storage

    mostrarProductos(); //Se muestran los productos según su status

}

/* Funcion que muestra un mensaje que pide confirmar el borrado */
const confirmaBorrarDatos = (codigo) => {
    
    if(!codigo) { //Si se ejecuta la función sin enviar el parámetro, se retorna un mensaje de error

        alert('No ha seleccionado un producto','danger');

        return false;

    }

    const thisProducto = existeProducto(codigo); // Se revisa si existe el producto

    if(thisProducto) // Si existe se muestra el mensaje mediante un modal

        showModal('danger',`<div class="row"><div class="col-6"><p class="text-primary">El producto selecionado es<br>Código: ${thisProducto.codigo}<br>Descripción: ${thisProducto.descripcion}<br>Cantidad: ${thisProducto.cantidad}<br>Precio Unitario: ${thisProducto.punit}</p></div><div class="col-6"><p class="text-danger">¿Está seguro que desea eliminar el producto?</p><p><button class="btn btn-md btn-danger" value="${codigo}" onClick="borrarDatos(${codigo})" data-bs-dismiss="offcanvas">Sí</button><span class="vr"></span><button class="btn btn-md btn-dark" data-bs-dismiss="offcanvas">No</button></p></div></div>`,0);

}

/* Funcion que elimina los datos de un producto */
const borrarDatos = (codigo) => {

    if(localStorage.getItem('productos')) // Se revisa que la lista exista en local storage

        productos = JSON.parse(localStorage.getItem('productos')); //Se guarda la lista en el arreglo

    productos.forEach((producto,index) => { //Se recorre el array para obtener el index del producto a eliminar

        if(producto.codigo == codigo) { //Si el codigo coincide con el recuperado en el loop se procede a eliminarlo

            console.log(`Index del producto es ${index}`);

            //alert(`El producto <strong>${producto.descripcion}</strong> ha sido eliminado`,'primary');

            //guardarEliminados(producto); //En desuso, se usa status

            productos.splice(index,1); // Se elimina el producto del index recuperado

            showModal('primary',`El producto <strong>${producto.descripcion}</strong> ha sido eliminado`); //Mensaje

        }

    });

    localStorage.setItem('productos',JSON.stringify(productos)); //Se actualiza la lista en local storage

    mostrarProductos(); //Se muestran los productos según su status

}

/*const agregarListeners = () => {

    var btnEditar = document.getElementsByClassName('btnEditar');

    var btnBorrar = document.getElementsByClassName('btnBorrar');

    btnEditar.addEventListener('click', () => {

        let codigo = btnEditar.value;
    
        if(codigo) {
    
            //llenaInputs(codigo);

            document.getElementById('codigo').focus();

            document.getElementById('codigo').value = codigo;

            document.getElementById('codigo').onchange();

            //document.getElementById('descripcion').focus();

        }
    
    });

}
*/

/* Funcion para crear los divs alerts y mostrarlos según sea requerido */
const alert = (message, type, timer=1) => {
    
    const wrapper = document.createElement('div'); //Se crea un div para mostrar el mensaje

    wrapper.innerHTML = [ //html que crea el div alert agregando el mensaje y el tipo de alert a mostrar
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join(''); 

    alertPlaceholder.append(wrapper); //Se agrega el div al div principal declarado al principio

    if( timer > 0 ) { //Borra el contenido del div después de tres segundos y medio

        setTimeout(function() {

            alertPlaceholder.innerHTML='';

        }, 3500)

    }

}

/* Funcion que muestra los productos eliminados (descartados) (EN DESUSO) */
const mostrarEliminados = () => {

    if(localStorage.getItem('eliminados'))

        eliminados = JSON.parse( localStorage.getItem('eliminados') );

    const tablaEliminados = document.getElementById('tablaEliminados');

    tablaEliminados.innerHTML='';

    if(eliminados.length == 0 ) {

        tablaEliminados.innerHTML += `<ul class="list-group list-group-horizontal"><li class="list-group-item col-12">No se han descartado productos</li>`;

        return false;

    }

    eliminados.forEach((producto) => {

        tablaEliminados.innerHTML += `<ul class="list-group list-group-horizontal"><li class="list-group-item col-2">${producto.codigo}</li>
        <li class="list-group-item col-4">${producto.descripcion}</li>
        <li class="list-group-item col-2">${producto.cantidad}</li>
        <li class="list-group-item col-1">${producto.punit}</li>
        <li class="list-group-item col-1">${producto.importe}</li><li class="list-group-item col-2"><div class="input-group justify-content-center"><button type="button" class="btn btn-sm btn-outline-success btnRestaurar" value="${producto.codigo}" onclick="RestaurarDatos(${producto.codigo})"><span class="material-symbols-outlined">restore_from_trash</span></button><span class="vr"></span><button type="button" class="btn btn-sm btn-outline-danger bntBorrar" value="${producto.codigo}" onclick="eliminarDatos(${producto.codigo})"><span class="material-symbols-outlined">delete_forever</span></button></div></li></ul>`;

    });

}

/* Funcion que muestra los productos guardados en local storage según status */
const mostrarProductos = () => {

    const btnLimpiar = document.getElementById('btnLimpiar'); //Para controlar si se habilita o no el button

    const tablaProductos = document.getElementById('tablaProductos'); //Tabla de productos agregados

    const tablaEliminados = document.getElementById('tablaEliminados'); //Tabla de productos eliminados

    tablaProductos.innerHTML=''; // Se limpia la tabla productos

    tablaEliminados.innerHTML=''; // Se limpia la tabla descartados

    if(localStorage.getItem('productos')) // Se revisa que exista la lista en local storage

        productos = JSON.parse( localStorage.getItem('productos') ); //Se guarda la lista en el arreglo

    const agregados = productos.filter( (producto) => { //Lista de productos agregados

        return producto.status == 'agregado';

    });

    console.log(`Total de productos agregados (${agregados.length})`);

    const descartados = productos.filter( (producto) => { //Lista de productos descartados

        return producto.status == 'descartado';

    });

    console.log(`Total de productos descartados (${descartados.length})`);

    console.log(`Total de Productos (${productos.length}):`);

    console.log(productos);

    if(agregados.length == 0) { //Si no hay productos agregados (length es el total de productos en el arreglo), se muestra el texto No se han agregado productos
        
        console.log(`No hay productos agregados (${agregados.length})`);

        tablaProductos.innerHTML = `<ul class="list-group list-group-horizontal"><li class="list-group-item col-12">No se han agregado productos</li></ul>`;

    }

    if(descartados.length == 0) { //Si no hay productos descartados (length es el total de productos en el arreglo) se muestra el mensaje respectivo

        console.log(`No hay productos descartados (${descartados.length})`);

        tablaEliminados.innerHTML = `<ul class="list-group list-group-horizontal"><li class="list-group-item col-12">No se han descartado productos</li></ul>`;

    }

    if(productos.length == 0) { //Si no hay productos el button Limpiar se pasa a disabled 

        console.log(`No hay productos en la lista (${productos.length})`);

        btnLimpiar.disabled = true;

        return false; //La funcion retorna false para dejar de ejecutar el código

    } else {

        console.log(`Comenzando la lista`);

        btnLimpiar.disabled = false; //Al haber productos se puede limpiar la tabla, disabled es false

        productos.forEach((producto) => { //Se recorre la lista de productos

            console.log(`Status del producto: ${producto.status}`);

            if(producto.status=='agregado') { //Solo productos con status agregado

                tablaProductos.innerHTML += `<ul class="list-group list-group-horizontal"><li class="list-group-item col-2">${producto.codigo}</li>
                <li class="list-group-item col-4">${producto.descripcion}</li>
                <li class="list-group-item col-2">${producto.cantidad}</li>
                <li class="list-group-item col-1">${producto.punit}</li>
                <li class="list-group-item col-1">${producto.importe}</li><li class="list-group-item col-2"><div class="input-group justify-content-center"><button type="button" class="btn btn-sm btn-outline-primary btnEditar" value="${producto.codigo}" onclick="editarDatos(${producto.codigo})"><span class="material-symbols-outlined">edit</span></button><span class="vr"></span><button type="button" class="btn btn-sm btn-outline-warning bntBorrar" value="${producto.codigo}" onclick="confirmaDescartarProducto(${producto.codigo})"><span class="material-symbols-outlined">cancel</span></button></div></li></ul>`;

            } else if(producto.status=='descartado') { //Solo productos con status descartado

                console.log(`Agregando producto descartado ${producto.descripcion}`);

                tablaEliminados.innerHTML += `<ul class="list-group list-group-horizontal"><li class="list-group-item col-2">${producto.codigo}</li>
                <li class="list-group-item col-4">${producto.descripcion}</li>
                <li class="list-group-item col-2">${producto.cantidad}</li>
                <li class="list-group-item col-1">${producto.punit}</li>
                <li class="list-group-item col-1">${producto.importe}</li><li class="list-group-item col-2"><div class="input-group justify-content-center"><button type="button" class="btn btn-sm btn-outline-success btnRestaurar" value="${producto.codigo}" onclick="restaurarDatos(${producto.codigo})"><span class="material-symbols-outlined">restore_from_trash</span></button><span class="vr"></span><button type="button" class="btn btn-sm btn-outline-danger bntBorrar" value="${producto.codigo}" onclick="confirmaBorrarDatos(${producto.codigo})"><span class="material-symbols-outlined">delete_forever</span></button></div></li></ul>`;

            }

        });

    }    

}

/*Funcion que revisa si existe un producto basado en su código, retorna el arreglo de datos del producto */
const existeProducto = (codigo) => {

    if(localStorage.getItem('productos')) // Se revisa que la lista exista en local storage

        productos = JSON.parse(localStorage.getItem('productos')); //Se carga la lista en el arreglo

    console.log(productos);

    const existe = productos.find((producto) => { //find para buscar el código que recibe la funcion

        return producto.codigo == codigo; //retorna el arreglo de datos para el código buscado

    })

    console.log(existe);

    console.log(`producto ${codigo} existe en ${JSON.stringify(productos)} ? ${JSON.stringify(existe)}`);

    return existe; //La funcion retorna la variable que recibe el resultado de array.find()

}

/*Listenner para evento click en button guardar */
btnGuardar.addEventListener('click', () => {

    let guardar = true; //Se inicializa la variable como true porque después se evalúa para saber si se ejecuta el guardado

    let codigo = document.getElementById('codigo').value; // Se obtiene el código introducido

    console.log(`El codigo es ${codigo}`);

    guardar = checaDato(codigo); // se revisa que el código sea un valor válido

    let descripcion = document.getElementById('descripcion').value;

    console.log(`La descripción es ${descripcion}`);

    guardar = checaDato(descripcion,'descripcion'); // Se revisa que la descripción sea alfanumérica

    let cantidad = document.getElementById('cantidad').value;

    console.log(`La cantidad es ${cantidad}`);

    guardar = checaDato(cantidad); // Se revisa que la cantidad sea un valor válido

    let punit = document.getElementById('punit').value;

    console.log(`El precio unitario es ${punit}`);

    guardar = checaDato(punit); // Se revisa que el preco sea un valor válido

    if(guardar === false) { //Si en alguno de las revisiones guardar cambia a false, el proceso de guardado se cancela

        //alert('Error en los datos ingresados, revise la información', 'danger');
        showModal('danger','Error en los datos ingresados, revise la información');

        return false;

    }

    guardarDatos(codigo,descripcion,cantidad,punit); //Se ejecuta la function guardarDatos

    mostrarProductos(); // Se muestran los productos

});

/* Function que elimina la lista en local storage y vacía el arreglo */
const limpiarDatos = () => {

    localStorage.removeItem('productos'); //Se elimina la lista en local storage

    productos = []; //Se vacía el arreglo por si queda alguna lista 

    showModal('success','<p class="fw-bolder text-primary">Toda la información ha sido eliminada</p>'); //Mensaje

    setTimeout(function() {

        console.log(`Iniciando mostrar Productos`);

        mostrarProductos(); //Se ejecuta la function para actualizar el contenido de las tablas

    },500); //Espera medio segundo para ejecutarse

}

/* Listener para el button limpiar */
btnLimpiar.addEventListener('click', () => {

    //Se muestra mensaje para confirmar el proceso
    showModal('danger',`<div class="row"><div class="justify-content-center"><p class="text-danger">¿Está seguro que desea eliminar toda la lista?</p><p><button class="btn btn-md btn-danger" onClick="limpiarDatos()" data-bs-dismiss="offcanvas">Sí</button><span class="vr"></span><button class="btn btn-md btn-dark" data-bs-dismiss="offcanvas">No</button></p></div></div>`,0);

});

//Se crea el elemento para el modal
const messageModal = new bootstrap.Offcanvas('#messageModal');

//Se obtiene el ID del elemento donde se mostrarán los mensajes
const mymessageModal = document.getElementById('messageModal')

//Listener para cuando se oculta el modal
mymessageModal.addEventListener('hidden.bs.offcanvas', event => {
    console.log("Ocultando el modal");
});

//Listener para cuando se muestra el modal
mymessageModal.addEventListener('shown.bs.offcanvas', event => {
    console.log("Mostrando el modal");
});

/* 
Function que muestra el modal con los parámetros enviados 
//type = class de alert a mostrar
//message = contenido a mostrar
//timer =1 para indicar que el modal debe cerrarse de forma automática
*/
const showModal = (type,message,timer=1) => {

    const thisMessage = document.getElementById('message'); //elemento que recibirá el mensaje

    //Contenido a mostrar
    thisMessage.innerHTML = 
    + '<div class="row" id="msgInfo">'
    + ' <div class="justify-content-center">'
    + '    <div class="alert alert-' + type + '">' + message + '</div>'
    + ' </div>'
    + '</div>';

    messageModal.show(); //Se muestra el modal

    if( timer > 0 ) { //A los dos segundos se cierra el modal (realmente se hace hide)

        setTimeout(function() {

            messageModal.hide();

        }, 2000)

    }

}

mostrarProductos(); //Se ejecuta la function para mostrar las listas de productos o en su caso el mensaje correspondiente