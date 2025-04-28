document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado y es administrador
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar nombre del administrador
    document.getElementById('adminName').textContent = currentUser.name;
    
    // Evento para cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
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
            
            // Cargar datos específicos de la pestaña
            if (tabId === 'salesSummary') {
                loadSalesSummary();
            } else if (tabId === 'userActivity') {
                loadUserActivity();
            } else if (tabId === 'manageUsers') {
                loadUsers();
            }
        });
    });
    
    // Eventos para filtros de fecha
    document.getElementById('dateRange').addEventListener('change', function() {
        const customDateRange = document.getElementById('customDateRange');
        if (this.value === 'custom') {
            customDateRange.style.display = 'flex';
        } else {
            customDateRange.style.display = 'none';
            loadSalesSummary();
        }
    });
    
    document.getElementById('applyDateFilter').addEventListener('click', function() {
        loadSalesSummary();
    });
    
    document.getElementById('activityDateRange').addEventListener('change', function() {
        const customDateRange = document.getElementById('activityCustomDateRange');
        if (this.value === 'custom') {
            customDateRange.style.display = 'flex';
        } else {
            customDateRange.style.display = 'none';
            loadUserActivity();
        }
    });
    
    document.getElementById('applyActivityDateFilter').addEventListener('click', function() {
        loadUserActivity();
    });
    
    // Eventos para filtros de usuarios
    document.getElementById('userSearchInput').addEventListener('input', function() {
        filterUsers();
    });
    
    document.getElementById('userRoleFilter').addEventListener('change', function() {
        filterUsers();
    });
    
    // Evento para agregar usuario
    document.getElementById('addUserBtn').addEventListener('click', function() {
        showUserForm();
    });
    
    // Evento para cerrar modal
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Evento para el formulario de usuario
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveUser();
    });
    
    // Cargar datos iniciales
    loadSalesSummary();
    
    // Funciones auxiliares
    function loadSalesSummary() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const dateRange = document.getElementById('dateRange').value;
        
        // Filtrar pedidos por fecha
        const filteredOrders = filterOrdersByDate(orders, dateRange);
        
        // Calcular estadísticas
        const completedOrders = filteredOrders.filter(order => order.status === 'completed');
        const totalSales = completedOrders.reduce((total, order) => total + order.total, 0);
        const totalTips = completedOrders.reduce((total, order) => total + order.tip, 0);
        const averageOrder = completedOrders.length > 0 ? totalSales / completedOrders.length : 0;
        
        // Mostrar estadísticas
        document.getElementById('totalSales').textContent = `$${totalSales.toFixed(2)}`;
        document.getElementById('completedOrders').textContent = completedOrders.length;
        document.getElementById('totalTips').textContent = `$${totalTips.toFixed(2)}`;
        document.getElementById('averageOrder').textContent = `$${averageOrder.toFixed(2)}`;
        
        // Calcular productos más vendidos
        const popularItems = calculatePopularItems(completedOrders);
        
        // Mostrar productos más vendidos
        const popularItemsTable = document.getElementById('popularItemsTable').querySelector('tbody');
        popularItemsTable.innerHTML = '';
        
        popularItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.total.toFixed(2)}</td>
            `;
            popularItemsTable.appendChild(row);
        });
        
        // Generar datos para el gráfico
        const chartData = generateChartData(completedOrders, dateRange);
        
        // Crear gráfico
        createSalesChart(chartData);
    }
    
    function loadUserActivity() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const userActivity = JSON.parse(localStorage.getItem('userActivity')) || [];
        const dateRange = document.getElementById('activityDateRange').value;
        
        // Filtrar actividad por fecha
        const filteredActivity = filterActivityByDate(userActivity, dateRange);
        
        // Agrupar actividad por usuario
        const userActivityMap = {};
        
        users.forEach(user => {
            userActivityMap[user.id] = {
                id: user.id,
                name: user.name,
                email: user.email,
                lastLogin: null,
                ordersCount: 0,
                totalSpent: 0
            };
        });
        
        // Procesar actividad de inicio de sesión
        filteredActivity.forEach(activity => {
            if (activity.action === 'login' && userActivityMap[activity.userId]) {
                const loginDate = new Date(activity.timestamp);
                if (!userActivityMap[activity.userId].lastLogin || 
                    loginDate > new Date(userActivityMap[activity.userId].lastLogin)) {
                    userActivityMap[activity.userId].lastLogin = activity.timestamp;
                }
            }
        });
        
        // Procesar pedidos
        orders.forEach(order => {
            if (order.status === 'completed' && userActivityMap[order.userId]) {
                const orderDate = new Date(order.createdAt);
                const startDate = getStartDate(dateRange);
                const endDate = getEndDate(dateRange);
                
                if ((!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate)) {
                    userActivityMap[order.userId].ordersCount++;
                    userActivityMap[order.userId].totalSpent += order.total;
                }
            }
        });
        
        // Mostrar actividad de usuarios
        const userActivityTable = document.getElementById('userActivityTable').querySelector('tbody');
        userActivityTable.innerHTML = '';
        
        Object.values(userActivityMap).forEach(userActivity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userActivity.name}</td>
                <td>${userActivity.email}</td>
                <td>${userActivity.lastLogin ? new Date(userActivity.lastLogin).toLocaleString() : 'Nunca'}</td>
                <td>${userActivity.ordersCount}</td>
                <td>$${userActivity.totalSpent.toFixed(2)}</td>
            `;
            userActivityTable.appendChild(row);
        });
    }
    
    function loadUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Mostrar usuarios
        const usersTable = document.getElementById('usersTable').querySelector('tbody');
        usersTable.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.dataset.userId = user.id;
            
            // Formatear fecha de registro
            const createdDate = new Date(user.createdAt);
            const formattedDate = createdDate.toLocaleDateString();
            
            // Traducir rol
            let roleName;
            switch(user.role) {
                case 'admin':
                    roleName = 'Administrador';
                    break;
                case 'vendor':
                    roleName = 'Vendedor';
                    break;
                default:
                    roleName = 'Cliente';
                    break;
            }
            
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${roleName}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn small edit-user">Editar</button>
                    <button class="btn small delete-user">Eliminar</button>
                </td>
            `;
            usersTable.appendChild(row);
        });
        
        // Eventos para botones de editar y eliminar
        document.querySelectorAll('.edit-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = parseInt(this.closest('tr').dataset.userId);
                editUser(userId);
            });
        });
        
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = parseInt(this.closest('tr').dataset.userId);
                deleteUser(userId);
            });
        });
    }
    
    function filterUsers() {
        const searchTerm = document.getElementById('userSearchInput').value.toLowerCase();
        const roleFilter = document.getElementById('userRoleFilter').value;
        const rows = document.getElementById('usersTable').querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            const email = row.cells[1].textContent.toLowerCase();
            const role = row.cells[2].textContent.toLowerCase();
            
            const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
            const matchesRole = roleFilter === 'all' || 
                (roleFilter === 'admin' && role === 'administrador') ||
                (roleFilter === 'vendor' && role === 'vendedor') ||
                (roleFilter === 'user' && role === 'cliente');
            
            if (matchesSearch && matchesRole) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    function showUserForm(userId = null) {
        const formTitle = document.getElementById('userFormTitle');
        const form = document.getElementById('userForm');
        
        // Limpiar formulario
        form.reset();
        
        if (userId) {
            // Editar usuario existente
            formTitle.textContent = 'Editar Usuario';
            
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.id === userId);
            
            if (user) {
                document.getElementById('userName').value = user.name;
                document.getElementById('userEmail').value = user.email;
                document.getElementById('userPhone').value = user.phone;
                document.getElementById('userAddress').value = user.address;
                document.getElementById('userRole').value = user.role;
                document.getElementById('userPassword').value = user.password;
                
                // Guardar ID del usuario en el formulario
                form.dataset.userId = userId;
            }
        } else {
            // Agregar nuevo usuario
            formTitle.textContent = 'Agregar Usuario';
            delete form.dataset.userId;
        }
        
        // Mostrar modal
        document.getElementById('userFormModal').style.display = 'block';
    }
    
    function saveUser() {
        const form = document.getElementById('userForm');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const phone = document.getElementById('userPhone').value;
        const address = document.getElementById('userAddress').value;
        const role = document.getElementById('userRole').value;
        const password = document.getElementById('userPassword').value;
        
        if (form.dataset.userId) {
            // Actualizar usuario existente
            const userId = parseInt(form.dataset.userId);
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex !== -1) {
                users[userIndex].name = name;
                users[userIndex].email = email;
                users[userIndex].phone = phone;
                users[userIndex].address = address;
                users[userIndex].role = role;
                users[userIndex].password = password;
            }
        } else {
            // Crear nuevo usuario
            const newUser = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                name,
                email,
                phone,
                address,
                role,
                password,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
        }
        
        // Guardar cambios
        localStorage.setItem('users', JSON.stringify(users));
        
        // Cerrar modal
        document.getElementById('userFormModal').style.display = 'none';
        
        // Recargar lista de usuarios
        loadUsers();
    }
    
    function editUser(userId) {
        showUserForm(userId);
    }
    
    function deleteUser(userId) {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Verificar si es el último administrador
            const admins = users.filter(u => u.role === 'admin');
            const userToDelete = users.find(u => u.id === userId);
            
            if (userToDelete && userToDelete.role === 'admin' && admins.length <= 1) {
                alert('No puedes eliminar el último administrador del sistema.');
                return;
            }
            
            // Eliminar usuario
            const updatedUsers = users.filter(u => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // Recargar lista de usuarios
            loadUsers();
        }
    }
    
    function filterOrdersByDate(orders, dateRange) {
        const startDate = getStartDate(dateRange);
        const endDate = getEndDate(dateRange);
        
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
        });
    }
    
    function filterActivityByDate(activities, dateRange) {
        const startDate = getStartDate(dateRange);
        const endDate = getEndDate(dateRange);
        
        return activities.filter(activity => {
            const activityDate = new Date(activity.timestamp);
            return (!startDate || activityDate >= startDate) && (!endDate || activityDate <= endDate);
        });
    }
    
    function getStartDate(dateRange) {
        const now = new Date();
        let startDate;
        
        switch(dateRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'yesterday':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                break;
            case 'week':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'custom':
                const startDateInput = dateRange === 'custom' ? 
                    document.getElementById('startDate') : 
                    document.getElementById('activityStartDate');
                if (startDateInput.value) {
                    startDate = new Date(startDateInput.value);
                }
                break;
            default:
                startDate = null;
        }
        
        return startDate;
    }
    
    function getEndDate(dateRange) {
        const now = new Date();
        let endDate;
        
        switch(dateRange) {
            case 'today':
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                break;
            case 'yesterday':
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
                break;
            case 'week':
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()), 23, 59, 59);
                break;
            case 'month':
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                break;
            case 'custom':
                const endDateInput = dateRange === 'custom' ? 
                    document.getElementById('endDate') : 
                    document.getElementById('activityEndDate');
                if (endDateInput.value) {
                    endDate = new Date(endDateInput.value);
                    endDate.setHours(23, 59, 59);
                }
                break;
            default:
                endDate = new Date();
        }
        
        return endDate;
    }
    
    function calculatePopularItems(orders) {
        const itemsMap = {};
        
        orders.forEach(order => {
            order.items.forEach(item => {
                if (itemsMap[item.id]) {
                    itemsMap[item.id].quantity += item.quantity;
                    itemsMap[item.id].total += item.price * item.quantity;
                } else {
                    itemsMap[item.id] = {
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        total: item.price * item.quantity
                    };
                }
            });
        });
        
        // Convertir a array y ordenar por cantidad
        return Object.values(itemsMap).sort((a, b) => b.quantity - a.quantity);
    }
    
    function generateChartData(orders, dateRange) {
        const data = {};
        const labels = [];
        const values = [];
        
        // Agrupar ventas por día
        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const dateKey = orderDate.toLocaleDateString();
            
            if (data[dateKey]) {
                data[dateKey] += order.total;
            } else {
                data[dateKey] = order.total;
            }
        });
        
        // Ordenar por fecha
        const sortedDates = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));
        
        sortedDates.forEach(date => {
            labels.push(date);
            values.push(data[date]);
        });
        
        return { labels, values };
    }
    
    function createSalesChart(data) {
        const ctx = document.getElementById('salesChart').getContext('2d');
        
        // Destruir gráfico existente si hay uno
        if (window.salesChart) {
            window.salesChart.destroy();
        }
        
        // Crear nuevo gráfico
        window.salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Ventas ($)',
                    data: data.values,
                    backgroundColor: 'rgba(231, 76, 60, 0.7)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '$' + context.raw.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }
});