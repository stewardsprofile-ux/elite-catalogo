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
        
        // 1. Intentar conectar con GitHub
        const resGithub = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${folderPath}`);
        
        if (resGithub.ok) {
            const archivos = await resGithub.json();
            
            // 2. Descargar archivos .json
            const promesas = archivos
                .filter(archivo => archivo.name.endsWith('.json'))
                .map(archivo => fetch(archivo.download_url).then(r => r.json()));
            
            const piezasNuevas = await Promise.all(promesas);
            
            // 3. Validar que las piezas tengan los datos mínimos
            joyas = piezasNuevas.filter(j => j && j.nombre);
        } else {
            console.warn("La carpeta de oro aún no existe o está vacía en GitHub.");
        }

    } catch (err) {
        console.error("Error cargando joyería:", err);
    } finally {
        // SIEMPRE quitamos el loader y renderizamos, aunque esté vacío
        if(loaderOro) loaderOro.style.display = "none";
        renderOro();
    }
}

// Ejecutar carga
cargarOro();

/* RENDERIZAR JOYAS */
function renderOro(filtroTipo = "Todos") {
    if(!catalogoOro) return;
    catalogoOro.innerHTML = "";

    const filtrados = joyas.filter(j => 
        filtroTipo === "Todos" || j.tipo === filtroTipo
    );

    if(filtrados.length === 0) {
        catalogoOro.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:40px; color:#aaa;">
                <p>No hay piezas disponibles en esta categoría por el momento.</p>
            </div>`;
        return;
    }

    const lista = filtrados.slice(0, visiblesOro);

    lista.forEach(j => {
        // Limpieza de ruta de imagen (por si el CMS añade barras extra)
        let rutaImg = j.imagen || 'assets/placeholder.webp';
        if(rutaImg.startsWith('/')) rutaImg = rutaImg.substring(1);

        const card = document.createElement("div");
        card.className = "card-oro"; 
        card.innerHTML = `
            <img src="${rutaImg}" loading="lazy" onclick="verImagen('${rutaImg}')" onerror="this.src='assets/placeholder.webp'">
            <div class="info-oro">
                <span class="tag-oro">${j.tipo || 'Joyas'}</span>
                <h3>${j.nombre}</h3>
                <p>${j.categoria || 'Oro 10K'}</p>
                <button class="btn-cotizar-oro" onclick="cotizarJoya('${j.nombre}','${rutaImg}')">
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
    const mensaje = `¡Hola! ✨ Me interesa esta pieza de *Oro 10K*:\n\n*Pieza:* ${nombre}\n\nReferencia: ${urlImagen}`;
    window.open(`https://wa.me/${telefonoGold}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

/* UTILIDADES */
function verImagen(img){ 
    const visor = document.getElementById("visorImagen");
    const imgGrande = document.getElementById("imagenGrande");
    if(visor && imgGrande) {
        imgGrande.src = img.startsWith('http') ? img : window.location.origin + "/" + img;
        visor.style.display = "flex"; 
    }
}

// Botones de filtro de oro (Asegúrate de que tus botones en oro.html tengan onclick="filtrarOro('Anillos')")
function filtrarOro(tipo) {
    renderOro(tipo);
}