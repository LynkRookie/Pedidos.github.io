document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = [];
    const cartButton = document.getElementById('cartButton');
    const cartDropdown = document.getElementById('cartDropdown');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutButton = document.getElementById('checkoutButton');
    
    // Menu filtering
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Modals
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmationModal = document.getElementById('closeConfirmationModal');
    
    // Checkout form elements
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutTip = document.getElementById('checkoutTip');
    const tipContainer = document.getElementById('tipContainer');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutTipAmount = document.getElementById('checkoutTipAmount');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const orderNumber = document.getElementById('orderNumber');
    
    // Toggle cart dropdown
    cartButton.addEventListener('click', function(e) {
        e.stopPropagation();
        cartDropdown.classList.toggle('hidden');
        cartDropdown.classList.toggle('show');
    });
    
    // Close cart dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!cartDropdown.contains(e.target) && e.target !== cartButton) {
            cartDropdown.classList.add('hidden');
            cartDropdown.classList.remove('show');
        }
    });
    
    // Menu filtering
    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove('active-tab'));
            
            // Add active class to clicked tab
            tab.classList.add('active-tab');
            
            const category = tab.getAttribute('data-category');
            
            // Show/hide menu items based on category
            menuItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image');
            
            // Check if item is already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Show notification
            showNotification(`${name} añadido al carrito`);
        });
    });
    
    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Tu carrito está vacío</p>';
            checkoutButton.disabled = true;
        } else {
            cartItems.innerHTML = '';
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'flex items-center py-2 border-b cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-md mr-3">
                    <div class="flex-1">
                        <h4 class="text-sm font-medium text-gray-800">${item.name}</h4>
                        <div class="flex items-center mt-1">
                            <button class="decrease-quantity text-xs bg-gray-200 px-2 py-1 rounded" data-id="${item.id}">-</button>
                            <span class="text-xs mx-2">${item.quantity}</span>
                            <button class="increase-quantity text-xs bg-gray-200 px-2 py-1 rounded" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-medium text-gray-800">$${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="remove-item text-xs text-red-500 mt-1" data-id="${item.id}">Eliminar</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = button.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        cart = cart.filter(item => item.id !== id);
                    }
                    updateCart();
                    e.stopPropagation();
                });
            });
            
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = button.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    item.quantity += 1;
                    updateCart();
                    e.stopPropagation();
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = button.getAttribute('data-id');
                    cart = cart.filter(item => item.id !== id);
                    updateCart();
                    e.stopPropagation();
                });
            });
            
            checkoutButton.disabled = false;
        }
        
        // Update cart total
        const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-y-20';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('translate-y-20');
        }, 100);
        
        setTimeout(() => {
            notification.classList.add('translate-y-20');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Checkout button
    checkoutButton.addEventListener('click', () => {
        // If user is not logged in, show login modal
        // For demo purposes, we'll just show the checkout modal
        checkoutModal.classList.remove('hidden');
        
        // Update checkout form with cart total
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        checkoutTotal.textContent = `$${subtotal.toFixed(2)}`;
        
        // Close cart dropdown
        cartDropdown.classList.add('hidden');
        cartDropdown.classList.remove('show');
    });
    
    // Tip checkbox
    checkoutTip.addEventListener('change', () => {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tipAmount = checkoutTip.checked ? subtotal * 0.1 : 0;
        const total = subtotal + tipAmount;
        
        if (checkoutTip.checked) {
            tipContainer.classList.remove('hidden');
            checkoutTipAmount.textContent = `$${tipAmount.toFixed(2)}`;
        } else {
            tipContainer.classList.add('hidden');
        }
        
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
    });
    
    // Checkout form submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide checkout modal
        checkoutModal.classList.add('hidden');
        
        // Show confirmation modal
        confirmationModal.classList.remove('hidden');
        
        // Generate random order number
        const randomOrderNum = Math.floor(10000 + Math.random() * 90000);
        orderNumber.textContent = `#${randomOrderNum}`;
        
        // Clear cart
        cart = [];
        updateCart();
    });
    
    // Modal close buttons
    closeLoginModal.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });
    
    closeCheckoutModal.addEventListener('click', () => {
        checkoutModal.classList.add('hidden');
    });
    
    closeConfirmationModal.addEventListener('click', () => {
        confirmationModal.classList.add('hidden');
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add('hidden');
        }
        if (e.target === checkoutModal) {
            checkoutModal.classList.add('hidden');
        }
        if (e.target === confirmationModal) {
            confirmationModal.classList.add('hidden');
        }
    });
});
