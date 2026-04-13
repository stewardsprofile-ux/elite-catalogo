/* CONFIGURACIÓN ORO 10K - ELITE GOLD */
const telefonoGold = "50662104761";
let joyas = [];
let visiblesOro = 24;

const catalogoOro = document.getElementById("catalogoOro");
const loaderOro = document.getElementById("loaderOro");

/* CARGAR CATÁLOGO DE ORO */
async function cargarOro() {
    try {
        const user = "stewardsprofile-ux";
        const repo = "elite-catalogo";
        const folderPath = "assets/data/oro";
        
        // 1. Conexión con la API de GitHub
        const resGithub = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${folderPath}`);
        
        if (resGithub.ok) {
            const archivos = await resGithub.json();
            
            // 2. Filtramos solo los archivos .json y descargamos
            const archivosJson = archivos.filter(a => a.name.endsWith('.json'));
            
            const promesas = archivosJson.map(archivo => 
                fetch(archivo.download_url).then(r => r.json())
            );
            
            const resultados = await Promise.all(promesas);
            
            // 3. Guardamos los resultados (sin filtros estrictos para que no falle)
            joyas = resultados;
            console.log("Datos cargados de GitHub:", joyas);
        }
    } catch (err) {
        console.error("Error en la carga:", err);
    } finally {
        if(loaderOro) loaderOro.style.display = "none";
        renderOro();
    }
}

cargarOro();

/* RENDERIZAR JOYAS */
function renderOro(filtroTipo = "Todos") {
    if(!catalogoOro) return;
    catalogoOro.innerHTML = "";

    // Filtrar por tipo si es necesario
    const filtrados = joyas.filter(j => 
        filtroTipo === "Todos" || j.tipo === filtroTipo
    );

    if(filtrados.length === 0) {
        catalogoOro.innerHTML = `<p style="color:white; grid-column:1/-1; text-align:center; padding:20px;">No se encontraron piezas en esta categoría.</p>`;
        return;
    }

    filtrados.forEach(j => {
        // SOLUCIÓN AL CAMBIO DE NOMBRE: Si no existe 'nombre', usa 'titulo'
        const nombreDisplay = j.nombre || j.titulo || "Joya Elite";
        
        // SOLUCIÓN A LA RUTA DE IMAGEN:
        let imgPath = j.imagen || "";
        if(imgPath.startsWith('/')) imgPath = imgPath.substring(1);
        
        // Forzamos la URL absoluta para que no falle
        const urlFinal = window.location.origin + "/" + imgPath;

        const card = document.createElement("div");
        card.className = "card-oro"; 
        card.innerHTML = `
            <img src="${urlFinal}" alt="${nombreDisplay}" loading="lazy" onclick="verImagen('${imgPath}')" onerror="this.src='assets/placeholder.webp'">
            <div class="info-oro">
                <span class="tag-oro">${j.tipo || 'Oro 10K'}</span>
                <h3>${nombreDisplay}</h3>
                <p>${j.categoria || 'Colección Exclusiva'}</p>
                <button class="btn-cotizar-oro" onclick="cotizarJoya('${nombreDisplay}','${imgPath}')">
                    Consultar Precio
                </button>
            </div>
        `;
        catalogoOro.appendChild(card);
    });
}

/* WHATSAPP */
function cotizarJoya(nombre, imagen) {
    const urlRef = window.location.origin + "/" + imagen;
    const mensaje = `¡Hola! ✨ Me interesa esta pieza de *Oro 10K*:\n\n*Pieza:* ${nombre}\n\nReferencia: ${urlRef}`;
    window.open(`https://wa.me/${telefonoGold}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

/* VISOR */
function verImagen(img){ 
    const visor = document.getElementById("visorImagen");
    const imgGrande = document.getElementById("imagenGrande");
    if(visor && imgGrande) {
        imgGrande.src = window.location.origin + "/" + img;
        visor.style.display = "flex"; 
    }
}

function irAOro() { window.location.href = "oro.html"; }