'use strict';

let productos = [];

let eliminados = [];

var agregado = 0;

let alertPlaceholder = document.getElementById('alerts');

const btnGuardar = document.getElementById('btnGuardar');

const btnLimpiar = document.getElementById('btnLimpiar');

const isNumeric = (valor) => {

    //if(typeof valor === 'number')
    if( !isNaN(valor) )

        return true;

    return false;

}

const checaCarga = (elemento) => {

    let agregar = true;

    //console.log(btnGuardar);

    let elemid = elemento.id;

    let elemval = elemento.value;

    console.log(`El ID del elemento es ${elemid} y su valor es ${elemval}`);

    if(elemid == 'codigo')

        llenaInputs(elemval);

    if(elemval === '')

        agregar = false;

    console.log(`Agregar es ${agregar}`);

    if(agregar === true)

        btnGuardar.disabled = false;

}

const checaDato = (valor,elemento = null) => {

    if(elemento === 'descripcion' && isNumeric(valor) !== true)

        return true;

    else if(isNumeric(valor) === true)

        return true;

    return false;

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
    
            importe: (cantidad * punit)
    
        }
    
        productos.push(producto);

    }

    localStorage.setItem('productos',JSON.stringify(productos));

    vaciaInputs();

    alert(`Producto ${descripcion} con código ${codigo} ha sido ${statusProducto}`, alertProducto);

}

const llenaInputs = (codigo) => {

    const existe = existeProducto(codigo);

    if(existe) {

        document.getElementById('descripcion').value = existe.descripcion;

        document.getElementById('cantidad').value = existe.cantidad;

        document.getElementById('punit').value = existe.punit;

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
    
    /*
        document.getElementById('codigo').focus();

        document.getElementById('codigo').value = codigo;

        document.getElementById('codigo').onchange();

    */
    
    if(!codigo) {

        alert('No ha seleccionado un producto','danger');

        return false;

    }

    const thisProducto = existeProducto(codigo);

    if(thisProducto) {

        alert(`<div class="row"><div class="col-6"><p class="text-primary">El producto selecionado es<br>Código: ${thisProducto.codigo}<br>Descripción: ${thisProducto.descripcion}<br>Cantidad: ${thisProducto.cantidad}<br>Precio Unitario: ${thisProducto.punit}</p></div><div class="col-6"><p class="text-danger">¿Está seguro que desea eliminar el producto?</p><p><button class="btn btn-md btn-danger" value="${codigo}" onClick="borrarDatos(${codigo})" data-bs-dismiss="alert">Sí</button><span class="vr"></span><button class="btn btn-md btn-dark" data-bs-dismiss="alert">No</button></p></div></div>`,"warning", 0);

    }

}

const borrarDatos = (codigo) => {

    if(localStorage.getItem('productos'))

        productos = JSON.parse(localStorage.getItem('productos'));

    productos.forEach((producto,index) => {

        if(producto.codigo == codigo) {

            console.log(`Index del producto es ${index}`);

            alert(`El producto <strong>${producto.descripcion}</strong> ha sido descartado`,'primary');

            guardarEliminados(producto);

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

    if(localStorage.getItem('productos'))

        productos = JSON.parse( localStorage.getItem('productos') );

    console.log(`Productos:`);

    console.log(productos);

    if(productos.length == 0) {

        btnLimpiar.disabled = true;

        tablaProductos.innerHTML='';

        tablaProductos.innerHTML += `<ul class="list-group list-group-horizontal"><li class="list-group-item col-12">No se han agregado productos</li></ul>`;

        return false;

    }

    btnLimpiar.disabled = false;

    tablaProductos.innerHTML='';

    agregado = 1;

    productos.forEach((producto) => {

        tablaProductos.innerHTML += `<ul class="list-group list-group-horizontal"><li class="list-group-item col-2">${producto.codigo}</li>
        <li class="list-group-item col-4">${producto.descripcion}</li>
        <li class="list-group-item col-2">${producto.cantidad}</li>
        <li class="list-group-item col-1">${producto.punit}</li>
        <li class="list-group-item col-1">${producto.importe}</li><li class="list-group-item col-2"><div class="input-group justify-content-center"><button type="button" class="btn btn-sm btn-outline-primary btnEditar" value="${producto.codigo}" onclick="editarDatos(${producto.codigo})"><span class="material-symbols-outlined">edit</span></button><span class="vr"></span><button type="button" class="btn btn-sm btn-outline-danger bntBorrar" value="${producto.codigo}" onclick="confirmaBorrarDatos(${producto.codigo})"><span class="material-symbols-outlined">cancel</span></button></div></li></ul>`;

    });

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

        alert('Error en los datos ingresados, revise la información', 'danger');

        return false;

    }

    guardarDatos(codigo,descripcion,cantidad,punit);

    mostrarProductos( JSON.parse( localStorage.getItem('productos') ) );

});

btnLimpiar.addEventListener('click', () => {

    console.log(`Eliminando la data de Local Storage`);

    localStorage.removeItem('productos');

    productos = [];

    localStorage.removeItem('eliminados');

    eliminados = [];

    alert('<p class="fw-bolder text-primary">Toda la información ha sido eliminada</p>','success');

    setTimeout(function() {

        console.log(`Iniciando mostrar productos y eliminados`);

        mostrarEliminados();

        mostrarProductos();

    },500);

});

mostrarProductos();

mostrarEliminados();