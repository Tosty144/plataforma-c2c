let base64Image = '';

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) { base64Image = e.target.result; };
    reader.readAsDataURL(file);
  }
}

function toggleAuthModal() {
  const token = localStorage.getItem('token');
  if (token) {
    localStorage.clear();
    updateUI();
  } else {
    document.getElementById('auth-modal').classList.remove('hidden');
  }
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
  document.getElementById('reg-msg').innerText = '';
}

function switchAuthTab(tab) {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  document.getElementById('reg-msg').innerText = '';

  if (tab === 'login') {
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    formLogin.classList.add('hidden');
    formRegister.classList.remove('hidden');
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  }
}

function updateUI() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const authBtn = document.getElementById('auth-btn');
  const userDisplay = document.getElementById('user-display');
  const secPublish = document.getElementById('sec-publish');

  if (token && user) {
    authBtn.innerText = 'Cerrar Sesión';
    userDisplay.innerText = `Hola, ${user}`;
    secPublish.classList.remove('hidden');
  } else {
    authBtn.innerText = 'Iniciar Sesión / Registrarse';
    userDisplay.innerText = '';
    secPublish.classList.add('hidden');
  }
  loadProducts();
}

async function loginUser() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-pass').value;

  if (!email || !password) {
    document.getElementById('reg-msg').innerText = 'Ingresa correo y contraseña';
    return;
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', data.user.name);
      localStorage.setItem('userId', data.user.id);
      document.getElementById('reg-msg').innerText = '¡Sesión iniciada con éxito!';
      setTimeout(() => {
        closeAuthModal();
        updateUI();
      }, 800);
    } else {
      document.getElementById('reg-msg').innerText = data.error || 'Credenciales incorrectas';
    }
  } catch (err) {
    document.getElementById('reg-msg').innerText = 'Error de conexión';
  }
}

async function registerUser() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-pass').value;

  if (!name || !email || !password) {
    document.getElementById('reg-msg').innerText = 'Todos los campos son obligatorios';
    return;
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', data.user.name);
      localStorage.setItem('userId', data.user.id);
      document.getElementById('reg-msg').innerText = '¡Usuario registrado con éxito!';
      setTimeout(() => {
        closeAuthModal();
        updateUI();
      }, 800);
    } else {
      document.getElementById('reg-msg').innerText = data.error || 'Error al registrar';
    }
  } catch (err) {
    document.getElementById('reg-msg').innerText = 'Error de conexión';
  }
}

async function saveProduct() {
  const editId = document.getElementById('edit-prod-id').value;
  const title = document.getElementById('prod-title').value;
  const price = document.getElementById('prod-price').value;
  const category = document.getElementById('prod-cat').value;
  const description = document.getElementById('prod-desc').value;
  const userId = localStorage.getItem('userId') || 'user-123';

  if (!title || !price) {
    document.getElementById('prod-msg').innerText = 'Título y precio son obligatorios';
    return;
  }

  const payload = { title, price, category, description, sellerId: userId };
  if (base64Image) payload.image = base64Image;

  const url = editId ? `/api/products/${editId}` : '/api/products';
  const method = editId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      document.getElementById('prod-msg').innerText = editId ? 'Producto actualizado.' : 'Producto publicado.';
      cancelEdit();
      loadProducts();
      setTimeout(() => { document.getElementById('prod-msg').innerText = ''; }, 2000);
    }
  } catch (err) {
    document.getElementById('prod-msg').innerText = 'Error al guardar producto';
  }
}

function editProduct(product) {
  document.getElementById('edit-prod-id').value = product.id;
  document.getElementById('prod-title').value = product.title;
  document.getElementById('prod-price').value = product.price;
  document.getElementById('prod-cat').value = product.category;
  document.getElementById('prod-desc').value = product.description || '';
  document.getElementById('form-product-title').innerText = 'Editar Producto';
  document.getElementById('btn-save-prod').innerText = 'Guardar Cambios';
  document.getElementById('btn-cancel-edit').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
  document.getElementById('edit-prod-id').value = '';
  document.getElementById('prod-title').value = '';
  document.getElementById('prod-price').value = '';
  document.getElementById('prod-desc').value = '';
  document.getElementById('prod-img').value = '';
  base64Image = '';
  document.getElementById('form-product-title').innerText = 'Publicar Producto para la Venta';
  document.getElementById('btn-save-prod').innerText = 'Publicar Producto';
  document.getElementById('btn-cancel-edit').classList.add('hidden');
}

async function deleteProduct(id) {
  if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) loadProducts();
  } catch (err) {
    alert('Error al eliminar el producto');
  }
}

async function buyProduct(productId) {
  const userId = localStorage.getItem('userId') || 'comprador-anonimo';
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, buyerId: userId })
    });
    const data = await res.json();
    if (res.ok) {
      alert('¡Compra realizada con éxito!');
      loadProducts();
    } else {
      alert(data.error || 'No se pudo realizar la compra');
    }
  } catch (err) {
    alert('Error al procesar la compra');
  }
}

async function loadProducts() {
  const search = document.getElementById('search-input').value;
  const category = document.getElementById('filter-cat').value;
  const maxPrice = document.getElementById('filter-price').value;
  const currentUserId = localStorage.getItem('userId');

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (maxPrice) params.append('maxPrice', maxPrice);

  try {
    const res = await fetch(`/api/products?${params.toString()}`);
    const products = await res.json();
    const list = document.getElementById('product-list');
    list.innerHTML = '';

    if (!products || products.length === 0) {
      list.innerHTML = '<p style="color: #777;">No hay productos que coincidan.</p>';
      return;
    }

    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      const isOwner = currentUserId && p.sellerId === currentUserId;

      const catFormatted = p.category === 'vehiculos' ? 'Vehículos' 
                         : p.category === 'tecnologia' ? 'Tecnología' 
                         : p.category === 'ropa' ? 'Ropa / Moda' 
                         : p.category === 'hogar' ? 'Hogar' 
                         : 'Otro';

      card.innerHTML = `
        <img src="${p.image || 'https://via.placeholder.com/300x200?text=MarketJhos'}" alt="${p.title}">
        <div class="product-info">
          <div class="product-title">${p.title}</div>
          <div class="product-price">$${p.price}</div>
          <p style="font-size: 13px; color: #aaa; margin-bottom: 8px;">Categoría: ${catFormatted}</p>
          <p style="font-size: 12px; color: #888;">Estado: ${p.status}</p>
        </div>
        <div class="product-actions">
          ${p.status === 'Disponible' 
            ? `<button class="btn-primary" style="font-size: 12px; padding: 6px 14px;" onclick="buyProduct('${p.id}')">Comprar Ahora</button>` 
            : '<span style="color:#ff4d4d; font-size:12px; font-weight:bold;">VENDIDO</span>'}
          ${isOwner ? `
            <div>
              <button class="btn-edit" onclick='editProduct(${JSON.stringify(p).replace(/'/g, "&apos;")})'>Editar</button>
              <button class="btn-danger" onclick="deleteProduct('${p.id}')">Eliminar</button>
            </div>
          ` : ''}
        </div>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    console.error('Error al cargar productos:', err);
  }
}

document.addEventListener('DOMContentLoaded', updateUI);