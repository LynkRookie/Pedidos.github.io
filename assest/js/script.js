// Inicialización de datos
function initializeData() {
    // Verificar si ya existen datos en localStorage
    if (!localStorage.getItem('users')) {
        // Crear usuarios predeterminados
        const defaultUsers = [
            {
                id: 1,
                name: 'Administrador',
                email: 'admin@sushiexpress.com',
                phone: '123456789',
                address: 'Calle Principal 123',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Vendedor',
                email: 'vendedor@sushiexpress.com',
                phone: '987654321',
                address: 'Avenida Central 456',
                password: 'vendedor123',
                role: 'vendor',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }

    if (!localStorage.getItem('menuItems')) {
        // Crear menú predeterminado
        const defaultMenu = [
            {
                id: 1,
                name: 'California Roll',
                description: 'Cangrejo, aguacate y pepino',
                price: 8.50,
                category: 'Rolls Tradicionales'
            },
            {
                id: 2,
                name: 'Spicy Tuna Roll',
                description: 'Atún picante y aguacate',
                price: 9.50,
                category: 'Rolls Tradicionales'
            },
            {
                id: 3,
                name: 'Philadelphia Roll',
                description: 'Salmón, queso crema y aguacate',
                price: 10.50,
                category: 'Rolls Tradicionales'
            },
            {
                id: 4,
                name: 'Dragon Roll',
                description: 'Anguila, aguacate y pepino',
                price: 12.50,
                category: 'Rolls Especiales'
            },
            {
                id: 5,
                name: 'Rainbow Roll',
                description: 'Variedad de pescados sobre California Roll',
                price: 13.50,
                category: 'Rolls Especiales'
            }
        ];
        localStorage.setItem('menuItems', JSON.stringify(defaultMenu));
    }

    if (!localStorage.getItem('userActivity')) {
        localStorage.setItem('userActivity', JSON.stringify([]));
    }
}

// Inicializar datos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    
    // Mostrar sección de login por defecto
    document.getElementById('loginSection').classList.add('active');
    document.getElementById('registerSection').classList.remove('active');
    
    // Eventos para cambiar entre login y registro
    document.getElementById('showRegister').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('loginSection').classList.remove('active');
        document.getElementById('registerSection').classList.add('active');
    });
    
    document.getElementById('showLogin').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('loginSection').classList.add('active');
        document.getElementById('registerSection').classList.remove('active');
    });
    
    // Evento para el formulario de login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Obtener usuarios del localStorage
        const users = JSON.parse(localStorage.getItem('users'));
        
        // Buscar usuario por email y contraseña
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Registrar actividad de inicio de sesión
            const userActivity = JSON.parse(localStorage.getItem('userActivity')) || [];
            userActivity.push({
                userId: user.id,
                action: 'login',
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('userActivity', JSON.stringify(userActivity));
            
            // Guardar información del usuario en sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirigir según el rol del usuario
            switch(user.role) {
                case 'admin':
                    window.location.href = 'admin-dashboard.html';
                    break;
                case 'vendor':
                    window.location.href = 'vendor-dashboard.html';
                    break;
                default:
                    window.location.href = 'user-dashboard.html';
                    break;
            }
        } else {
            alert('Correo electrónico o contraseña incorrectos');
        }
    });
    
    // Evento para el formulario de registro
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const address = document.getElementById('registerAddress').value;
        const password = document.getElementById('registerPassword').value;
        
        // Obtener usuarios del localStorage
        const users = JSON.parse(localStorage.getItem('users'));
        
        // Verificar si el email ya está registrado
        if (users.some(u => u.email === email)) {
            alert('Este correo electrónico ya está registrado');
            return;
        }
        
        // Crear nuevo usuario
        const newUser = {
            id: users.length + 1,
            name,
            email,
            phone,
            address,
            password,
            role: 'user', // Por defecto, todos los registros nuevos son usuarios normales
            createdAt: new Date().toISOString()
        };
        
        // Agregar nuevo usuario a la lista
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Registrar actividad de registro
        const userActivity = JSON.parse(localStorage.getItem('userActivity')) || [];
        userActivity.push({
            userId: newUser.id,
            action: 'register',
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('userActivity', JSON.stringify(userActivity));
        
        // Guardar información del usuario en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Redirigir al dashboard de usuario
        window.location.href = 'user-dashboard.html';
    });
});