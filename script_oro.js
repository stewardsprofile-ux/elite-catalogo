/* CONFIGURACIÓN ORO 10K - ELITE GOLD */
const telefonoGold = "50662104761";
let joyas = [];
let visiblesOro = 24;

const catalogoOro = document.getElementById("catalogoOro");
const loaderOro = document.getElementById("loaderOro");

/* CARGAR CATÁLOGO DE ORO (Escaneando carpeta de archivos individuales) */
async function cargarOro() {
    try {
        // Datos para conectar con GitHub
        const user = "stewardsprofile-ux";
        const repo = "elite-catalogo";
        const folderPath = "assets/data/oro";
        
        // 1. Consultamos la API de GitHub para ver qué archivos hay en la carpeta /oro
        const resGithub = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${folderPath}`);
        
        if (!resGithub.ok) {
            throw new Error("Carpeta de joyería no encontrada");
        }

        const archivos = await resGithub.json();
        
        // 2. Filtramos solo los archivos .json y descargamos su contenido
        const promesas = archivos
            .filter(archivo => archivo.name.endsWith('.json'))
            .map(archivo => fetch(archivo.download_url).then(r => r.json()));
        
        const piezasNuevas = await Promise.all(promesas);

        // 3. Guardamos las piezas en la variable global (las más nuevas primero)
        joyas = piezasNuevas;

        if(loaderOro) loaderOro.style.display = "none";
        renderOro();
    } catch (err) {
        if(loaderOro) {
            loaderOro.innerHTML = "Próximamente: Catálogo de Oro 10K";
            // Si el error es porque la carpeta está vacía, mostramos un mensaje amigable
            console.warn("Esperando datos de joyería o carpeta vacía.");
        }
        console.error(err);
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
        card.className = "card-oro"; 
        card.innerHTML = `
            <img src="${j.imagen}" loading="lazy" onclick="verImagen('${j.imagen}')" onerror="this.src='assets/placeholder.webp'">
            <div class="info-oro">
                <span class="tag-oro">${j.tipo}</span>
                <h3>${j.nombre}</h3>
                <p>${j.categoria || ''}</p>
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

/* UTILIDADES */
function verImagen(img){ 
    const url = window.location.origin + "/" + img; 
    const visor = document.getElementById("visorImagen");
    const imgGrande = document.getElementById("imagenGrande");
    
    if(visor && imgGrande) {
        imgGrande.src = url; 
        visor.style.display = "flex"; 
    }
}

function irAOro() {
    window.location.href = "oro.html";
}