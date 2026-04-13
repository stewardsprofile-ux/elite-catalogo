/* CONFIGURACIÓN ORO 10K - ELITE GOLD */
const telefonoGold = "50662104761";
let joyas = [];

// Variables para Filtro Cruzado
let filtroTipo = "Todos"; 
let filtroCat = "Todos"; 

const catalogoOro = document.getElementById("catalogo-oro");
const loaderOro = document.getElementById("loaderOro");

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
        renderOro();
    }
}

function renderOro() {
    if(!catalogoOro) return;
    catalogoOro.innerHTML = "";

    // Lógica de Filtro Cruzado (Tipo AND Categoría)
    const filtrados = joyas.filter(j => {
        const cumpleTipo = (filtroTipo === "Todos" || j.tipo === filtroTipo);
        const cumpleCat = (filtroCat === "Todos" || j.categoria === filtroCat);
        return cumpleTipo && cumpleCat;
    });

    if(filtrados.length === 0) {
        catalogoOro.innerHTML = `<p style="color:white; grid-column:1/-1; text-align:center; padding:40px;">No hay piezas que coincidan con "${filtroTipo}" y "${filtroCat}".</p>`;
        return;
    }

    filtrados.forEach(j => {
        const nombreDisplay = j.nombre || "Joya Elite";
        const urlFinal = window.location.origin + j.imagen;

        const card = document.createElement("div");
        card.className = "card-oro-full";
        card.innerHTML = `
            <div class="header-card-oro">${j.tipo}</div>
            <img src="${urlFinal}" alt="${nombreDisplay}" loading="lazy" 
                 onclick="verImagen('${urlFinal}')" 
                 onerror="this.src='assets/placeholder.webp'">
            <div class="info-card-oro">
                <h3>${nombreDisplay}</h3>
                <p>${j.descripcion || ''}</p>
                <button class="btn-cotizar-oro-full" onclick="cotizarJoya('${nombreDisplay}','${urlFinal}')">
                    COTIZAR AHORA
                </button>
            </div>
        `;
        catalogoOro.appendChild(card);
    });
}

// Funciones de Filtro
function filtrarTipo(valor) {
    filtroTipo = valor;
    actualizarBotones('tipo-oro', valor);
    renderOro();
}

function filtrarCat(valor) {
    // Si toca la misma categoría ya activa, se limpia el filtro (opcional)
    filtroCat = (filtroCat === valor) ? "Todos" : valor;
    actualizarBotones('cat-oro', filtroCat);
    renderOro();
}

function actualizarBotones(clase, seleccionado) {
    document.querySelectorAll('.' + clase).forEach(boton => {
        const valorBoton = boton.getAttribute('data-tipo') || boton.getAttribute('data-cat');
        if (valorBoton === seleccionado) {
            boton.classList.add('active');
        } else {
            boton.classList.remove('active');
        }
    });
}

function cotizarJoya(nombre, urlImagen) {
    const mensaje = `¡Hola! ✨ Me interesa esta pieza de *Oro 10K*:\n\n*Pieza:* ${nombre}\n\nReferencia: ${urlImagen}`;
    window.open(`https://wa.me/${telefonoGold}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

function verImagen(url){ 
    const visor = document.getElementById("visorImagen");
    const imgGrande = document.getElementById("imagenGrande");
    if(visor && imgGrande) {
        imgGrande.src = url;
        visor.style.display = "flex"; 
    }
}

document.addEventListener('keydown', (e) => {
    if(e.key === "Escape") document.getElementById("visorImagen").style.display = "none";
});

cargarOro();