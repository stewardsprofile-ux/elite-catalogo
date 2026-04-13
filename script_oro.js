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
            
            // 2. Descargar archivos .json individuales
            const promesas = archivos
                .filter(archivo => archivo.name.endsWith('.json'))
                .map(archivo => fetch(archivo.download_url).then(r => r.json()));
            
            const piezasNuevas = await Promise.all(promesas);
            
            // 3. Validar: Aceptamos piezas que tengan 'nombre' O 'titulo' (según el CMS)
            joyas = piezasNuevas.filter(j => j && (j.nombre || j.titulo));
            
            console.log("Joyas cargadas con éxito:", joyas.length);
        } else {
            console.warn("La carpeta de oro no responde o está vacía.");
        }

    } catch (err) {
        console.error("Error crítico cargando joyería:", err);
    } finally {
        // Quitamos el loader y renderizamos pase lo que pase
        if(loaderOro) loaderOro.style.display = "none";
        renderOro();
    }
}

// Ejecutar carga inicial
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
        // Soporte para ambos nombres de campo del CMS
        const nombreJoya = j.nombre || j.titulo || "Pieza Exclusiva";
        
        // Limpieza de ruta de imagen para evitar errores de barra doble o falta de barra
        let rutaRaw = j.imagen || 'assets/placeholder.webp';
        let rutaLimpia = rutaRaw.startsWith('/') ? rutaRaw.substring(1) : rutaRaw;
        
        // Construimos la URL completa para la imagen
        const urlFinalImagen = `${window.location.origin}/${rutaLimpia}`;

        const card = document.createElement("div");
        card.className = "card-oro"; 
        card.innerHTML = `
            <img src="${urlFinalImagen}" 
                 loading="lazy" 
                 onclick="verImagen('${rutaLimpia}')" 
                 onerror="this.src='assets/placeholder.webp'">
            <div class="info-oro">
                <span class="tag-oro">${j.tipo || 'Joyas'}</span>
                <h3>${nombreJoya}</h3>
                <p>${j.categoria || 'Oro 10K'}</p>
                <button class="btn-cotizar-oro" onclick="cotizarJoya('${nombreJoya}','${rutaLimpia}')">
                    Consultar Precio
                </button>
            </div>
        `;
        catalogoOro.appendChild(card);
    });
}

/* LÓGICA DE WHATSAPP PARA ORO */
function cotizarJoya(nombre, imagen) {
    const urlImagen = `${window.location.origin}/${imagen}`;
    const mensaje = `¡Hola! ✨ Me interesa esta pieza de *Oro 10K* que vi en el catálogo:\n\n*Pieza:* ${nombre}\n\nReferencia: ${urlImagen}`;
    window.open(`https://wa.me/${telefonoGold}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

/* UTILIDADES */
function verImagen(img){ 
    const visor = document.getElementById("visorImagen");
    const imgGrande = document.getElementById("imagenGrande");
    if(visor && imgGrande) {
        // Si la imagen ya es una URL completa la usa, si no, construye la ruta
        imgGrande.src = img.startsWith('http') ? img : `${window.location.origin}/${img}`;
        visor.style.display = "flex"; 
    }
}

// Control de filtros
function filtrarOro(tipo) {
    renderOro(tipo);
}