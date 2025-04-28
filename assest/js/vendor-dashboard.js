document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado y es vendedor
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'vendor') {
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar nombre del vendedor
    document.getElementById('vendorName').textContent = currentUser.name;
    
    // Evento para cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Cargar pedidos
    loadOrders();
    
    // Eventos para las pestañas
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Quitar clase active de todas las pestañas
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Quitar clase active de todos los contenidos
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Agregar clase active a la pestaña seleccionada
            this.classList.add('active');
            
            // Mostrar contenido correspondiente
            const tabId = this.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Evento para cerrar modal
    document.querySelector('#orderDetails .close').addEventListener('click', function() {
        document.getElementById('orderDetails').style.display = 'none';
    });
    
    // Evento para iniciar preparación
    document.getElementById('startPreparingBtn').addEventListener('click', function() {
        const orderId = parseInt(this.dataset.orderId);
        updateOrderStatus(orderId, 'preparing');
        document.getElementById('orderDetails').style.display = 'none';
        loadOrders();
    });
    
    // Evento para completar pedido
    document.getElementById('completeOrderBtn').addEventListener('click', function() {
        const orderId = parseInt(this.dataset.orderId);
        updateOrderStatus(orderId, 'completed');
        document.getElementById('orderDetails').style.display = 'none';
        loadOrders();
    });
    
    // Funciones auxiliares
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Filtrar pedidos por estado
        const newOrders = orders.filter(order => order.status === 'new');
        const inProgressOrders = orders.filter(order => order.status === 'preparing');
        const completedOrders = orders.filter(order => order.status === 'completed');
        
        // Mostrar pedidos nuevos
        const newOrdersContainer = document.getElementById('newOrdersContainer');
        newOrdersContainer.innerHTML = '';
        
        if (newOrders.length === 0) {
            newOrdersContainer.innerHTML = '<p>No hay pedidos nuevos</p>';
        } else {
            newOrders.forEach(order => {
                const orderCard = createOrderCard(order);
                newOrdersContainer.appendChild(orderCard);
            });
        }
        
        // Mostrar pedidos en preparación
        const inProgressContainer = document.getElementById('inProgressContainer');
        inProgressContainer.innerHTML = '';
        
        if (inProgressOrders.length === 0) {
            inProgressContainer.innerHTML = '<p>No hay pedidos en preparación</p>';
        } else {
            inProgressOrders.forEach(order => {
                const orderCard = createOrderCard(order);
                inProgressContainer.appendChild(orderCard);
            });
        }
        
        // Mostrar pedidos completados
        const completedContainer = document.getElementById('completedContainer');
        completedContainer.innerHTML = '';
        
        if (completedOrders.length === 0) {
            completedContainer.innerHTML = '<p>No hay pedidos completados</p>';
        } else {
            completedOrders.forEach(order => {
                const orderCard = createOrderCard(order);
                completedContainer.appendChild(orderCard);
            });
        }
    }
    
    function createOrderCard(order) {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.dataset.orderId = order.id;
        
        // Formatear fecha
        const orderDate = new Date(order.createdAt);
        const formattedDate = orderDate.toLocaleString();
        
        // Crear contenido de la tarjeta
        orderCard.innerHTML = `
            <h4>Pedido #${order.id}</h4>
            <p><strong>Cliente:</strong> ${order.userName}</p>
            <p><strong>Teléfono:</strong> ${order.userPhone}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            <p><strong>Fecha:</strong> ${formattedDate}</p>
            <span class="order-status status-${order.status}">
                ${order.status === 'new' ? 'Nuevo' : order.status === 'preparing' ? 'En Preparación' : 'Completado'}
            </span>
        `;
        
        // Evento para mostrar detalles del pedido
        orderCard.addEventListener('click', function() {
            showOrderDetails(order);
        });
        
        return orderCard;
    }
    
    function showOrderDetails(order) {
        const orderDetailsContent = document.getElementById('orderDetailsContent');
        
        // Formatear fecha
        const orderDate = new Date(order.createdAt);
        const formattedDate = orderDate.toLocaleString();
        
        // Crear contenido HTML para los detalles del pedido
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-item">
                    <div class="order-item-info">
                        <span class="order-item-name">${item.name}</span>
                        <span class="order-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="order-item-quantity">x${item.quantity}</div>
                    <div class="order-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });
        
        orderDetailsContent.innerHTML = `
            <div class="order-details-header">
                <h3>Pedido #${order.id}</h3>
                <p><strong>Estado:</strong> 
                    <span class="order-status status-${order.status}">
                        ${order.status === 'new' ? 'Nuevo' : order.status === 'preparing' ? 'En Preparación' : 'Completado'}
                    </span>
                </p>
                <p><strong>Fecha:</strong> ${formattedDate}</p>
            </div>
            
            <div class="order-details-customer">
                <h4>Información del Cliente</h4>
                <p><strong>Nombre:</strong> ${order.userName}</p>
                <p><strong>Teléfono:</strong> ${order.userPhone}</p>
                <p><strong>Dirección:</strong> ${order.userAddress}</p>
            </div>
            
            <div class="order-details-items">
                <h4>Productos</h4>
                <div class="order-items-list">
                    ${itemsHtml}
                </div>
            </div>
            
            <div class="order-details-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>$${order.subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Propina:</span>
                    <span>$${order.tip.toFixed(2)}</span>
                </div>
                <div class="summary-row total-row">
                    <span>Total:</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
            </div>
        `;
        
        // Configurar botones según el estado del pedido
        const startPreparingBtn = document.getElementById('startPreparingBtn');
        const completeOrderBtn = document.getElementById('completeOrderBtn');
        
        startPreparingBtn.dataset.orderId = order.id;
        completeOrderBtn.dataset.orderId = order.id;
        
        if (order.status === 'new') {
            startPreparingBtn.style.display = 'block';
            completeOrderBtn.style.display = 'none';
        } else if (order.status === 'preparing') {
            startPreparingBtn.style.display = 'none';
            completeOrderBtn.style.display = 'block';
        } else {
            startPreparingBtn.style.display = 'none';
            completeOrderBtn.style.display = 'none';
        }
        
        // Mostrar modal
        document.getElementById('orderDetails').style.display = 'block';
    }
    
    function updateOrderStatus(orderId, newStatus) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Buscar pedido por ID
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            // Actualizar estado del pedido
            orders[orderIndex].status = newStatus;
            
            // Si se completa el pedido, registrar la fecha de completado
            if (newStatus === 'completed') {
                orders[orderIndex].completedAt = new Date().toISOString();
            }
            
            // Guardar cambios
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Registrar actividad
            const userActivity = JSON.parse(localStorage.getItem('userActivity')) || [];
            userActivity.push({
                userId: currentUser.id,
                action: 'updateOrderStatus',
                orderId: orderId,
                newStatus: newStatus,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('userActivity', JSON.stringify(userActivity));
        }
    }
});