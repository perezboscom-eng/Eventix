
const buscador = document.getElementById('searchName');
const filtroCapacidad = document.getElementById('filterCapacity');
const filtroEvento = document.getElementById('filterType');
const filtroPresupuesto = document.getElementById('filterBudget');

const tarjetas = document.querySelectorAll('.venue-card');
const contadorTexto = document.getElementById('countNum');


function filtrarSalones() {
    const texto = buscador.value.toLowerCase().trim();
    const capacidadElegida = filtroCapacidad.value;
    const eventoElegido = filtroEvento.value;
    const presupuestoElegido = filtroPresupuesto.value;

    let contadorVisibles = 0;

    tarjetas.forEach(tarjeta => {
        const nombre = tarjeta.getAttribute('data-name');
        const capacidad = parseInt(tarjeta.getAttribute('data-capacity'));
        const eventos = tarjeta.getAttribute('data-event').split(',');
        const presupuesto = tarjeta.getAttribute('data-budget');

        
        const cumpleTexto = nombre.includes(texto);

        
        let cumpleCapacidad = false;
        if (capacidadElegida === 'todos') {
            cumpleCapacidad = true;
        } else if (capacidadElegida === 'hasta150' && capacidad <= 150) {
            cumpleCapacidad = true;
        } else if (capacidadElegida === 'hasta250' && capacidad > 150 && capacidad <= 250) {
            cumpleCapacidad = true;
        } else if (capacidadElegida === 'mas250' && capacidad > 250) {
            cumpleCapacidad = true;
        }

        
        const cumpleEvento = (eventoElegido === 'todos' || eventos.includes(eventoElegido));

        
        const cumplePresupuesto = (presupuestoElegido === 'todos' || presupuesto === presupuestoElegido);

        
        if (cumpleTexto && cumpleCapacidad && cumpleEvento && cumplePresupuesto) {
            tarjeta.style.display = "block";
            contadorVisibles++;
        } else {
            tarjeta.style.display = "none";
        }
    });

    if (contadorTexto) {
        contadorTexto.textContent = contadorVisibles;
    }
}


const openMenuBtn = document.querySelector('.menu-toggle');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (openMenuBtn && mobileMenu) {
    openMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });
}

if (closeMenuBtn && mobileMenu) {
    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
}

buscador.addEventListener('input', filtrarSalones);
filtroCapacidad.addEventListener('change', filtrarSalones);
filtroEvento.addEventListener('change', filtrarSalones);
filtroPresupuesto.addEventListener('change', filtrarSalones);

async function toggleFavorito(event, idDelSalon, boton) {

    event.stopPropagation();

    boton.classList.toggle('active');

    try {
        const respuesta = await fetch('/api/favoritos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ salonId: idDelSalon }) 
        });

        const datos = await respuesta.json();
        console.log('Respuesta del servidor:', datos.mensaje);

    } catch (error) {
        console.error('Error al guardar favorito:', error);
        boton.classList.remove('active');
    }
}