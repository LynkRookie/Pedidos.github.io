document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar nombre del usuario
    document.getElementById('userName').textContent = currentUser.name;
    
    // Evento para cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Inicializar carrito
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
    // Actualizar carrito en la interfaz
    updateCartUI();
    
    // Eventos para los botones de agregar al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemId = parseInt(menuItem.dataset.id);
            const itemName = menuItem.querySelector('h4').textContent;
            const itemPrice = parseFloat(menuItem.dataset.price);
            
            // Agregar item al carrito
            addToCart(itemId, itemName, itemPrice);
        });
    });
    
    // Eventos para los botones de cantidad
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemId = parseInt(menuItem.dataset.id);
            const quantityElement = this.closest('.quantity-control').querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (this.classList.contains('plus')) {
                quantity++;
            } else if (this.classList.contains('minus') && quantity > 0) {
                quantity--;
            }
            
            quantityElement.textContent = quantity;
            
            // Si la cantidad es mayor que 0, actualizar el carrito
            if (quantity > 0) {
                const itemName = menuItem.querySelector('h4').textContent;
                const itemPrice = parseFloat(menuItem.dataset.price);
                updateCartItemQuantity(itemId, quantity, itemName, itemPrice);
            } else {
                // Si la cantidad es 0, eliminar del carrito
                removeFromCart(itemId);
            }
        });
    });
    
    // Eventos para los botones de propina
    document.querySelectorAll('.tip-btn').forEach(button => {
        button.addEventListener('click', function() {
            const percent = parseInt(this.dataset.percent);
            const subtotal = calculateSubtotal();
            const tipAmount = (subtotal * percent / 100).toFixed(2);
            
            document.getElementById('tipAmount').value = tipAmount;
            updateTotal();
            
            // Resaltar el botón seleccionado
            document.querySelectorAll('.tip-btn').forEach(btn => {
                btn.classList.remove('primary');
            });
            this.classList.add('primary');
        });
    });
    
    // Evento para el campo de propina personalizada
    document.getElementById('tipAmount').addEventListener('input', function() {
        // Quitar resaltado de los botones de propina
        document.querySelectorAll('.tip-btn').forEach(btn => {
            btn.classList.remove('primary');
        });
        
        updateTotal();
    });
    
    // Evento para el botón de realizar pedido
    document.getElementById('placeOrderBtn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega algunos productos antes de realizar el pedido.');
            return;
        }
        
        // Crear nuevo pedido
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const newOrder = {
            id: orders.length + 1,
            userId: currentUser.id,
            userName: currentUser.name,
            userPhone: currentUser.phone,
            userAddress: currentUser.address,
            items: cart,
            subtotal: calculateSubtotal(),
            tip: parseFloat(document.getElementById('tipAmount').value || 0),
            total: calculateTotal(),
            status: 'new',
            createdAt: new Date().toISOString()
        };
        
        // Agregar pedido a la lista
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Registrar actividad de pedido
        const userActivity = JSON.parse(localStorage.getItem('userActivity')) || [];
        userActivity.push({
            userId: currentUser.id,
            action: 'order',
            orderId: newOrder.id,
            total: newOrder.total,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('userActivity', JSON.stringify(userActivity));
        
        // Limpiar carrito
        cart = [];
        sessionStorage.setItem('cart', JSON.stringify(cart));
        
        // Mostrar confirmación
        document.getElementById('orderNumber').textContent = newOrder.id;
        document.getElementById('orderConfirmation').style.display = 'block';
        
        // Actualizar interfaz
        updateCartUI();
        resetQuantities();
    });
    
    // Evento para cerrar la confirmación
    document.getElementById('closeConfirmation').addEventListener('click', function() {
        document.getElementById('orderConfirmation').style.display = 'none';
    });
    
    document.querySelector('#orderConfirmation .close').addEventListener('click', function() {
        document.getElementById('orderConfirmation').style.display = 'none';
    });
    
    // Funciones auxiliares
    function addToCart(itemId, itemName, itemPrice) {
        // Verificar si el item ya está en el carrito
        const existingItem = cart.find(item => item.id === itemId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: 1
            });
        }
        
        // Actualizar cantidad en la interfaz
        const quantityElement = document.querySelector(`.menu-item[data-id="${itemId}"] .quantity`);
        quantityElement.textContent = cart.find(item => item.id === itemId).quantity;
        
        // Guardar carrito en sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizar interfaz
        updateCartUI();
    }
    
    function updateCartItemQuantity(itemId, quantity, itemName, itemPrice) {
        // Verificar si el item ya está en el carrito
        const existingItem = cart.find(item => item.id === itemId);
        
        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            cart.push({
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: quantity
            });
        }
        
        // Guardar carrito en sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizar interfaz
        updateCartUI();
    }
    
    function removeFromCart(itemId) {
        // Eliminar item del carrito
        cart = cart.filter(item => item.id !== itemId);
        
        // Guardar carrito en sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizar interfaz
        updateCartUI();
    }
    
    function updateCartUI() {
        const cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <span>x${item.quantity}</span>
                    </div>
                    <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
        
        // Actualizar subtotal y total
        document.getElementById('subtotal').textContent = `$${calculateSubtotal().toFixed(2)}`;
        updateTotal();
    }
    
    function calculateSubtotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    function updateTotal() {
        const subtotal = calculateSubtotal();
        const tip = parseFloat(document.getElementById('tipAmount').value || 0);
        const total = subtotal + tip;
        
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }
    
    function calculateTotal() {
        const subtotal = calculateSubtotal();
        const tip = parseFloat(document.getElementById('tipAmount').value || 0);
        return subtotal + tip;
    }
    
    function resetQuantities() {
        document.querySelectorAll('.quantity').forEach(element => {
            element.textContent = '0';
        });
    }
});