/* CONFIGURACIÓN ORO 10K - ELITE GOLD */
const telefonoGold = "50662104761";
let joyas = [];
let visiblesOro = 24;

const catalogoOro = document.getElementById("catalogoOro");
const loaderOro = document.getElementById("loaderOro");

/* CARGAR CATÁLOGO DE ORO (Desde la carpeta que gestiona el Admin) */
async function cargarOro() {
    try {
        // Aquí llamamos al JSON que generará Decap CMS para la joyería
        const res = await fetch("assets/data/oro.json"); 
        joyas = await res.json();

        if(loaderOro) loaderOro.style.display = "none";
        renderOro();
    } catch (err) {
        if(loaderOro) loaderOro.innerHTML = "Próximamente: Catálogo de Oro 10K";
        console.error("Esperando datos de joyería...", err);
    }
}
cargarOro();

/* RENDERIZAR JOYAS */
function renderOro(filtroTipo = "Todos") {
    if(!catalogoOro) return;
    catalogoOro.innerHTML = "";

    const filtrados = joyas.filter(j => 
        filtroTipo === "Todos" || j.tipo === filtroTipo
    );

    const lista = filtrados.slice(0, visiblesOro);

    if(lista.length === 0) {
        catalogoOro.innerHTML = "<p style='color:white; grid-column:1/-1; text-align:center;'>Cargando piezas exclusivas...</p>";
        return;
    }

    lista.forEach(j => {
        const card = document.createElement("div");
        card.className = "card-oro"; // Puedes darle un estilo más premium en CSS
        card.innerHTML = `
            <img src="${j.imagen}" loading="lazy" onclick="verImagen('${j.imagen}')">
            <div class="info-oro">
                <span class="tag-oro">${j.tipo}</span>
                <h3>${j.nombre}</h3>
                <p>${j.categoria}</p>
                <button class="btn-cotizar-oro" onclick="cotizarJoya('${j.nombre}','${j.imagen}')">
                    Consultar Precio
                </button>
            </div>
        `;
        catalogoOro.appendChild(card);
    });
}

/* LÓGICA DE WHATSAPP PARA ORO */
function cotizarJoya(nombre, imagen) {
    const urlImagen = window.location.origin + "/" + imagen;
    const mensaje = `¡Hola! ✨ Me interesa esta pieza de *Oro 10K* que vi en el catálogo:\n\n*Pieza:* ${nombre}\n\n¿Podrías darme más información sobre el precio y peso?\n\nReferencia: ${urlImagen}`;
    
    window.open(`https://wa.me/${telefonoGold}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

/* FUNCIÓN PARA EL BOTÓN DE REDIRECCIÓN (El que ya tienes en el index) */
function irAOro() {
    window.location.href = "oro.html";
}