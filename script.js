let indiceActual = 0;
const slides = document.querySelectorAll('.slide');

function mostrarSiguienteSlide() {
    // Oculta la imagen actual
    slides[indiceActual].classList.remove('active');
    
    // Calcula el índice de la siguiente imagen
    indiceActual = (indiceActual + 1) % slides.length;
    
    // Muestra la siguiente imagen
    slides[indiceActual].classList.add('active');
}

// Cambia de imagen cada 3000ms (3 segundos)
setInterval(mostrarSiguienteSlide, 3000);

// Muestra la primera imagen al cargar la página
slides[indiceActual].classList.add('active');

const envio = document.querySelector('.envio');
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        envio.classList.add('oculto');
        header.style.top = '0';
    } else {
        envio.classList.remove('oculto');
        header.style.top = '40px';
    }
});

const CART_KEY = 'miTiendaCarrito';
const WHATSAPP_NUMBER = '+584140216722'; // Cambia este número al número de WhatsApp de tu tienda
let carrito = cargarCarrito();

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
    actualizarContadorCarrito();
});

function cargarCarrito() {
    const saved = localStorage.getItem(CART_KEY);
    try {
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito() {
    localStorage.setItem(CART_KEY, JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio) {
    const index = carrito.findIndex(item => item.nombre === nombre);
    if (index >= 0) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    guardarCarrito();
    actualizarCarrito();
    actualizarContadorCarrito();
    alert(`Producto "${nombre}" agregado al carrito por $${precio.toFixed(2)}`);
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    if (confirm('¿Deseas vaciar todo el carrito?')) {
        carrito = [];
        guardarCarrito();
        actualizarCarrito();
        actualizarContadorCarrito();
    }
}

function mostrarCarrito() {
    const panel = document.getElementById('carrito-panel');
    if (panel) {
        panel.classList.add('visible');
        actualizarCarrito();
    }
}

function cerrarCarrito() {
    const panel = document.getElementById('carrito-panel');
    if (panel) {
        panel.classList.remove('visible');
    }
}

function actualizarCarrito() {
    const itemsContainer = document.getElementById('carrito-items');
    const totalLabel = document.getElementById('carrito-total');
    if (!itemsContainer || !totalLabel) return;

    itemsContainer.innerHTML = '';

    if (carrito.length === 0) {
        itemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        totalLabel.textContent = '$0.00';
        return;
    }

    let total = 0;
    carrito.forEach((item, index) => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'carrito-item';
        itemElement.innerHTML = `
            <div>
                <strong>${item.nombre}</strong>
                <span>${item.cantidad} × $${item.precio.toFixed(2)}</span>
                <span>Total: $${itemTotal.toFixed(2)}</span>
            </div>
            <button type="button" onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        itemsContainer.appendChild(itemElement);
    });

    totalLabel.textContent = `$${total.toFixed(2)}`;
}

function actualizarContadorCarrito() {
    const count = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = `(${count})`;
    });
}

function generarRecibo() {
    const direccion = document.getElementById('direccion-envio');
    if (!direccion) return;

    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de generar el recibo.');
        return;
    }

    const direccionTexto = direccion.value.trim();
    if (!direccionTexto) {
        alert('Por favor, ingresa una dirección de envío.');
        direccion.focus();
        return;
    }

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const productosTexto = carrito
        .map(item => `- ${item.nombre} x${item.cantidad}: $${(item.precio * item.cantidad).toFixed(2)}`)
        .join('\n');

    const recibo = `*Recibo de compra*\n\n*Productos:*\n${productosTexto}\n\n*Total:* $${total.toFixed(2)}\n*Dirección de envío:* ${direccionTexto}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(recibo)}`;

    window.open(url, '_blank');
}

const promoText = document.querySelector('.promo .promo-text');
if (promoText) {
    const promoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
            }
        });
    }, { threshold: 0.1 });
    promoObserver.observe(promoText);
}

const navToggle = document.getElementById('nav-toggle');
const navElement = document.querySelector('nav');
if (navToggle && navElement) {
    navToggle.addEventListener('click', () => {
        navElement.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navElement.classList.contains('open')) {
                navElement.classList.remove('open');
            }
        });
    });
}

