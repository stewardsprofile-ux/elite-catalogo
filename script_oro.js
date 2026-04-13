/* CONFIGURACIÓN ORO 10K - ELITE GOLD */
const telefonoGold = "50662104761";
let joyas = [];
let visiblesOro = 24;
// Variable para guardar el filtro actual (funciona para Tipo y Categoría)
let filtroActualOro = "Todos";

const catalogoOro = document.getElementById("catalogoOro");
const loaderOro = document.getElementById("loaderOro");

/* CARGAR CATÁLOGO DE ORO */
async function cargarOro() {
    try {
        const user = "stewardsprofile-ux";
        const repo = "elite-catalogo";
        const folderPath = "assets/data/oro";
        
        const resGithub = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${folderPath}`);
        
        if (resGithub.ok) {
            const archivos = await resGithub.json();
            const archivosJson = archivos.filter(a => a.name.endsWith('.json'));
            
            const promesas = archivosJson.map(archivo => 
                fetch(archivo.download_url).then(r => r.json())
            );
            
            joyas = await Promise.all(promesas);
        }
    } catch (err) {
        console.error("Error en la carga:", err);
    } finally {
        if(loaderOro) loaderOro.style.display = "none";
        actualizarEstadoBotonesOro('Todos');
        renderOro();
    }
}

cargarOro();

/* RENDERIZAR JOYAS */
function renderOro() {
    if(!catalogoOro) return;
    catalogoOro.innerHTML = "";

    // FILTRO TOTAL: Busca coincidencia en tipo (Nacional/Italiano) o categoria (Cadenas/Anillos/etc)
    const filtrados = joyas.filter(j => 
        filtroActualOro === "Todos" || 
        j.tipo === filtroActualOro || 
        j.categoria === filtroActualOro
    );

    if(filtrados.length === 0) {
        catalogoOro.innerHTML = `<p style="color:white; grid-column:1/-1; text-align:center; padding:40px; font-size:14px;">No se encontraron piezas en "${filtroActualOro}".</p>`;
        return;
    }

    filtrados.forEach(j => {
        const nombreDisplay = j.nombre || j.titulo || "Joya Elite";
        
        let imgPath = j.imagen || "";
        if(imgPath.startsWith('/')) imgPath = imgPath.substring(1);
        const urlFinal = window.location.origin + "/" + imgPath;

        const card = document.createElement("div");
        card.className = "card-oro";
        card.innerHTML = `
            <div class="tag-oro">${j.tipo || j.categoria || 'Oro 10K'}</div>
            <img src="${urlFinal}" alt="${nombreDisplay}" loading="lazy" onclick="verImagen('${imgPath}')" onerror="this.src='assets/placeholder.webp'">
            <h3>${nombreDisplay}</h3>
            <button class="btn-cotizar-oro" onclick="cotizarJoya('${nombreDisplay}','${imgPath}')">
                Cotizar
            </button>
        `;
        catalogoOro.appendChild(card);
    });
}

/* LÓGICA DE FILTROS */
function filtrarOro(valor) {
    filtroActualOro = valor; 
    actualizarEstadoBotonesOro(valor); 
    renderOro(); 
}

function actualizarEstadoBotonesOro(seleccionado) {
    const botones = document.querySelectorAll('.tipo-oro, .cat-oro');
    
    botones.forEach(boton => {
        const textoBoton = boton.textContent.trim();
        if (textoBoton === seleccionado) {
            boton.classList.add('active');
        } else {
            boton.classList.remove('active');
        }
    });
}

/* WHATSAPP */
function cotizarJoya(nombre, imagen) {
    const urlRef = window.location.origin + "/" + imagen;
    const mensaje = `¡Hola! ✨ Me interesa esta pieza de *Oro 10K* que vi en el catálogo:\n\n*Pieza:* ${nombre}\n\nReferencia: ${urlRef}`;
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