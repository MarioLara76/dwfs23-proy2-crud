'use strict';

let productos = [];

let eliminados = [];

var agregado = 0;

var agregados = 0;

var descartados = 0;

let alertPlaceholder = document.getElementById('alerts');

const btnGuardar = document.getElementById('btnGuardar');

const btnLimpiar = document.getElementById('btnLimpiar');

const isNumeric = (valor) => {

    //if(typeof valor === 'number')
    if( isNaN(valor) )

        return false;

    return true;

}

const checaCarga = (elemento) => {

    let agregar = true;

    //console.log(btnGuardar);

    let elemid = elemento.id;

    let elemval = elemento.value;

    console.log(`El ID del elemento es ${elemid} y su valor es ${elemval}`);

    if(elemid == 'codigo')

        llenaInputs(elemval);

    if(elemid == 'descripcion')

        agregar = checaDato(elemval,elemid);

    if(elemval === '')

        agregar = false;

    console.log(`Agregar es ${agregar}`);

    if(agregar === true)

        btnGuardar.disabled = false;

}

const checaDato = (valor,elemento = null) => {

    console.log(`este dato ${valor} es a number? ${isNumeric(valor)}`);

    if(isNumeric(valor) === true) {

        if(elemento === 'descripcion')

            return false;

    }

    return isNumeric(valor);

    /*if(elemento === 'descripcion' && isNumeric(valor) !== true) 

        return true;

    else if(isNumeric(valor) === true)

        return true;

    return false;*/

}

const guardarEliminados = (eliminado) => {

    if(localStorage.getItem('eliminados'))

        eliminados = JSON.parse(localStorage.getItem('eliminados'));
    
    const productoEliminado = {

        codigo: eliminado.codigo,

        descripcion:eliminado.descripcion,

        cantidad: eliminado.cantidad,

        punit: eliminado.punit,

        importe: (eliminado.cantidad * eliminado.punit)

    }

    eliminados.push(productoEliminado);

    localStorage.setItem('eliminados',JSON.stringify(eliminados));

    mostrarEliminados();

}

const guardarDatos = (codigo,descripcion,cantidad,punit) => {

    if(localStorage.getItem('productos'))

        productos = JSON.parse(localStorage.getItem('productos'));
    
    const actualizado = productos.find( (producto) => {

        console.log(`Código en map es ${codigo}`)

        return producto.codigo == codigo;

    })

    console.log(`Actualizado es ${JSON.stringify(actualizado)}`);

    let statusProducto = 'guardado';

    let alertProducto = 'success';

    if(actualizado) {

        statusProducto = 'actualizado';

        alertProducto = 'primary';

        actualizado.descripcion = descripcion;

        actualizado.cantidad = cantidad;

        actualizado.punit = punit;

        actualizado.importe = (cantidad * punit);

    } else {

        const producto = {

            codigo: codigo,
    
            descripcion:descripcion,
    
            cantidad: cantidad,
    
            punit: punit,
    
            importe: (cantidad * punit),

            status: 'agregado'
    
        }
    
        productos.push(producto);

    }

    localStorage.setItem('productos',JSON.stringify(productos));

    vaciaInputs();

    //alert(`Producto ${descripcion} con código ${codigo} ha sido ${statusProducto}`, alertProducto);
    showModal(alertProducto,`Producto ${descripcion} con código ${codigo} ha sido ${statusProducto}`);
    

}

const llenaInputs = (codigo) => {

    const existe = existeProducto(codigo);

    if(existe) {

        document.getElementById('descripcion').value = existe.descripcion;

        document.getElementById('cantidad').value = existe.cantidad;

        document.getElementById('punit').value = existe.punit;

        alert(`El producto existe y será actualizado al pulsar el button <span class="material-symbols-outlined">add_circle</span>`,'info');

    }

}

const vaciaInputs = () => {

    //const inputs = document.getElementsByClassName('input');
    const inputs = document.querySelectorAll('.input');

    //console.log(inputs);

    inputs.forEach((input) => {

        input.value='';

    });

    btnGuardar.disabled = true;

    document.getElementById('codigo').focus();

}

const editarDatos = (codigo) => {
    
    document.getElementById('codigo').focus();

    document.getElementById('codigo').value = codigo;

    document.getElementById('codigo').onchange();

}

const confirmaBorrarDatos = (codigo) => {
    
    if(!codigo) {

        alert('No ha seleccionado un producto','danger');

        return false;

    }

    const thisProducto = existeProducto(codigo);

    if(thisProducto) {

        //alert(`<div class="row"><div class="col-6"><p class="text-primary">El producto selecionado es<br>Código: ${thisProducto.codigo}<br>Descripción: ${thisProducto.descripcion}<br>Cantidad: ${thisProducto.cantidad}<br>Precio Unitario: ${thisProducto.punit}</p></div><div class="col-6"><p class="text-danger">¿Está seguro que desea eliminar el producto?</p><p><button class="btn btn-md btn-danger" value="${codigo}" onClick="borrarDatos(${codigo})" data-bs-dismiss="alert">Sí</button><span class="vr"></span><button class="btn btn-md btn-dark" data-bs-dismiss="alert">No</button></p></div></div>`,"warning", 0);

        showModal('danger',`<div class="row"><div class="col-6"><p class="text-primary">El producto selecionado es<br>Código: ${thisProducto.codigo}<br>Descripción: ${thisProducto.descripcion}<br>Cantidad: ${thisProducto.cantidad}<br>Precio Unitario: ${thisProducto.punit}</p></div><div class="col-6"><p class="text-danger">¿Está seguro que desea eliminar el producto?</p><p><button class="btn btn-md btn-danger" value="${codigo}" onClick="borrarDatos(${codigo})" data-bs-dismiss="offcanvas">Sí</button><span class="vr"></span><button class="btn btn-md btn-dark" data-bs-dismiss="offcanvas">No</button></p></div></div>`,0);

    }

}

const confirmaDescartarProducto = (codigo) => {

    if(localStorage.getItem('productos'))

        productos = JSON.parse(localStorage.getItem('productos'));

    const thisProducto = productos.find((producto) => {

        return producto.codigo == codigo;

    });

    console.log(`El producto recuperado es ${JSON.stringify(thisProducto)}`);

    if(thisProducto !== null)

        showModal('warning',`<div class="row"><div class="col-6"><p class="text-primary">El producto selecionado es<br>Código: ${thisProducto.codigo}<br>Descripción: ${thisProducto.descripcion}<br>Cantidad: ${thisProducto.cantidad}<br>Precio Unitario: ${thisProducto.punit}</p></div><div class="col-6"><p class="text-danger">¿Está seguro que desea descartar el producto?</p><p><button class="btn btn-md btn-danger" value="${codigo}" onClick="descartarDatos(${codigo})" data-bs-dismiss="offcanvas">Sí</button><span class="vr"></span><button class="btn btn-md btn-dark" data-bs-dismiss="offcanvas">No</button></p></div></div>`,0);

    else

        showModal('danger','El producto no existe');

}

const descartarDatos = (codigo) => {

    if(localStorage.getItem('productos'))

        productos = JSON.parse(localStorage.getItem('productos'));

    productos.forEach((producto,index) => {

        if(producto.codigo == codigo) {

            console.log(`Index del producto es ${index}`);

            //alert(`El producto <strong>${producto.descripcion}</strong> ha sido descartado`,'warning');
            showModal('warning',`El producto <strong>${producto.descripcion}</strong> ha sido descartado`);

            producto.status = 'descartado';

        }

    });

    localStorage.setItem('productos',JSON.stringify(productos));

    mostrarProductos();

}

const restaurarDatos = (codigo) => {

    if(localStorage.getItem('productos'))

        productos = JSON.parse(localStorage.getItem('productos'));

    productos.forEach((producto,index) => {

        if(producto.codigo == codigo) {

            console.log(`Index del producto es ${index}`);

            alert(`El producto <strong>${producto.descripcion}</strong> ha sido agregado a la lista`,'success');

            producto.status = 'agregado';

        }

    });

    localStorage.setItem('productos',JSON.stringify(productos));

    mostrarProductos();

}

const borrarDatos = (codigo) => {

    if(localStorage.getItem('productos'))

        productos = JSON.parse(localStorage.getItem('productos'));

    productos.forEach((producto,index) => {

        if(producto.codigo == codigo) {

            console.log(`Index del producto es ${index}`);

            alert(`El producto <strong>${producto.descripcion}</strong> ha sido eliminado`,'primary');

            //guardarEliminados(producto);

            productos.splice(index,1);

        }

    });

    localStorage.setItem('productos',JSON.stringify(productos));

    mostrarProductos();

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

const alert = (message, type, timer=1) => {
    
    const wrapper = document.createElement('div')

    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);

    if( timer > 0 ) {

        setTimeout(function() {

            alertPlaceholder.innerHTML='';

        }, 3500)

    }

}

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

const mostrarProductos = () => {

    const btnLimpiar = document.getElementById('btnLimpiar');

    const tablaProductos = document.getElementById('tablaProductos');

    const tablaEliminados = document.getElementById('tablaEliminados');

    tablaProductos.innerHTML='';

    tablaEliminados.innerHTML='';

    if(localStorage.getItem('productos'))

        productos = JSON.parse( localStorage.getItem('productos') );

    const agregados = productos.filter( (producto) => {

        return producto.status == 'agregado';

    });

    console.log(`productos agregados (${agregados.length})`);

    const descartados = productos.filter( (producto) => {

        return producto.status == 'descartado';

    });

    console.log(`productos descartados (${descartados.length})`);

    console.log(`Productos (${productos.length}):`);

    console.log(productos);

    if(agregados.length == 0) {
        
        console.log(`No hay productos agregados (${agregados.length})`);

        tablaProductos.innerHTML = `<ul class="list-group list-group-horizontal"><li class="list-group-item col-12">No se han agregado productos</li></ul>`;

    }

    if(descartados.length == 0) {

        console.log(`No hay productos descartados (${descartados.length})`);

        tablaEliminados.innerHTML = `<ul class="list-group list-group-horizontal"><li class="list-group-item col-12">No se han descartado productos</li></ul>`;

    }

    if(productos.length == 0) {

        console.log(`No hay productos en la lista (${productos.length})`);

        btnLimpiar.disabled = true;

        return false;

    } else {

        console.log(`Comenzando la lista`);

        btnLimpiar.disabled = false;

        productos.forEach((producto) => {

            console.log(`Status del producto: ${producto.status}`);

            if(producto.status=='agregado') {

                tablaProductos.innerHTML += `<ul class="list-group list-group-horizontal"><li class="list-group-item col-2">${producto.codigo}</li>
                <li class="list-group-item col-4">${producto.descripcion}</li>
                <li class="list-group-item col-2">${producto.cantidad}</li>
                <li class="list-group-item col-1">${producto.punit}</li>
                <li class="list-group-item col-1">${producto.importe}</li><li class="list-group-item col-2"><div class="input-group justify-content-center"><button type="button" class="btn btn-sm btn-outline-primary btnEditar" value="${producto.codigo}" onclick="editarDatos(${producto.codigo})"><span class="material-symbols-outlined">edit</span></button><span class="vr"></span><button type="button" class="btn btn-sm btn-outline-warning bntBorrar" value="${producto.codigo}" onclick="confirmaDescartarProducto(${producto.codigo})"><span class="material-symbols-outlined">cancel</span></button></div></li></ul>`;

            } else if(producto.status=='descartado') {

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

const existeProducto = (codigo) => {

    if(localStorage.getItem('productos'))

        productos = JSON.parse(localStorage.getItem('productos'));

    console.log(productos);

    const existe = productos.find((producto) => {

        return producto.codigo == codigo;

    })

    console.log(existe);

    console.log(`producto ${codigo} existe en ${JSON.stringify(productos)} ? ${JSON.stringify(existe)}`);

    return existe;

}

btnGuardar.addEventListener('click', () => {

    let guardar = true;

    let codigo = document.getElementById('codigo').value;

    console.log(`El codigo es ${codigo}`);

    guardar = checaDato(codigo);

    let existe = existeProducto(codigo);

    if(existe === codigo) {

        console.log("Este producto existe en el listado, debe ser actualizado");

        return false;

    }

    let descripcion = document.getElementById('descripcion').value;

    console.log(`La descripción es ${descripcion}`);

    guardar = checaDato(descripcion,'descripcion');

    let cantidad = document.getElementById('cantidad').value;

    console.log(`La cantidad es ${cantidad}`);

    guardar = checaDato(cantidad);

    let punit = document.getElementById('punit').value;

    console.log(`El precio unitario es ${punit}`);

    guardar = checaDato(punit);

    if(guardar === false) {

        //alert('Error en los datos ingresados, revise la información', 'danger');
        showModal('danger','Error en los datos ingresados, revise la información');

        return false;

    }

    guardarDatos(codigo,descripcion,cantidad,punit);

    mostrarProductos( JSON.parse( localStorage.getItem('productos') ) );

});

const limpiarDatos = () => {

    localStorage.removeItem('productos');

    productos = [];

    showModal('success','<p class="fw-bolder text-primary">Toda la información ha sido eliminada</p>');

    setTimeout(function() {

        console.log(`Iniciando mostrar Productos`);

        mostrarProductos();

    },500);

}

btnLimpiar.addEventListener('click', () => {

    showModal('danger',`<div class="row"><div class="justify-content-center"><p class="text-danger">¿Está seguro que desea eliminar toda la lista?</p><p><button class="btn btn-md btn-danger" onClick="limpiarDatos()" data-bs-dismiss="offcanvas">Sí</button><span class="vr"></span><button class="btn btn-md btn-dark" data-bs-dismiss="offcanvas">No</button></p></div></div>`,0);

});

const messageModal = new bootstrap.Offcanvas('#messageModal');

const mymessageModal = document.getElementById('messageModal')

mymessageModal.addEventListener('hidden.bs.offcanvas', event => {
    console.log("Ocultando el modal");
});

mymessageModal.addEventListener('shown.bs.offcanvas', event => {
    console.log("Mostrando el modal");
});

const showModal = (type,message,timer=1) => {

    const thisMessage = document.getElementById('message');

    let txtAction = '';
    
    if(txtAction !== '')
    
        txtAction = '<p class="fw-bolder h3">' + action + '</p>';

    let buttons = '';

    if(type === 'confirm') {

        type='warning';

        buttons = '<div class="d-grid gap-2 d-md-flex justify-content-md-end">'
        + '<button type="button" id="btnYes" name="btnYes" data-action="' + action + '" data-id="' + codigo + '" data-bs-dismiss="offcanvas" class="btn btn-outline-dark btnyes">Sí</button>'
        + '<button type="button" id="btnNo" name="btnNo" data-bs-dismiss="offcanvas" class="btn btn-outline-secondary">No</button>'
        + '</div>';

    }

    thisMessage.innerHTML = txtAction
    + '<div class="row" id="msgInfo">'
    + '<div class="justify-content-center">'
    + '    <div class="alert alert-' + type + '">' + message + '</div>'
    + '</div>'
    + ( (buttons!=='') ? buttons : '')
    + '</div>';

    messageModal.show();

    if( timer > 0 ) {

        setTimeout(function() {

            messageModal.hide();

        }, 2000)

    }

}

mostrarProductos();

//mostrarEliminados();