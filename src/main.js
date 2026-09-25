let currentProductImage = null; // base64 de la imagen seleccionada

// Muestra u oculta la sección de publicar según si hay usuario registrado
function updateProductSectionVisibility() {
    const isRegistered = sessionStorage.getItem('marketjhos_registered') === 'true';
    const productSection = document.getElementById('product-section');

    if (isRegistered) {
        productSection.classList.remove('hidden');
    } else {
        productSection.classList.add('hidden');
    }
}

// Al cargar la página, revisa si ya había un usuario registrado en esta sesión
window.addEventListener('DOMContentLoaded', () => {
    updateProductSectionVisibility();
});

function previewImage() {
    const fileInput = document.getElementById('prod-img');
    const preview = document.getElementById('img-preview');
    const previewTag = document.getElementById('img-preview-tag');

    const file = fileInput.files[0];

    if (!file) {
        preview.style.display = 'none';
        currentProductImage = null;
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        currentProductImage = e.target.result; // base64
        previewTag.src = currentProductImage;
        preview.style.display = 'block';
    };

    reader.readAsDataURL(file);
}

async function registerUser() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-pass').value;

    const message = document.getElementById('reg-msg');

    if (!name || !email || !password) {
        message.innerText = 'Completa todos los campos.';
        return;
    }

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            message.innerText = data.error || data.message || 'Error al registrar usuario.';
            return;
        }

        message.innerText = data.message || 'Usuario registrado correctamente.';

        document.getElementById('reg-name').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-pass').value = '';

        // Marca la sesión como registrada y desbloquea "Publicar Producto"
        sessionStorage.setItem('marketjhos_registered', 'true');
        updateProductSectionVisibility();

    } catch (err) {
        console.error('Error al registrar usuario:', err);
        message.innerText = 'Error al conectar con la API.';
    }
}


async function createProduct() {
    const title = document.getElementById('prod-title').value.trim();
    const price = document.getElementById('prod-price').value;
    const category = document.getElementById('prod-cat').value.trim();

    const message = document.getElementById('prod-msg');

    if (!title || !price || !category) {
        message.innerText = 'Completa todos los campos del producto.';
        return;
    }

    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                price,
                category,
                imageUrl: currentProductImage || undefined
            })
        });

        const data = await res.json();

        if (!res.ok) {
            message.innerText = data.error || data.message || 'Error al publicar producto.';
            return;
        }

        message.innerText = data.message || 'Producto publicado correctamente.';

        document.getElementById('prod-title').value = '';
        document.getElementById('prod-price').value = '';
        document.getElementById('prod-cat').value = '';
        document.getElementById('prod-img').value = '';
        document.getElementById('img-preview').style.display = 'none';
        currentProductImage = null;

        await loadProducts();

    } catch (err) {
        console.error('Error al publicar producto:', err);
        message.innerText = 'Error al conectar con la API.';
    }
}


async function loadProducts() {
    const list = document.getElementById('product-list');

    try {
        list.innerHTML = '<p>Cargando productos...</p>';

        const res = await fetch('/api/products');

        const products = await res.json();

        if (!res.ok) {
            list.innerHTML = `<p>Error al cargar los productos.</p>`;
            return;
        }

        list.innerHTML = '';

        if (!products || products.length === 0) {
            list.innerHTML = `<p class="empty">No hay productos disponibles.</p>`;
            return;
        }

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            productElement.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.title}">
                <strong>${product.title}</strong>
                <p><strong>Precio:</strong> $${product.price}</p>
                <p><strong>Categoría:</strong> ${product.category}</p>
            `;

            list.appendChild(productElement);
        });

    } catch (err) {
        console.error('Error al cargar productos:', err);
        list.innerHTML = `<p>Error al conectar con la API.</p>`;
    }
}