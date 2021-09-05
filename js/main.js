let divProductos = $(".border-img"); //array de divs
//var global para posicionamiento
let i = 0;
// accedemos al json con los productos y los cargamos
const URLJSON = "json/productos.json";

const productos = [];

$.getJSON(URLJSON, function (respuesta, estado) {
    if (estado === "success") {
        let misProductos = respuesta;
        for (const producto of misProductos) {
            productos.push(producto);
            if (i < divProductos.length) {
                divProductos.eq(i).append(`<img src="${producto.url}" class="img">
                <div class="contenedor-product"> <p class="p-produc">${producto.nombre}</p>
                <p class="p-produc">Código: ${producto.id}</p>
                <p class="p-produc">$USD ${producto.importe}</p> </div>`);
                $(".border-img").fadeIn(1500);
                i++;
            }
        }
    }
});

//se inicializa la variable dolar en 1 por si la api no esta respondiendo
let precioDolarHoyCompra = 1;
let precioDolarHoyVenta = 1;

//obtenemos el precio del dolarblue al dia de la fecha y cargamos popup
$(function () {
    const urlGet = "https://www.dolarsi.com/api/api.php?type=valoresprincipales"
    $.ajax({
        method: "GET",
        url: urlGet,
        success: function (respuesta) {
            let misDatos = respuesta;
            precioDolarHoyCompra = parseInt(misDatos[1].casa.compra);
            precioDolarHoyVenta = parseInt(misDatos[1].casa.venta);
            $("nav").append(`
                <p class="p-nav">Dolar Blue Compra: USD ${precioDolarHoyCompra}</p>
                <p class="p-nav">Dolar Blue Venta: USD ${precioDolarHoyVenta}</p>
                `);
        }
    });

    $("#open").on("click", function () {
        $(".model").css('transform', 'scale(1)');
        $(".model").animate({
                left: '750px',
            },
            "slow");
    });

    $("#close").on("click", function () {
        $(".model").css('transform', 'scale(0)');
        vaciarMensaje();
        $("#codigo").val("");
    });

});

//var global para identificar codigo ingresado por usuario
let codigoProductoCargado;

//guardado en session de cuotas
const cuotas = [3, 6, 9, 12, 18];
sessionStorage.setItem('cuotas', cuotas);

//JSON para cargar alerta 
const alertaJSON = '{"id":1,"mensaje":"El código debe ser un número menor o igual a 6."}';
const alerta = JSON.parse(alertaJSON);

//var global para notificar al usuario la operación
let salida = "";

//se calculan las cuotas del producto por el codigo ingresado
function calcularCuotas(productoFiltrado) {
    let cuotas = sessionStorage.getItem('cuotas').split(",");
    salida = "El importe sin IVA incluido simulado para " + productoFiltrado.nombre + ":<br>";
    salida += "1 Cuota sin interés: " + productoFiltrado.importe * precioDolarHoyCompra + "<br>";
    for (let index = 0; index < cuotas.length; index++) {
        salida += cuotas[index] + " Cuotas sin interes: " + ((productoFiltrado.importe * precioDolarHoyCompra) / cuotas[index]).toFixed(2) + "<br>";
    }
    $("#mensaje").html(salida);
}

//evento que acciona la funcionalidad del simulador
$("form").on("submit", function (e) {
    e.preventDefault();
    let formulario = e.target
    codigoProductoCargado = parseInt(formulario.children[0].value);
    vaciarMensaje();
    if (Number.isNaN(codigoProductoCargado)) {
        $("#mensaje").text(alerta.mensaje);
        return;
    } else {
        validarCalcular();
    }
});

//funcion para validar y calcular cuotas 
function validarCalcular() {
    if (codigoProductoCargado < 7) {
        calcularCuotas(productos.find(e => e.id == codigoProductoCargado));
    } else {
        vaciarMensaje();
        $("#mensaje").text(alerta.mensaje);
    }
}
//se vacia texto que se muestra en modal
function vaciarMensaje() {
    $("#mensaje").text("");
}