/* CONFIGURACIÓN ORO 10K - ELITE GOLD */
const telefonoGold = "50662104761";
let joyas = [];
let filtroActualOro = "Todos";

// Asegúrate de que estos IDs coincidan con el HTML
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

    const filtrados = joyas.filter(j => 
        filtroActualOro === "Todos" || 
        j.tipo === filtroActualOro || 
        j.categoria === filtroActualOro
    );

    if(filtrados.length === 0) {
        catalogoOro.innerHTML = `<p style="color:white; grid-column:1/-1; text-align:center; padding:40px;">No se encontraron piezas en "${filtroActualOro}".</p>`;
        return;
    }

    filtrados.forEach(j => {
        const nombreDisplay = j.nombre || "Joya Elite";
        // Decap guarda /assets/images/foto.jpg, lo usamos directo con el origen
        const urlFinal = window.location.origin + j.imagen;

        const card = document.createElement("div");
        card.className = "card-oro";
        card.innerHTML = `
            <div class="tag-oro">${j.tipo || j.categoria || 'Oro 10K'}</div>
            <img src="${urlFinal}" alt="${nombreDisplay}" loading="lazy" 
                 onclick="verImagen('${urlFinal}')" 
                 onerror="this.src='assets/placeholder.webp'">
            <h3>${nombreDisplay}</h3>
            <p style="color: #bbb; font-size: 0.85em; margin-bottom: 10px;">${j.descripcion || ''}</p>
            <button class="btn-cotizar-oro" onclick="cotizarJoya('${nombreDisplay}','${urlFinal}')">
                Cotizar
            </button>
        `;
        catalogoOro.appendChild(card);
    });
}

function filtrarOro(valor) {
    filtroActualOro = valor; 
    actualizarEstadoBotonesOro(valor); 
    renderOro(); 
}

function actualizarEstadoBotonesOro(seleccionado) {
    const botones = document.querySelectorAll('.tipo-oro, .cat-oro');
    botones.forEach(boton => {
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

// Cerrar visor
document.addEventListener('keydown', (e) => {
    if(e.key === "Escape") document.getElementById("visorImagen").style.display = "none";
});

cargarOro();