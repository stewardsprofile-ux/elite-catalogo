/* CONFIGURACIÓN ORO 10K - ELITE GOLD */
const telefonoGold = "50662104761";
let joyas = [];

// Variables para Filtro Triple
let filtroTipo = "Todos"; 
let filtroGenero = "Todos";
let filtroCat = "Todos"; 

const catalogoOro = document.getElementById("catalogo-oro");

async function cargarOro() {
    try {
        const user = "stewardsprofile-ux";
        const repo = "elite-catalogo";
        const folderPath = "assets/data/oro";
        const res = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${folderPath}`);
        if (res.ok) {
            const archivos = await res.json();
            const promesas = archivos.filter(a => a.name.endsWith('.json'))
                                     .map(a => fetch(a.download_url).then(r => r.json()));
            joyas = await Promise.all(promesas);
        }
    } catch (err) { console.error(err); }
    finally { renderOro(); }
}

function renderOro() {
    if(!catalogoOro) return;
    catalogoOro.innerHTML = "";

    // LÓGICA DE FILTRO TRIPLE: Metal AND Género AND Categoría
    const filtrados = joyas.filter(j => {
        const cumpleTipo = (filtroTipo === "Todos" || j.tipo === filtroTipo);
        const cumpleGenero = (filtroGenero === "Todos" || j.genero === filtroGenero || j.genero === "Unisex");
        const cumpleCat = (filtroCat === "Todos" || j.categoria === filtroCat);
        return cumpleTipo && cumpleGenero && cumpleCat;
    });

    if(filtrados.length === 0) {
        catalogoOro.innerHTML = `<p style="color:white; text-align:center; padding:40px; grid-column:1/-1;">No hay piezas disponibles para esta combinación.</p>`;
        return;
    }

    filtrados.forEach(j => {
        const urlFinal = window.location.origin + j.imagen;
        const card = document.createElement("div");
        card.className = "card-oro-full";
        card.innerHTML = `
            <div class="header-card-oro">${j.tipo} | ${j.genero || 'Elite'}</div>
            <img src="${urlFinal}" alt="${j.nombre}" onclick="verImagen('${urlFinal}')" onerror="this.src='assets/placeholder.webp'">
            <div class="info-card-oro">
                <h3>${j.nombre}</h3>
                <p>${j.descripcion || ''}</p>
                <button class="btn-cotizar-oro-full" onclick="cotizarJoya('${j.nombre}','${urlFinal}')">
                    COTIZAR AHORA
                </button>
            </div>
        `;
        catalogoOro.appendChild(card);
    });
}

function filtrarTipo(valor) { filtroTipo = valor; actualizarBotones('tipo-oro', valor); renderOro(); }
function filtrarGenero(valor) { filtroGenero = valor; actualizarBotones('gen-oro', valor); renderOro(); }
function filtrarCat(valor) { filtroCat = (filtroCat === valor) ? "Todos" : valor; actualizarBotones('cat-oro', filtroCat); renderOro(); }

function actualizarBotones(clase, seleccionado) {
    document.querySelectorAll('.' + clase).forEach(b => {
        const val = b.getAttribute('data-val');
        b.classList.toggle('active', val === seleccionado);
    });
}

function cotizarJoya(n, img) {
    const msg = `¡Hola! ✨ Me interesa esta pieza:\n*${n}*\nReferencia: ${img}`;
    window.open(`https://wa.me/${telefonoGold}?text=${encodeURIComponent(msg)}`, "_blank");
}

function verImagen(u){ 
    const v = document.getElementById("visorImagen");
    const i = document.getElementById("imagenGrande");
    if(v && i) { i.src = u; v.style.display = "flex"; }
}

cargarOro();