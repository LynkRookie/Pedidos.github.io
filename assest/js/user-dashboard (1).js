document.addEventListener("DOMContentLoaded", () => {
  // Sidebar navigation links
  const sidebarLinks = document.querySelectorAll(".sidebar-link")

  // User profile button
  const userProfileBtn = document.querySelector(".relative.group > button")

  // Content sections
  let showMyOrdersSection = false
  let showFavoritesSection = false
  let showAddressesSection = false
  let showPaymentMethodsSection = false
  const showOrderDetailsModal = false

  // Handle sidebar navigation
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all links
      sidebarLinks.forEach((l) => l.classList.remove("active", "bg-purple-100", "text-purple-800"))

      // Add active class to clicked link
      this.classList.add("active", "bg-purple-100", "text-purple-800")

      // Get the link text to determine which section to show
      const linkText = this.querySelector("span").textContent.trim()

      // Show appropriate content based on link clicked
      switch (linkText) {
        case "Inicio":
          showHomeSection()
          break
        case "Mis Pedidos":
          showMyOrdersSection = true
          showMyOrders()
          break
        case "Favoritos":
          showFavoritesSection = true
          showFavorites()
          break
        case "Direcciones":
          showAddressesSection = true
          showAddresses()
          break
        case "Métodos de Pago":
          showPaymentMethodsSection = true
          showPaymentMethods()
          break
      }
    })
  })

  // Highlight home button by default
  const homeLink = Array.from(sidebarLinks).find((link) => link.querySelector("span").textContent.trim() === "Inicio")
  if (homeLink) {
    homeLink.classList.add("active", "bg-purple-100", "text-purple-800")
  }

  // Handle user profile button
  if (userProfileBtn) {
    userProfileBtn.addEventListener("click", function (e) {
      const dropdown = this.nextElementSibling
      dropdown.classList.toggle("hidden")
    })

    // Modify dropdown menu to only show "Editar Perfil"
    const dropdownMenu = userProfileBtn.nextElementSibling
    if (dropdownMenu) {
      // Keep only the first item (Edit Profile) and remove others
      const editProfileLink = dropdownMenu.querySelector("a:first-child")
      if (editProfileLink) {
        // Clear the dropdown and add only the edit profile option
        dropdownMenu.innerHTML = ""
        dropdownMenu.appendChild(editProfileLink)

        // Update the edit profile link text and icon
        editProfileLink.innerHTML = '<i class="fas fa-user-edit mr-2"></i> Editar Perfil'

        // Add event listener to edit profile link
        editProfileLink.addEventListener("click", (e) => {
          e.preventDefault()
          showEditProfileSection()
        })
      }
    }
  }

  // Add event listeners to "Order Again" buttons
  const orderAgainButtons = document.querySelectorAll(".order-again-btn")
  orderAgainButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const orderRow = this.closest(".order-card")
      const orderId = orderRow.dataset.orderId
      showReorderForm(orderId)
    })
  })

  // Function to show home section
  function showHomeSection() {
    // Reset all section flags
    showMyOrdersSection = false
    showFavoritesSection = false
    showAddressesSection = false
    showPaymentMethodsSection = false

    // Show home content (already visible by default)
    const mainContent = document.querySelector("main")
    if (mainContent.dataset.dashboardContent) {
      mainContent.innerHTML = mainContent.dataset.dashboardContent
    }

    // Re-attach event listeners to the home content
    attachHomeEventListeners()
  }

  // Function to attach event listeners to home content
  function attachHomeEventListeners() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll(".add-to-cart")
    addToCartButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const productCard = this.closest(".product-card")
        const productName = productCard.querySelector("h3").textContent
        showNotification(`${productName} añadido al carrito`)
      })
    })

    // Favorite buttons
    const favoriteButtons = document.querySelectorAll(".favorite-btn")
    favoriteButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        this.classList.toggle("text-red-500")
        this.classList.toggle("text-gray-400")

        const isFavorite = this.classList.contains("text-red-500")
        const productCard = this.closest(".product-card")
        const productName = productCard.querySelector("h3").textContent

        if (isFavorite) {
          showNotification(`${productName} añadido a favoritos`)
        } else {
          showNotification(`${productName} eliminado de favoritos`)
        }
      })
    })
  }

  // Function to show my orders section
  function showMyOrders() {
    // Create my orders section content
    const mainContent = document.querySelector("main")
    const currentContent = mainContent.innerHTML

    // Save current content to restore later if needed
    if (!mainContent.dataset.dashboardContent) {
      mainContent.dataset.dashboardContent = currentContent
    }

    // Replace with my orders section
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Mis Pedidos</h1>
        <p class="text-gray-600">Historial de todos tus pedidos.</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Pedidos Recientes</h2>
          <div class="flex space-x-2">
            <select class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
              <option>Todos los pedidos</option>
              <option>Último mes</option>
              <option>Últimos 3 meses</option>
              <option>Último año</option>
            </select>
          </div>
        </div>
        
        <div class="space-y-6">
          <div class="order-card border rounded-lg overflow-hidden" data-order-id="ORD-12345">
            <div class="bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <span class="text-sm text-gray-500">Pedido #ORD-12345</span>
                <p class="font-medium">23 Abril, 2023</p>
              </div>
              <div>
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
              </div>
            </div>
            <div class="p-4 border-t">
              <div class="flex items-center mb-4">
                <img src="/placeholder.svg?height=50&width=50&text=Pizza" alt="Producto" class="h-12 w-12 rounded mr-3 object-cover">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-800">Pizza Pepperoni</h4>
                  <p class="text-gray-600 text-sm">Cantidad: 1</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-800">$13.99</p>
                </div>
              </div>
              <div class="flex items-center mb-4">
                <img src="/placeholder.svg?height=50&width=50&text=Sushi" alt="Producto" class="h-12 w-12 rounded mr-3 object-cover">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-800">California Roll</h4>
                  <p class="text-gray-600 text-sm">Cantidad: 2</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-800">$17.98</p>
                </div>
              </div>
              <div class="flex items-center">
                <img src="/placeholder.svg?height=50&width=50&text=Mojito" alt="Producto" class="h-12 w-12 rounded mr-3 object-cover">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-800">Mojito</h4>
                  <p class="text-gray-600 text-sm">Cantidad: 1</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-800">$6.99</p>
                </div>
              </div>
              <div class="border-t mt-4 pt-4 flex justify-between items-center">
                <div>
                  <p class="text-gray-600">Total: <span class="font-bold text-gray-800">$38.96</span></p>
                </div>
                <div class="flex space-x-2">
                  <button class="view-order-btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-300">
                    Ver Detalles
                  </button>
                  <button class="order-again-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                    Pedir de Nuevo
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="order-card border rounded-lg overflow-hidden" data-order-id="ORD-12346">
            <div class="bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <span class="text-sm text-gray-500">Pedido #ORD-12346</span>
                <p class="font-medium">20 Abril, 2023</p>
              </div>
              <div>
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
              </div>
            </div>
            <div class="p-4 border-t">
              <div class="flex items-center mb-4">
                <img src="/placeholder.svg?height=50&width=50&text=Sushi" alt="Producto" class="h-12 w-12 rounded mr-3 object-cover">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-800">Dragon Roll</h4>
                  <p class="text-gray-600 text-sm">Cantidad: 1</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-800">$12.99</p>
                </div>
              </div>
              <div class="flex items-center">
                <img src="/placeholder.svg?height=50&width=50&text=Limonada" alt="Producto" class="h-12 w-12 rounded mr-3 object-cover">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-800">Limonada</h4>
                  <p class="text-gray-600 text-sm">Cantidad: 1</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-800">$4.99</p>
                </div>
              </div>
              <div class="border-t mt-4 pt-4 flex justify-between items-center">
                <div>
                  <p class="text-gray-600">Total: <span class="font-bold text-gray-800">$17.98</span></p>
                </div>
                <div class="flex space-x-2">
                  <button class="view-order-btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-300">
                    Ver Detalles
                  </button>
                  <button class="order-again-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                    Pedir de Nuevo
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="order-card border rounded-lg overflow-hidden" data-order-id="ORD-12347">
            <div class="bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <span class="text-sm text-gray-500">Pedido #ORD-12347</span>
                <p class="font-medium">15 Abril, 2023</p>
              </div>
              <div>
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
              </div>
            </div>
            <div class="p-4 border-t">
              <div class="flex items-center">
                <img src="/placeholder.svg?height=50&width=50&text=Pizza" alt="Producto" class="h-12 w-12 rounded mr-3 object-cover">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-800">Pizza Hawaiana</h4>
                  <p class="text-gray-600 text-sm">Cantidad: 1</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-800">$12.99</p>
                </div>
              </div>
              <div class="border-t mt-4 pt-4 flex justify-between items-center">
                <div>
                  <p class="text-gray-600">Total: <span class="font-bold text-gray-800">$12.99</span></p>
                </div>
                <div class="flex space-x-2">
                  <button class="view-order-btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-300">
                    Ver Detalles
                  </button>
                  <button class="order-again-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                    Pedir de Nuevo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    // Add event listeners to the new content
    const viewOrderButtons = mainContent.querySelectorAll(".view-order-btn")
    viewOrderButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderCard = this.closest(".order-card")
        const orderId = orderCard.dataset.orderId
        showOrderDetails(orderId)
      })
    })

    const orderAgainButtons = mainContent.querySelectorAll(".order-again-btn")
    orderAgainButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderCard = this.closest(".order-card")
        const orderId = orderCard.dataset.orderId
        showReorderForm(orderId)
      })
    })

    const filterSelect = mainContent.querySelector("select")
    if (filterSelect) {
      filterSelect.addEventListener("change", function () {
        showNotification(`Filtrando pedidos: ${this.value}`)
      })
    }
  }

  // Function to show order details
  function showOrderDetails(orderId) {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-2xl w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Detalles del Pedido ${orderId}</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="font-bold text-gray-800 mb-2">Información de Entrega</h3>
            <p class="text-gray-600"><span class="font-medium">Dirección:</span> Calle Principal 123, Santiago</p>
            <p class="text-gray-600"><span class="font-medium">Teléfono:</span> +56 9 1234 5678</p>
            <p class="text-gray-600"><span class="font-medium">Instrucciones:</span> Dejar en la puerta principal</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-800 mb-2">Información del Pedido</h3>
            <p class="text-gray-600"><span class="font-medium">Fecha:</span> 23/04/2023, 10:23 AM</p>
            <p class="text-gray-600"><span class="font-medium">Estado:</span> <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span></p>
            <p class="text-gray-600"><span class="font-medium">Método de Pago:</span> Tarjeta de Crédito</p>
            <p class="text-gray-600"><span class="font-medium">Vendedor:</span> Carlos Rodríguez</p>
          </div>
        </div>
        
        <h3 class="font-bold text-gray-800 mb-2">Productos</h3>
        <div class="border rounded-lg overflow-hidden mb-6">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Producto</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Precio</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Cantidad</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=Pizza" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
                    <span class="text-gray-800">Pizza Pepperoni</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">$13.99</td>
                <td class="py-3 px-4 text-gray-600">1</td>
                <td class="py-3 px-4 text-gray-800">$13.99</td>
              </tr>
              <tr class="border-t">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=Sushi" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
                    <span class="text-gray-800">California Roll</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">$8.99</td>
                <td class="py-3 px-4 text-gray-600">2</td>
                <td class="py-3 px-4 text-gray-800">$17.98</td>
              </tr>
              <tr class="border-t">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=Mojito" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
                    <span class="text-gray-800">Mojito</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">$6.99</td>
                <td class="py-3 px-4 text-gray-600">1</td>
                <td class="py-3 px-4 text-gray-800">$6.99</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="flex justify-between items-start mb-6">
          <div>
            <p class="text-gray-600"><span class="font-medium">Notas:</span> Entregar en la puerta principal. No tocar el timbre.</p>
          </div>
          <div class="text-right">
            <p class="text-gray-600">Subtotal: <span class="font-medium">$38.96</span></p>
            <p class="text-gray-600">Envío: <span class="font-medium">$2.99</span></p>
            <p class="text-gray-600">Propina: <span class="font-medium">$3.90</span></p>
            <p class="text-gray-800 font-bold text-lg">Total: <span>$45.85</span></p>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
            Cerrar
          </button>
          <button class="order-again-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            Pedir de Nuevo
          </button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listeners to modal buttons
    const closeButtons = modal.querySelectorAll(".close-modal")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.body.removeChild(modal)
      })
    })

    // Add event listener to "Order Again" button
    const orderAgainBtn = modal.querySelector(".order-again-btn")
    if (orderAgainBtn) {
      orderAgainBtn.addEventListener("click", () => {
        document.body.removeChild(modal)
        showReorderForm(orderId)
      })
    }

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show reorder form
  function showReorderForm(orderId) {
    // Get order data (in a real app, this would come from an API)
    const orderData = {
      address: "Calle Principal 123, Santiago",
      phone: "+56 9 1234 5678",
      items: [
        { id: 1, name: "Pizza Pepperoni", price: 13.99, quantity: 1 },
        { id: 2, name: "California Roll", price: 8.99, quantity: 2 },
        { id: 3, name: "Mojito", price: 6.99, quantity: 1 },
      ],
    }

    // Calculate subtotal
    const subtotal = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = 2.99

    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-2xl w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Pedir de Nuevo</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form id="reorderForm">
          <div class="mb-6">
            <h3 class="font-bold text-gray-800 mb-2">Dirección de Entrega</h3>
            <input type="text" id="address" value="${orderData.address}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mb-3">
            
            <h3 class="font-bold text-gray-800 mb-2">Teléfono de Contacto</h3>
            <input type="tel" id="phone" value="${orderData.phone}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="mb-6">
            <h3 class="font-bold text-gray-800 mb-2">Productos</h3>
            <div class="border rounded-lg overflow-hidden">
              <table class="min-w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left py-3 px-4 text-gray-600 font-medium">Producto</th>
                    <th class="text-left py-3 px-4 text-gray-600 font-medium">Precio</th>
                    <th class="text-left py-3 px-4 text-gray-600 font-medium">Cantidad</th>
                    <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderData.items
                    .map(
                      (item) => `
                    <tr class="border-t">
                      <td class="py-3 px-4">
                        <div class="flex items-center">
                          <img src="/placeholder.svg?height=30&width=30&text=${encodeURIComponent(item.name)}" alt="${item.name}" class="h-10 w-10 rounded mr-3 object-cover">
                          <span class="text-gray-800">${item.name}</span>
                        </div>
                      </td>
                      <td class="py-3 px-4 text-gray-600">$${item.price.toFixed(2)}</td>
                      <td class="py-3 px-4 text-gray-600">${item.quantity}</td>
                      <td class="py-3 px-4 text-gray-800">$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="font-bold text-gray-800 mb-2">Método de Pago</h3>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="radio" name="payment" value="credit" class="mr-2" checked>
                <span>Tarjeta de Crédito</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="payment" value="debit" class="mr-2">
                <span>Tarjeta de Débito</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="payment" value="cash" class="mr-2">
                <span>Efectivo</span>
              </label>
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="font-bold text-gray-800 mb-2">Propina</h3>
            <div class="flex space-x-2">
              <button type="button" class="tip-btn px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" data-tip="0">
                Sin propina
              </button>
              <button type="button" class="tip-btn px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" data-tip="5">
                5% ($${(subtotal * 0.05).toFixed(2)})
              </button>
              <button type="button" class="tip-btn px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" data-tip="10">
                10% ($${(subtotal * 0.1).toFixed(2)})
              </button>
              <button type="button" class="tip-btn px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" data-tip="15">
                15% ($${(subtotal * 0.15).toFixed(2)})
              </button>
            </div>
            <input type="hidden" id="tipAmount" value="0">
          </div>
          
          <div class="flex justify-between items-start mb-6">
            <div></div>
            <div class="text-right">
              <p class="text-gray-600">Subtotal: <span class="font-medium">$${subtotal.toFixed(2)}</span></p>
              <p class="text-gray-600">Envío: <span class="font-medium">$${shipping.toFixed(2)}</span></p>
              <p class="text-gray-600">Propina: <span class="font-medium tip-display">$0.00</span></p>
              <p class="text-gray-800 font-bold text-lg">Total: <span class="total-display">$${(subtotal + shipping).toFixed(2)}</span></p>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button type="button" class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
              Cancelar
            </button>
            <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              Confirmar Pedido
            </button>
          </div>
        </form>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listeners to modal buttons
    const closeButtons = modal.querySelectorAll(".close-modal")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.body.removeChild(modal)
      })
    })

    // Add event listeners to tip buttons
    const tipButtons = modal.querySelectorAll(".tip-btn")
    const tipDisplay = modal.querySelector(".tip-display")
    const totalDisplay = modal.querySelector(".total-display")
    const tipAmountInput = modal.querySelector("#tipAmount")

    tipButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all tip buttons
        tipButtons.forEach((b) => b.classList.remove("bg-purple-100", "border-purple-500"))

        // Add active class to clicked button
        this.classList.add("bg-purple-100", "border-purple-500")

        // Get tip percentage
        const tipPercentage = Number.parseInt(this.dataset.tip) / 100

        // Calculate tip amount
        const tipAmount = subtotal * tipPercentage

        // Update tip display
        tipDisplay.textContent = `$${tipAmount.toFixed(2)}`

        // Update total
        totalDisplay.textContent = `$${(subtotal + shipping + tipAmount).toFixed(2)}`

        // Update hidden input
        tipAmountInput.value = tipAmount.toFixed(2)
      })
    })

    // Add event listener to form submission
    const reorderForm = modal.querySelector("#reorderForm")
    reorderForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const address = document.getElementById("address").value
      const phone = document.getElementById("phone").value
      const paymentMethod = document.querySelector('input[name="payment"]:checked').value
      const tipAmount = document.getElementById("tipAmount").value

      // Show notification
      showNotification("¡Pedido realizado con éxito!")

      // Close modal
      document.body.removeChild(modal)
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show favorites section
  function showFavorites() {
    // Create favorites section content
    const mainContent = document.querySelector("main")
    const currentContent = mainContent.innerHTML

    // Save current content to restore later if needed
    if (!mainContent.dataset.dashboardContent) {
      mainContent.dataset.dashboardContent = currentContent
    }

    // Replace with favorites section
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Mis Favoritos</h1>
        <p class="text-gray-600">Productos que has marcado como favoritos.</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="border rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=California+Roll" alt="California Roll" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">California Roll</h3>
                <div class="flex items-center">
                  <button class="favorite-btn text-red-500 mr-2">
                    <i class="fas fa-heart"></i>
                  </button>
                  <span class="text-purple-600 font-bold">$8.99</span>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-3">Delicioso roll con aguacate, pepino y cangrejo.</p>
              <button class="add-to-cart w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Añadir al Carrito
              </button>
            </div>
          </div>
          
          <div class="border rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Pizza+Pepperoni" alt="Pizza Pepperoni" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Pizza Pepperoni</h3>
                <div class="flex items-center">
                  <button class="favorite-btn text-red-500 mr-2">
                    <i class="fas fa-heart"></i>
                  </button>
                  <span class="text-purple-600 font-bold">$13.99</span>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-3">Deliciosa pizza con abundante pepperoni y queso mozzarella.</p>
              <button class="add-to-cart w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Añadir al Carrito
              </button>
            </div>
          </div>
          
          <div class="border rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Mojito" alt="Mojito" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Mojito</h3>
                <div class="flex items-center">
                  <button class="favorite-btn text-red-500 mr-2">
                    <i class="fas fa-heart"></i>
                  </button>
                  <span class="text-purple-600 font-bold">$6.99</span>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-3">Clásico cóctel con ron, lima, menta y azúcar.</p>
              <button class="add-to-cart w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    `

    // Add event listeners to the new content
    const favoriteButtons = mainContent.querySelectorAll(".favorite-btn")
    favoriteButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        this.classList.toggle("text-red-500")
        this.classList.toggle("text-gray-400")

        const isFavorite = this.classList.contains("text-red-500")
        const productCard = this.closest("div.border")
        const productName = productCard.querySelector("h3").textContent

        if (isFavorite) {
          showNotification(`${productName} añadido a favoritos`)
        } else {
          showNotification(`${productName} eliminado de favoritos`)

          // Animate removal
          productCard.style.transition = "all 0.5s ease"
          productCard.style.opacity = "0"
          productCard.style.transform = "scale(0.8)"

          setTimeout(() => {
            productCard.remove()

            // Check if there are no more favorites
            const remainingFavorites = mainContent.querySelectorAll(".border.rounded-lg")
            if (remainingFavorites.length === 0) {
              const favoritesContainer = mainContent.querySelector(".bg-white.rounded-xl")
              favoritesContainer.innerHTML = `
                <div class="text-center py-8">
                  <i class="fas fa-heart text-gray-300 text-5xl mb-4"></i>
                  <h3 class="text-xl font-bold text-gray-800 mb-2">No tienes favoritos</h3>
                  <p class="text-gray-600">Explora nuestro menú y marca tus productos favoritos</p>
                </div>
              `
            }
          }, 500)
        }
      })
    })

    const addToCartButtons = mainContent.querySelectorAll(".add-to-cart")
    addToCartButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const productCard = this.closest("div.border")
        const productName = productCard.querySelector("h3").textContent
        showNotification(`${productName} añadido al carrito`)
      })
    })
  }

  // Function to show addresses section
  function showAddresses() {
    // Create addresses section content
    const mainContent = document.querySelector("main")
    const currentContent = mainContent.innerHTML

    // Save current content to restore later if needed
    if (!mainContent.dataset.dashboardContent) {
      mainContent.dataset.dashboardContent = currentContent
    }

    // Replace with addresses section
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Mis Direcciones</h1>
        <p class="text-gray-600">Administra tus direcciones de entrega.</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Direcciones Guardadas</h2>
          <button class="add-address-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
            <i class="fas fa-plus mr-2"></i> Nueva Dirección
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="border rounded-lg p-4 relative">
            <div class="absolute top-4 right-4 flex space-x-2">
              <button class="edit-address-btn text-blue-600 hover:text-blue-800">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-address-btn text-red-600 hover:text-red-800">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Casa</h3>
            <p class="text-gray-600 mb-1">Calle Principal 123</p>
            <p class="text-gray-600 mb-1">Santiago, Chile</p>
            <p class="text-gray-600 mb-3">+56 9 1234 5678</p>
            <div class="flex items-center">
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Predeterminada</span>
            </div>
          </div>
          
          <div class="border rounded-lg p-4 relative">
            <div class="absolute top-4 right-4 flex space-x-2">
              <button class="edit-address-btn text-blue-600 hover:text-blue-800">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-address-btn text-red-600 hover:text-red-800">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Trabajo</h3>
            <p class="text-gray-600 mb-1">Av. Providencia 1500</p>
            <p class="text-gray-600 mb-1">Santiago, Chile</p>
            <p class="text-gray-600 mb-3">+56 9 8765 4321</p>
            <div class="flex items-center">
              <button class="set-default-btn text-purple-600 text-sm hover:text-purple-800">
                Establecer como predeterminada
              </button>
            </div>
          </div>
        </div>
      </div>
    `

    // Add event listeners to the new content
    const addAddressBtn = mainContent.querySelector(".add-address-btn")
    if (addAddressBtn) {
      addAddressBtn.addEventListener("click", () => {
        showAddAddressForm()
      })
    }

    const editAddressBtns = mainContent.querySelectorAll(".edit-address-btn")
    editAddressBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const addressCard = this.closest(".border")
        const addressName = addressCard.querySelector("h3").textContent
        showEditAddressForm(addressName)
      })
    })

    const deleteAddressBtns = mainContent.querySelectorAll(".delete-address-btn")
    deleteAddressBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const addressCard = this.closest(".border")
        const addressName = addressCard.querySelector("h3").textContent
        showDeleteAddressConfirmation(addressName, addressCard)
      })
    })

    const setDefaultBtns = mainContent.querySelectorAll(".set-default-btn")
    setDefaultBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const addressCard = this.closest(".border")
        const addressName = addressCard.querySelector("h3").textContent

        // Remove default badge from all addresses
        const defaultBadges = mainContent.querySelectorAll(".bg-green-100.text-green-800")
        defaultBadges.forEach((badge) => {
          const parentCard = badge.closest(".border")
          badge.parentNode.innerHTML = `
            <button class="set-default-btn text-purple-600 text-sm hover:text-purple-800">
              Establecer como predeterminada
            </button>
          `

          // Re-attach event listener
          parentCard.querySelector(".set-default-btn").addEventListener("click", () => {
            const name = parentCard.querySelector("h3").textContent
            setAddressAsDefault(name, parentCard)
          })
        })

        // Set this address as default
        setAddressAsDefault(addressName, addressCard)
      })
    })
  }

  // Function to set address as default
  function setAddressAsDefault(addressName, addressCard) {
    // Replace the "Set as default" button with the default badge
    const buttonContainer = addressCard.querySelector(".set-default-btn").parentNode
    buttonContainer.innerHTML = `
      <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Predeterminada</span>
    `

    showNotification(`${addressName} establecida como dirección predeterminada`)
  }

  // Function to show add address form
  function showAddAddressForm() {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Añadir Nueva Dirección</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form id="addAddressForm">
          <div class="mb-4">
            <label for="addressName" class="block text-gray-700 font-medium mb-2">Nombre de la dirección</label>
            <input type="text" id="addressName" placeholder="Ej: Casa, Trabajo, etc." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="mb-4">
            <label for="street" class="block text-gray-700 font-medium mb-2">Calle y número</label>
            <input type="text" id="street" placeholder="Ej: Calle Principal 123" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="mb-4">
            <label for="city" class="block text-gray-700 font-medium mb-2">Ciudad</label>
            <input type="text" id="city" placeholder="Ej: Santiago" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="mb-4">
            <label for="phone" class="block text-gray-700 font-medium mb-2">Teléfono</label>
            <input type="tel" id="phone" placeholder="Ej: +56 9 1234 5678" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="mb-4">
            <label for="instructions" class="block text-gray-700 font-medium mb-2">Instrucciones de entrega (opcional)</label>
            <textarea id="instructions" rows="2" placeholder="Ej: Dejar en la puerta principal" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"></textarea>
          </div>
          
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" id="setAsDefault" class="mr-2">
              <span>Establecer como dirección predeterminada</span>
            </label>
          </div>
          
          <div class="flex justify-end">
            <button type="button" class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
              Cancelar
            </button>
            <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              Guardar
            </button>
          </div>
        </form>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listeners to modal buttons
    const closeButtons = modal.querySelectorAll(".close-modal")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.body.removeChild(modal)
      })
    })

    // Add event listener to form submission
    const addAddressForm = modal.querySelector("#addAddressForm")
    addAddressForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const addressName = document.getElementById("addressName").value

      // Show notification
      showNotification(`Dirección "${addressName}" añadida correctamente`)

      // Close modal
      document.body.removeChild(modal)

      // Refresh addresses section
      showAddresses()
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show edit address form
  function showEditAddressForm(addressName) {
    // Create modal with pre-filled data
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Editar Dirección</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form id="editAddressForm">
          <div class="mb-4">
            <label for="addressName" class="block text-gray-700 font-medium mb-2">Nombre de la dirección</label>
            <input type="text" id="addressName" value="${addressName}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="mb-4">
            <label for="street" class="block text-gray-700 font-medium mb-2">Calle y número</label>
            <input type="text" id="street" value="${addressName === "Casa" ? "Calle Principal 123" : "Av. Providencia 1500"}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="mb-4">
            <label for="city" class="block text-gray-700 font-medium mb-2">Ciudad</label>
            <input type="text" id="city" value="Santiago, Chile" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="mb-4">
            <label for="phone" class="block text-gray-700 font-medium mb-2">Teléfono</label>
            <input type="tel" id="phone" value="${addressName === "Casa" ? "+56 9 1234 5678" : "+56 9 8765 4321"}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="mb-4">
            <label for="instructions" class="block text-gray-700 font-medium mb-2">Instrucciones de entrega (opcional)</label>
            <textarea id="instructions" rows="2" placeholder="Ej: Dejar en la puerta principal" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"></textarea>
          </div>
          
          <div class="flex justify-end">
            <button type="button" class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
              Cancelar
            </button>
            <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listeners to modal buttons
    const closeButtons = modal.querySelectorAll(".close-modal")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.body.removeChild(modal)
      })
    })

    // Add event listener to form submission
    const editAddressForm = modal.querySelector("#editAddressForm")
    editAddressForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const newAddressName = document.getElementById("addressName").value

      // Show notification
      showNotification(`Dirección actualizada correctamente`)

      // Close modal
      document.body.removeChild(modal)

      // Refresh addresses section
      showAddresses()
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show delete address confirmation
  function showDeleteAddressConfirmation(addressName, addressCard) {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Eliminar Dirección</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <p class="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar la dirección "${addressName}"? Esta acción no se puede deshacer.</p>
        
        <div class="flex justify-end">
          <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
            Cancelar
          </button>
          <button class="confirm-delete bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            Eliminar
          </button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listeners to modal buttons
    const closeButtons = modal.querySelectorAll(".close-modal")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.body.removeChild(modal)
      })
    })

    // Add event listener to confirm delete button
    const confirmDeleteBtn = modal.querySelector(".confirm-delete")
    confirmDeleteBtn.addEventListener("click", () => {
      // Show notification
      showNotification(`Dirección "${addressName}" eliminada correctamente`)

      // Close modal
      document.body.removeChild(modal)

      // Remove address card with animation
      addressCard.style.transition = "all 0.5s ease"
      addressCard.style.opacity = "0"
      addressCard.style.transform = "scale(0.8)"

      setTimeout(() => {
        addressCard.remove()

        // Check if there are no more addresses
        const remainingAddresses = document.querySelectorAll(".addresses-container .border")
        if (remainingAddresses.length === 0) {
          const addressesContainer = document.querySelector(".addresses-container")
          if (addressesContainer) {
            addressesContainer.innerHTML = `
              <div class="text-center py-8">
                <i class="fas fa-map-marker-alt text-gray-300 text-5xl mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800 mb-2">No tienes direcciones guardadas</h3>
                <p class="text-gray-600 mb-4">Añade una dirección para facilitar tus pedidos</p>
                <button class="add-address-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                  <i class="fas fa-plus mr-2"></i> Nueva Dirección
                </button>
              </div>
            `

            // Re-attach event listener
            const newAddAddressBtn = addressesContainer.querySelector(".add-address-btn")
            if (newAddAddressBtn) {
              newAddAddressBtn.addEventListener("click", showAddAddressForm)
            }
          }
        }
      }, 500)
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show payment methods section
  function showPaymentMethods() {
    // Create payment methods section content
    const mainContent = document.querySelector("main")
    const currentContent = mainContent.innerHTML

    // Save current content to restore later if needed
    if (!mainContent.dataset.dashboardContent) {
      mainContent.dataset.dashboardContent = currentContent
    }

    // Replace with payment methods section
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Métodos de Pago</h1>
        <p class="text-gray-600">Administra tus métodos de pago guardados.</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Tarjetas Guardadas</h2>
          <button class="add-payment-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
            <i class="fas fa-plus mr-2"></i> Nueva Tarjeta
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="border rounded-lg p-4 relative">
            <div class="absolute top-4 right-4 flex space-x-2">
              <button class="edit-payment-btn text-blue-600 hover:text-blue-800">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-payment-btn text-red-600 hover:text-red-800">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <div class="flex items-center mb-3">
              <i class="fab fa-cc-visa text-blue-600 text-2xl mr-2"></i>
              <div>
                <h3 class="font-bold text-gray-800">Visa terminada en 4567</h3>
                <p class="text-gray-600 text-sm">Expira: 05/2025</p>
              </div>
            </div>
            <div class="flex items-center">
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Predeterminada</span>
            </div>
          </div>
          
          <div class="border rounded-lg p-4 relative">
            <div class="absolute top-4 right-4 flex space-x-2">
              <button class="edit-payment-btn text-blue-600 hover:text-blue-800">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-payment-btn text-red-600 hover:text-red-800">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <div class="flex items-center mb-3">
              <i class="fab fa-cc-mastercard text-red-600 text-2xl mr-2"></i>
              <div>
                <h3 class="font-bold text-gray-800">Mastercard terminada en 8901</h3>
                <p class="text-gray-600 text-sm">Expira: 11/2024</p>
              </div>
            </div>
            <div class="flex items-center">
              <button class="set-default-payment-btn text-purple-600 text-sm hover:text-purple-800">
                Establecer como predeterminada
              </button>
            </div>
          </div>
        </div>
      </div>
    `

    // Add event listeners to the new content
    const addPaymentBtn = mainContent.querySelector(".add-payment-btn")
    if (addPaymentBtn) {
      addPaymentBtn.addEventListener("click", () => {
        showAddPaymentForm()
      })
    }

    const editPaymentBtns = mainContent.querySelectorAll(".edit-payment-btn")
    editPaymentBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const paymentCard = this.closest(".border")
        const paymentName = paymentCard.querySelector("h3").textContent
        showEditPaymentForm(paymentName)
      })
    })

    const deletePaymentBtns = mainContent.querySelectorAll(".delete-payment-btn")
    deletePaymentBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const paymentCard = this.closest(".border")
        const paymentName = paymentCard.querySelector("h3").textContent
        showDeletePaymentConfirmation(paymentName, paymentCard)
      })
    })

    const setDefaultBtns = mainContent.querySelectorAll(".set-default-payment-btn")
    setDefaultBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const paymentCard = this.closest(".border")
        const paymentName = paymentCard.querySelector("h3").textContent

        // Remove default badge from all payment methods
        const defaultBadges = mainContent.querySelectorAll(".bg-green-100.text-green-800")
        defaultBadges.forEach((badge) => {
          const parentCard = badge.closest(".border")
          badge.parentNode.innerHTML = `
            <button class="set-default-payment-btn text-purple-600 text-sm hover:text-purple-800">
              Establecer como predeterminada
            </button>
          `

          // Re-attach event listener
          parentCard.querySelector(".set-default-payment-btn").addEventListener("click", () => {
            const name = parentCard.querySelector("h3").textContent
            setPaymentAsDefault(name, parentCard)
          })
        })

        // Set this payment method as default
        setPaymentAsDefault(paymentName, paymentCard)
      })
    })
  }

  // Function to set payment method as default
  function setPaymentAsDefault(paymentName, paymentCard) {
    // Replace the "Set as default" button with the default badge
    const buttonContainer = paymentCard.querySelector(".set-default-payment-btn").parentNode
    buttonContainer.innerHTML = `
      <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Predeterminada</span>
    `

    showNotification(`${paymentName} establecida como método de pago predeterminado`)
  }

  // Function to show add payment form
  function showAddPaymentForm() {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Añadir Método de Pago</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form id="addPaymentForm">
          <div class="mb-4">
            <label for="cardNumber" class="block text-gray-700 font-medium mb-2">Número de Tarjeta</label>
            <input type="text" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="expiryDate" class="block text-gray-700 font-medium mb-2">Fecha de Expiración</label>
              <input type="text" id="expiryDate" placeholder="MM/AA" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
            </div>
            <div>
              <label for="cvv" class="block text-gray-700 font-medium mb-2">CVV</label>
              <input type="text" id="cvv" placeholder="XXX" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
            </div>
          </div>
          
          <div class="mb-4">
            <label for="cardholderName" class="block text-gray-700 font-medium mb-2">Nombre del Titular</label>
            <input type="text" id="cardholderName" placeholder="Como aparece en la tarjeta" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" id="setAsDefault" class="mr-2">
              <span>Establecer como método de pago predeterminado</span>
            </label>
          </div>
          
          <div class="flex justify-end">
            <button type="button" class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
              Cancelar
            </button>
            <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              Guardar
            </button>
          </div>
        </form>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listeners to modal buttons
    const closeButtons = modal.querySelectorAll(".close-modal")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.body.removeChild(modal)
      })
    })

    // Add event listener to form submission
    const addPaymentForm = modal.querySelector("#addPaymentForm")
    addPaymentForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show notification
      showNotification("Método de pago añadido correctamente")

      // Close modal
      document.body.removeChild(modal)

      // Refresh payment methods section
      showPaymentMethods()
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show edit payment form
  function showEditPaymentForm(paymentName) {
    // Create modal with pre-filled data
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Editar Método de Pago</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form id="editPaymentForm">
          <div class="mb-4">
            <label for="cardNumber" class="block text-gray-700 font-medium mb-2">Número de Tarjeta</label>
            <input type="text" id="cardNumber" value="**** **** **** ${paymentName.includes("4567") ? "4567" : "8901"}" disabled class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100">
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="expiryDate" class="block text-gray-700 font-medium mb-2">Fecha de Expiración</label>
              <input type="text" id="expiryDate" value="${paymentName.includes("Visa") ? "05/25" : "11/24"}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
            </div>
            <div>
              <label for="cvv" class="block text-gray-700 font-medium mb-2">CVV</label>
              <input type="text" id="cvv" value="***" disabled class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100">
            </div>
          </div>
          
          <div class="mb-4">
            <label for="cardholderName" class="block text-gray-700 font-medium mb-2">Nombre del Titular</label>
            <input type="text" id="cardholderName" value="Juan Pérez" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="flex justify-end">
            <button type="button" class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
              Cancelar
            </button>
            <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listeners to modal buttons
    const closeButtons = modal.querySelectorAll(".close-modal")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.body.removeChild(modal)
      })
    })

    // Add event listener to form submission
    const editPaymentForm = modal.querySelector("#editPaymentForm")
    editPaymentForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show notification
      showNotification("Método de pago actualizado correctamente")

      // Close modal
      document.body.removeChild(modal)

      // Refresh payment methods section
      showPaymentMethods()
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show delete payment confirmation
  function showDeletePaymentConfirmation(paymentName, paymentCard) {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Eliminar Método de Pago</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <p class="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar la tarjeta "${paymentName}"? Esta acción no se puede deshacer.</p>
        
        <div class="flex justify-end">
          <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
            Cancelar
          </button>
          <button class="confirm-delete bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            Eliminar
          </button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listeners to modal buttons
    const closeButtons = modal.querySelectorAll(".close-modal")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.body.removeChild(modal)
      })
    })

    // Add event listener to confirm delete button
    const confirmDeleteBtn = modal.querySelector(".confirm-delete")
    confirmDeleteBtn.addEventListener("click", () => {
      // Show notification
      showNotification(`Método de pago eliminado correctamente`)

      // Close modal
      document.body.removeChild(modal)

      // Remove payment card with animation
      paymentCard.style.transition = "all 0.5s ease"
      paymentCard.style.opacity = "0"
      paymentCard.style.transform = "scale(0.8)"

      setTimeout(() => {
        paymentCard.remove()

        // Check if there are no more payment methods
        const remainingPayments = document.querySelectorAll(".payment-methods-container .border")
        if (remainingPayments.length === 0) {
          const paymentsContainer = document.querySelector(".payment-methods-container")
          if (paymentsContainer) {
            paymentsContainer.innerHTML = `
              <div class="text-center py-8">
                <i class="fas fa-credit-card text-gray-300 text-5xl mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800 mb-2">No tienes métodos de pago guardados</h3>
                <p class="text-gray-600 mb-4">Añade un método de pago para facilitar tus pedidos</p>
                <button class="add-payment-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                  <i class="fas fa-plus mr-2"></i> Nuevo Método de Pago
                </button>
              </div>
            `

            // Re-attach event listener
            const newAddPaymentBtn = paymentsContainer.querySelector(".add-payment-btn")
            if (newAddPaymentBtn) {
              newAddPaymentBtn.addEventListener("click", showAddPaymentForm)
            }
          }
        }
      }, 500)
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show edit profile section
  function showEditProfileSection() {
    // Create edit profile section content
    const mainContent = document.querySelector("main")
    const currentContent = mainContent.innerHTML

    // Save current content to restore later if needed
    if (!mainContent.dataset.dashboardContent) {
      mainContent.dataset.dashboardContent = currentContent
    }

    // Replace with edit profile section
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Editar Perfil</h1>
        <p class="text-gray-600">Actualiza tu información personal y preferencias.</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="md:w-1/3">
            <div class="flex flex-col items-center">
              <img src="/placeholder.svg?height=150&width=150" alt="Perfil" class="h-32 w-32 rounded-full mb-4">
              <button class="change-photo-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300 mb-2">
                Cambiar Foto
              </button>
              <p class="text-gray-500 text-sm text-center">JPG, GIF o PNG. Máximo 2MB</p>
            </div>
          </div>
          
          <div class="md:w-2/3">
            <form id="editProfileForm">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label for="firstName" class="block text-gray-700 font-medium mb-2">Nombre</label>
                  <input type="text" id="firstName" value="Juan" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                </div>
                <div>
                  <label for="lastName" class="block text-gray-700 font-medium mb-2">Apellido</label>
                  <input type="text" id="lastName" value="Pérez" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                </div>
                <div>
                  <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
                  <input type="email" id="email" value="juan@email.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                </div>
                <div>
                  <label for="phone" class="block text-gray-700 font-medium mb-2">Teléfono</label>
                  <input type="tel" id="phone" value="+56 9 1234 5678" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                </div>
              </div>
              
              <div class="border-t pt-6">
                <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition duration-300">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>
        
        <form id="changePasswordForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="currentPassword" class="block text-gray-700 font-medium mb-2">Contraseña Actual</label>
              <input type="password" id="currentPassword" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
            </div>
            <div></div>
            <div>
              <label for="newPassword" class="block text-gray-700 font-medium mb-2">Nueva Contraseña</label>
              <input type="password" id="newPassword" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
            </div>
            <div>
              <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">Confirmar Contraseña</label>
              <input type="password" id="confirmPassword" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
            </div>
          </div>
          
          <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition duration-300">
            Actualizar Contraseña
          </button>
        </form>
      </div>
    `

    // Add event listeners to the new content
    const editProfileForm = mainContent.querySelector("#editProfileForm")
    if (editProfileForm) {
      editProfileForm.addEventListener("submit", (e) => {
        e.preventDefault()
        showNotification("Perfil actualizado correctamente")
      })
    }

    const changePasswordForm = mainContent.querySelector("#changePasswordForm")
    if (changePasswordForm) {
      changePasswordForm.addEventListener("submit", function (e) {
        e.preventDefault()

        const newPassword = document.getElementById("newPassword").value
        const confirmPassword = document.getElementById("confirmPassword").value

        if (newPassword !== confirmPassword) {
          showNotification("Las contraseñas no coinciden", "error")
        } else {
          showNotification("Contraseña actualizada correctamente")

          // Clear form
          this.reset()
        }
      })
    }

    const changePhotoBtn = mainContent.querySelector(".change-photo-btn")
    if (changePhotoBtn) {
      changePhotoBtn.addEventListener("click", () => {
        // Simulate file input click
        const fileInput = document.createElement("input")
        fileInput.type = "file"
        fileInput.accept = "image/*"
        fileInput.style.display = "none"

        fileInput.addEventListener("change", function () {
          if (this.files && this.files[0]) {
            showNotification("Foto de perfil actualizada correctamente")
          }
        })

        document.body.appendChild(fileInput)
        fileInput.click()
        document.body.removeChild(fileInput)
      })
    }
  }

  // Function to show notification
  function showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-y-0 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("translate-y-20")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }
})
