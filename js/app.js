//*VARIABLES SELECCIONADAS*//



const contenedor = document.querySelector('#contenedor');
const carritoContenedor = document.querySelector('#carritoContenedor');
const agregarCarrito = document.getElementsByClassName('agregarCarrito');
const vaciarCarrito = document.querySelector("#vaciarCarrito");
const precioTotal = document.querySelector("#precioTotal");
const procesarCompra = document.querySelector("#procesarCompra");
const activarFuncion = document.querySelector("#activarFuncion");
const totalProceso = document.querySelector("#totalProceso");
const formulario = document.querySelector("#procesar-pago");

/*variables donde voy a guardar mis productos*/

let carrito=[];
let stock = [];
    //*TRAIGO PRODUCTOS DE UNA API*//
    const fetchProducts = async ()=>{

    try{
        const request = await fetch('https://fakestoreapi.com/products');
        const response = await request.json();
            /*SPREAD OPERATOR PARA TRAER MI OBJETO*/
            stock.push(...response)
            console.log(stock);
    
           
           
            /*PARA RECORRER CADA PRODUCTO Y APLICAR UNA FUNCION*/
        stock.forEach( (product)=>{
            product.quantity = 1;
            product.description = "articulo de fake store"
            const sumar = (e) =>{
                e++
            }
            const restar = (e) =>{
                e--
            }
    
                
                    
        contenedor.innerHTML += `
                    
            <div class="tarjeta" >
                <img src="${product.image}" class="imagen-tarjeta" alt="product">
                <div class="tarjeta-cuerpo">
                    <h5 class="card-title h-50 d-flex align-items-center titulo">
                    <strong>${product.title}</strong>
                    </h5>
                    <p class="card-text precio">
                    <strong>
                    precio : 
                    </strong>
                    ${product.price}$
                    </p>
                    <p class="card-text desc">
                    <strong>
                    descripcion :
                    </strong>
                    ${product.description}
                      
                    </p>
                    <p class="card-text cant">
                    <strong>
                    cantidad :
                    </strong>  
                    ${product.quantity}
                    </p>
        
        
                    <button onclick="agregarProducto(${product.id})" class="btn btn-primary agregarCarrito"><strong>Agregar al carrito</strong></button>
                    </div>
                </div>
                    
                    
            `
        });
            
            
            
    
    
    

    }catch(error){
        console.log(error)
    }
    
            
        
        
        
        
}



/*funciones*/
/*ESTAS SON PARA PREGUNTAR SI LA FUNCION ESTA, YA QUE ESTOY CAMBIANDO DE ARCHIVO HTML*/
if(activarFuncion){
    activarFuncion.addEventListener("click", procesarPedido);
}


if(formulario){
    formulario.addEventListener("submit", enviarPedido)
}






/*TOMAR EL CARRITO GUARDADO EN LOCALSTORAGE*/

document.addEventListener("DOMContentLoaded", ()=>{

    

    carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    mostrarCarrito();
    if(activarFuncion){
        document.querySelector("#activarFuncion").click(procesarPedido);
    }
    
});


/* HAGO UN IF PORQUE DOS HTML COMPARTEN UN APP.JS*/



if(procesarCompra){
    procesarCompra.addEventListener("click", ()=>{

        if(carrito.length === 0){
    
            Swal.fire({
    
                title:"tu carrito esta vacio",
                text:"continua con tu compra",
                icon: "error",
                confirmButtonText: "aceptar",
            });
    
    
    
        }else{
            location.href = "compra.html";
            procesarPedido();
        };
    
    
    
    });
};


if(vaciarCarrito){
    vaciarCarrito.addEventListener("click", ()=>{


        carrito.length = [];
        mostrarCarrito();
    
    
    
    });
    
};








const agregarProducto = (id)=>{
    /*ESTO LO HICE PARA QUE CUANDO HAYA UN PRODUCTO REPETDO EN EL CARRITO SE SUME LA CANTIDAD*/

    const existe = carrito.some(prod => prod.id === id);

    if(existe){
        const prod = carrito.map(prod =>{
            if(prod.id == id){
                prod.quantity++
            }
        })
    }else{
        const item = stock.find((prod)=>prod.id === id)
        carrito.push(item)
        console.log("metio el item",item);
    };

    
    mostrarCarrito();



};

const mostrarCarrito = () =>{
    
    const modalBody = document.querySelector('.modal .modal-body');
    if(modalBody){

    
   
    modalBody.innerHTML = ""
   
    carrito.forEach((prod)=>{

        
        const {id, image, title, price, quantity, } = prod;
        
        modalBody.innerHTML += `
        
        
            <div class="modal-contenedor">


            <div class="modal-imagen">
            
            <img class="imagen-carrito" src="${image}" />

            </div>
            
            <div class="modal-tarjeta-cuerpo">
            <p class="modal-p modal-producto">producto: ${title}</p>
            <p class="modal-p modal-precio">precio: ${price}</p>
            <p class="modal-p modal-cantidad">cantidad: ${quantity}</p>


            <button onclick="eliminarProductos(${id})" class="btn btn-primary mt-0 boton-modal-eliminar text-capitalize">eliminar producto</button>
            
            </div>
            </div>
        
        
        
        `
        carritoContenedor.textContent = carrito.length;
        if(precioTotal){
            precioTotal.innerText = carrito.reduce((acc, prod)=> acc + prod.quantity * prod.price, 0).toFixed(2)
        }else{
            precioTotal.innerText=""; 
        }


    })
}

    if(carrito.length == 0){
        modalBody.innerHTML = `
            <p class="text-center text-primary parrafo">aun no agregaste nada!</p>
         `;
         precioTotal.innerHTML=""
         carritoContenedor.innerText=""
    }

   
    
    
    guardarStorage();


}



const eliminarProductos = (id)=>{
    console.log(id)
    const juegoId = id
    carrito = carrito.filter((juego)=> juego.id != juegoId )
    mostrarCarrito()
}


function guardarStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito))
}


function procesarPedido(){
    
    carrito.forEach((prod)=>{
        const listaCompra = document.querySelector("#lista-compra tbody");

        const {id, image, title, price, quantity, } = prod;

        const row = document.createElement("tr");

        row.innerHTML += `
            <td>
                <img class="imagen-procesarCompra" src="${image}"/>
            </td>
            <td><strong>${title}</strong></td>
            <td>${price}</td>
            <td>${quantity}</td>
            <td>${price * quantity}</td>
        
        
        
        `
        listaCompra.appendChild(row)
    })
    totalProceso.innerText = carrito.reduce((acc, prod)=> acc + prod.quantity * prod.price, 0)

}

function enviarPedido(e){
    e.preventDefault();
    const persona = document.querySelector("#persona").value
    const correo = document.querySelector("#correo").value
    if(correo ==="" || persona ==="" ){
        Swal.fire({

            title:"campos incompletos",
            text: "rellena el formualario",
            icon: "error",
            confirmButtonText: "aceptar"


        })
        
    }else{
        
        const spinner = document.querySelector("#spinner");
        spinner.classList.add("d-flex");
        spinner.classList.remove("d-none")

        setTimeout(()=>{
            spinner.classList.remove("d-flex");
            spinner.classList.add("d-none")
            formulario.reset()
        }, 3000);

        const alertExito = document.createElement("p");
        alertExito.classList.add("alert", "alerta","d-block", "text-center", "col-md-12", "mt-2", "alert-success");
        alertExito.textContent = "compra realizada correctamente";
        formulario.appendChild(alertExito)
        setTimeout(() => {
            alertExito.remove();
        }, 3000);
        localStorage.clear()


    }   
}





fetchProducts();







    

   
    




