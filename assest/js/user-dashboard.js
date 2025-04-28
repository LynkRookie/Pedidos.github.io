document.addEventListener("DOMContentLoaded", () => {
  // Sidebar navigation links
  const sidebarLinks = document.querySelectorAll(".sidebar-link")

  // Action buttons
  const viewOrderButtons = document.querySelectorAll(".fa-eye")
  const reorderButtons = document.querySelectorAll(".fa-redo-alt")
  const orderAgainBtns = document.querySelectorAll("button.w-full")
  const userProfileBtn = document.querySelector(".relative.group > button")

  // Inicialmente marcar la sección activa
  const currentPath = window.location.pathname
  if (currentPath.includes("user-dashboard")) {
    const homeLink = document.querySelector(".sidebar-link:has(.fa-home)")
    if (homeLink) {
      homeLink.classList.add("active")
    }
  }

  // Handle sidebar navigation
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all links
      sidebarLinks.forEach((l) => l.classList.remove("active"))

      // Add active class to clicked link
      this.classList.add("active")

      // Get the link text to determine which section to show
      const linkText = this.querySelector("span").textContent.trim()

      // Show appropriate content based on link clicked
      switch (linkText) {
        case "Inicio":
          showSection("home")
          break
        case "Mis Pedidos":
          showSection("orders")
          break
        case "Favoritos":
          showSection("favorites")
          break
        case "Direcciones":
          showSection("addresses")
          break
        case "Métodos de Pago":
          showSection("payment")
          break
        case "Configuración":
          showSection("settings")
          break
        case "Cerrar Sesión":
          window.location.href = "login.html"
          break
      }
    })
  })

  // Ver detalles del pedido (ícono de ojo)
  viewOrderButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      // Obtener información del pedido
      const orderRow = this.closest("tr")
      const orderId = orderRow.querySelector("td:first-child").textContent.trim()

      // Mostrar modal de detalles
      showOrderDetailsModal(orderId)
    })
  })

  // Ordenar de nuevo (ícono de recargar)
  reorderButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      // Obtener información del pedido
      const orderRow = this.closest("tr")
      const orderId = orderRow.querySelector("td:first-child").textContent.trim()

      // Mostrar formulario de reordenar
      showReorderForm(orderId)
    })
  })

  // Botones "Ordenar de nuevo" en tarjetas de favoritos
  orderAgainBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault()

      // Obtener información del producto
      const productCard = this.closest(".bg-gray-50")
      const productName = productCard.querySelector("h3").textContent.trim()

      // Mostrar formulario de reordenar
      showReorderForm(null, productName)
    })
  })

  // Modificar el menú desplegable del usuario
  if (userProfileBtn) {
    const dropdown = userProfileBtn.nextElementSibling
    if (dropdown) {
      // Mantener solo "Mi Perfil" y eliminar las otras opciones
      const menuItems = dropdown.querySelectorAll("a")
      menuItems.forEach((item) => {
        const text = item.textContent.trim()
        if (text.includes("Configuración") || text.includes("Cerrar Sesión")) {
          item.remove()
        }
      })
    }
  }

  // Función para mostrar diferentes secciones
  function showSection(sectionName) {
    // Activar el enlace correspondiente en la barra lateral
    sidebarLinks.forEach((link) => {
      const linkText = link.querySelector("span").textContent.trim().toLowerCase()

      if (
        (sectionName === "home" && linkText === "inicio") ||
        (sectionName === "orders" && linkText === "mis pedidos") ||
        (sectionName === "favorites" && linkText === "favoritos") ||
        (sectionName === "addresses" && linkText === "direcciones") ||
        (sectionName === "payment" && linkText === "métodos de pago") ||
        (sectionName === "settings" && linkText === "configuración")
      ) {
        link.classList.add("active")
      } else {
        link.classList.remove("active")
      }
    })

    // Mostrar contenido según la sección
    const mainContent = document.querySelector(".md\\:w-3\\/4")
    if (!mainContent) return

    switch (sectionName) {
      case "home":
        mainContent.innerHTML = createHomeContent()
        break
      case "orders":
        mainContent.innerHTML = createOrdersContent()
        break
      case "favorites":
        mainContent.innerHTML = createFavoritesContent()
        break
      case "addresses":
        mainContent.innerHTML = createAddressesContent()
        break
      case "payment":
        mainContent.innerHTML = createPaymentContent()
        break
      case "settings":
        mainContent.innerHTML = createSettingsContent()
        break
    }

    // Reinicializar los eventos después de cambiar el contenido
    initializeEvents()
  }

  // Función para mostrar el modal de detalles del pedido
  function showOrderDetailsModal(orderId) {
    // Crear modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Detalles del Pedido ${orderId}</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div class="border-b pb-2">
            <p class="text-gray-600">Fecha: 23/04/2023</p>
            <p class="text-gray-600">Estado: <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span></p>
          </div>
          <div>
            <h3 class="font-bold text-gray-800 mb-2">Productos:</h3>
            <ul class="space-y-2">
              <li class="flex justify-between">
                <span>California Roll x2</span>
                <span>$17.980 CLP</span>
              </li>
              <li class="flex justify-between">
                <span>Mojito x1</span>
                <span>$6.990 CLP</span>
              </li>
              <li class="flex justify-between">
                <span>Pizza Pepperoni x1</span>
                <span>$13.990 CLP</span>
              </li>
            </ul>
          </div>
          <div class="border-t pt-2">
            <div class="flex justify-between font-bold text-gray-800">
              <span>Total:</span>
              <span>$38.960 CLP</span>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
            Cerrar
          </button>
          <button class="reorder-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            Ordenar de Nuevo
          </button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Agregar event listeners a los botones del modal
    modal.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    modal.querySelector(".reorder-btn").addEventListener("click", () => {
      document.body.removeChild(modal)
      showReorderForm(orderId)
    })

    // Cerrar modal al hacer clic fuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Función para mostrar el formulario de reordenar
  function showReorderForm(orderId, productName = null) {
    // Crear modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Confirmar Pedido</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <form class="space-y-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2">Dirección de Entrega</label>
            <input type="text" value="Calle Principal 123, Ciudad" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2">Número Telefónico</label>
            <input type="tel" value="+56 9 1234 5678" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2">Método de Entrega</label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input type="radio" name="delivery" value="domicilio" checked class="mr-2 text-purple-600">
                <span>A domicilio</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="delivery" value="tienda" class="mr-2 text-purple-600">
                <span>Retirar en tienda</span>
              </label>
            </div>
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2">Método de Pago</label>
            <select class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Efectivo</option>
              <option>Tarjeta de Débito</option>
              <option>Transferencia</option>
            </select>
          </div>
          <div class="delivery-option">
            <label class="block text-gray-700 font-medium mb-2">¿Desea agregar propina?</label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input type="radio" name="tip" value="yes" class="mr-2 text-purple-600">
                <span>Sí</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="tip" value="no" checked class="mr-2 text-purple-600">
                <span>No</span>
              </label>
            </div>
            <div class="tip-amount hidden mt-2">
              <label class="block text-gray-700 font-medium mb-2">Monto de propina</label>
              <select class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>10% ($3.896 CLP)</option>
                <option>15% ($5.844 CLP)</option>
                <option>20% ($7.792 CLP)</option>
                <option>Otro monto</option>
              </select>
            </div>
          </div>
        </form>
        <div class="mt-6 flex justify-end">
          <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
            Cancelar
          </button>
          <button class="confirm-order bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            Confirmar Pedido
          </button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Mostrar/ocultar opciones de propina
    const tipRadios = modal.querySelectorAll('input[name="tip"]')
    const tipAmountDiv = modal.querySelector(".tip-amount")

    tipRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.value === "yes") {
          tipAmountDiv.classList.remove("hidden")
        } else {
          tipAmountDiv.classList.add("hidden")
        }
      })
    })

    // Mostrar/ocultar opciones de entrega
    const deliveryRadios = modal.querySelectorAll('input[name="delivery"]')
    const deliveryOption = modal.querySelector(".delivery-option")

    deliveryRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.value === "domicilio") {
          deliveryOption.classList.remove("hidden")
        } else {
          deliveryOption.classList.add("hidden")
        }
      })
    })

    // Agregar event listeners a los botones del modal
    modal.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    modal.querySelector(".confirm-order").addEventListener("click", () => {
      document.body.removeChild(modal)
      showNotification("¡Pedido confirmado! Será procesado en breve.")
    })

    // Cerrar modal al hacer clic fuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Función para mostrar notificación
  function showNotification(message) {
    const notification = document.createElement("div")
    notification.className =
      "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-y-0"
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("translate-y-20")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  // Contenido para cada sección
  function createHomeContent() {
    return `
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bienvenido, Juan</h2>
        <p class="text-gray-600 mb-6">¿Qué te gustaría ordenar hoy?</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/" class="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex items-center space-x-3 transition duration-300">
            <div class="bg-purple-100 p-3 rounded-full">
              <i class="fas fa-utensils text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-800">Ordenar Ahora</h3>
              <p class="text-gray-600 text-sm">Explora nuestro menú</p>
            </div>
          </a>
          <a href="#" class="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex items-center space-x-3 transition duration-300">
            <div class="bg-purple-100 p-3 rounded-full">
              <i class="fas fa-history text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-800">Pedidos Recientes</h3>
              <p class="text-gray-600 text-sm">Ver historial</p>
            </div>
          </a>
          <a href="#" class="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex items-center space-x-3 transition duration-300">
            <div class="bg-purple-100 p-3 rounded-full">
              <i class="fas fa-heart text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-800">Favoritos</h3>
              <p class="text-gray-600 text-sm">Tus platos preferidos</p>
            </div>
          </a>
        </div>
      </div>
      
      <!-- Recent Orders -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Pedidos Recientes</h2>
          <a href="#" class="text-purple-600 hover:text-purple-800 transition duration-300">Ver todos</a>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedido #</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Fecha</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12345</td>
                <td class="py-3 px-4 text-gray-600">23/04/2023</td>
                <td class="py-3 px-4 text-gray-800">$35.990 CLP</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <a href="#" class="text-purple-600 hover:text-purple-800 mr-3">
                    <i class="fas fa-eye"></i>
                  </a>
                  <a href="#" class="text-purple-600 hover:text-purple-800">
                    <i class="fas fa-redo-alt"></i>
                  </a>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12346</td>
                <td class="py-3 px-4 text-gray-600">20/04/2023</td>
                <td class="py-3 px-4 text-gray-800">$42.500 CLP</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <a href="#" class="text-purple-600 hover:text-purple-800 mr-3">
                    <i class="fas fa-eye"></i>
                  </a>
                  <a href="#" class="text-purple-600 hover:text-purple-800">
                    <i class="fas fa-redo-alt"></i>
                  </a>
                </td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12347</td>
                <td class="py-3 px-4 text-gray-600">15/04/2023</td>
                <td class="py-3 px-4 text-gray-800">$28.750 CLP</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <a href="#" class="text-purple-600 hover:text-purple-800 mr-3">
                    <i class="fas fa-eye"></i>
                  </a>
                  <a href="#" class="text-purple-600 hover:text-purple-800">
                    <i class="fas fa-redo-alt"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Favorite Items -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Tus Favoritos</h2>
          <a href="#" class="text-purple-600 hover:text-purple-800 transition duration-300">Ver todos</a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-50 rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=California+Roll" alt="California Roll" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">California Roll</h3>
                <span class="text-purple-600 font-bold">$8.990 CLP</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Delicioso roll con aguacate, pepino y cangrejo.</p>
              <button class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-300">
                Ordenar de Nuevo
              </button>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Pizza+Pepperoni" alt="Pizza Pepperoni" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Pizza Pepperoni</h3>
                <span class="text-purple-600 font-bold">$13.990 CLP</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Deliciosa pizza con abundante pepperoni y queso mozzarella.</p>
              <button class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-300">
                Ordenar de Nuevo
              </button>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Mojito" alt="Mojito" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Mojito</h3>
                <span class="text-purple-600 font-bold">$6.990 CLP</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Clásico cóctel con ron, lima, menta y azúcar.</p>
              <button class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-300">
                Ordenar de Nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  function createOrdersContent() {
    return `
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Mis Pedidos</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedido #</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Fecha</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12345</td>
                <td class="py-3 px-4 text-gray-600">23/04/2023</td>
                <td class="py-3 px-4 text-gray-800">$35.990 CLP</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <a href="#" class="text-purple-600 hover:text-purple-800 mr-3">
                    <i class="fas fa-eye"></i>
                  </a>
                  <a href="#" class="text-purple-600 hover:text-purple-800">
                    <i class="fas fa-redo-alt"></i>
                  </a>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12346</td>
                <td class="py-3 px-4 text-gray-600">20/04/2023</td>
                <td class="py-3 px-4 text-gray-800">$42.500 CLP</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <a href="#" class="text-purple-600 hover:text-purple-800 mr-3">
                    <i class="fas fa-eye"></i>
                  </a>
                  <a href="#" class="text-purple-600 hover:text-purple-800">
                    <i class="fas fa-redo-alt"></i>
                  </a>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12347</td>
                <td class="py-3 px-4 text-gray-600">15/04/2023</td>
                <td class="py-3 px-4 text-gray-800">$28.750 CLP</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <a href="#" class="text-purple-600 hover:text-purple-800 mr-3">
                    <i class="fas fa-eye"></i>
                  </a>
                  <a href="#" class="text-purple-600 hover:text-purple-800">
                    <i class="fas fa-redo-alt"></i>
                  </a>
                </td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12348</td>
                <td class="py-3 px-4 text-gray-600">10/04/2023</td>
                <td class="py-3 px-4 text-gray-800">$31.990 CLP</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <a href="#" class="text-purple-600 hover:text-purple-800 mr-3">
                    <i class="fas fa-eye"></i>
                  </a>
                  <a href="#" class="text-purple-600 hover:text-purple-800">
                    <i class="fas fa-redo-alt"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  function createFavoritesContent() {
    return `
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Mis Favoritos</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-50 rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=California+Roll" alt="California Roll" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">California Roll</h3>
                <span class="text-purple-600 font-bold">$8.990 CLP</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Delicioso roll con aguacate, pepino y cangrejo.</p>
              <button class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-300">
                Ordenar de Nuevo
              </button>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Pizza+Pepperoni" alt="Pizza Pepperoni" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Pizza Pepperoni</h3>
                <span class="text-purple-600 font-bold">$13.990 CLP</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Deliciosa pizza con abundante pepperoni y queso mozzarella.</p>
              <button class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-300">
                Ordenar de Nuevo
              </button>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Mojito" alt="Mojito" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Mojito</h3>
                <span class="text-purple-600 font-bold">$6.990 CLP</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Clásico cóctel con ron, lima, menta y azúcar.</p>
              <button class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-300">
                Ordenar de Nuevo
              </button>
            </div>
          </div>
          <div class="bg-gray-50 rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Ensalada+César" alt="Ensalada César" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Ensalada César</h3>
                <span class="text-purple-600 font-bold">$9.990 CLP</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Fresca ensalada con pollo, crutones, queso parmesano y aderezo César.</p>
              <button class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-300">
                Ordenar de Nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  function createAddressesContent() {
    return `
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Mis Direcciones</h2>
        <div class="space-y-4">
          <div class="border rounded-lg p-4 hover:bg-gray-50">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3">
                <input type="radio" name="address" checked class="mt-1 text-purple-600">
                <div>
                  <h3 class="font-bold text-gray-800">Casa</h3>
                  <p class="text-gray-600">Calle Principal 123, Ciudad</p>
                  <p class="text-gray-600">+56 9 1234 5678</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button class="text-purple-600 hover:text-purple-800">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="border rounded-lg p-4 hover:bg-gray-50">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3">
                <input type="radio" name="address" class="mt-1 text-purple-600">
                <div>
                  <h3 class="font-bold text-gray-800">Trabajo</h3>
                  <p class="text-gray-600">Av. Comercial 456, Ciudad</p>
                  <p class="text-gray-600">+56 9 8765 4321</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button class="text-purple-600 hover:text-purple-800">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <button class="w-full bg-purple-50 hover:bg-purple-100 text-purple-600 py-3 rounded-lg transition duration-300 flex items-center justify-center">
            <i class="fas fa-plus mr-2"></i> Agregar Nueva Dirección
          </button>
        </div>
      </div>
    `
  }

  function createPaymentContent() {
    return `
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Métodos de Pago</h2>
        <div class="space-y-4">
          <div class="border rounded-lg p-4 hover:bg-gray-50">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3">
                <input type="radio" name="payment" checked class="mt-1 text-purple-600">
                <div class="flex items-center">
                  <i class="fas fa-credit-card text-blue-500 text-2xl mr-3"></i>
                  <div>
                    <h3 class="font-bold text-gray-800">Tarjeta de Débito</h3>
                    <p class="text-gray-600">**** **** **** 1234</p>
                    <p class="text-gray-600 text-sm">Vence: 12/25</p>
                  </div>
                </div>
              </div>
              <div class="flex space-x-2">
                <button class="text-purple-600 hover:text-purple-800">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="border rounded-lg p-4 hover:bg-gray-50">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3">
                <input type="radio" name="payment" class="mt-1 text-purple-600">
                <div class="flex items-center">
                  <i class="fas fa-money-bill-wave text-green-500 text-2xl mr-3"></i>
                  <div>
                    <h3 class="font-bold text-gray-800">Efectivo</h3>
                    <p class="text-gray-600">Pago contra entrega</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="w-full bg-purple-50 hover:bg-purple-100 text-purple-600 py-3 rounded-lg transition duration-300 flex items-center justify-center">
            <i class="fas fa-plus mr-2"></i> Agregar Método de Pago
          </button>
        </div>
      </div>
    `
  }

  function createSettingsContent() {
    return `
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h2>
        <div class="flex flex-col md:flex-row gap-8">
          <div class="md:w-1/3 flex flex-col items-center">
            <div class="relative mb-4">
              <img src="/placeholder.svg?height=150&width=150" alt="Usuario" class="h-32 w-32 rounded-full">
              <button class="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full">
                <i class="fas fa-camera"></i>
              </button>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Juan Pérez</h3>
            <p class="text-gray-600">usuario@email.com</p>
          </div>
          <div class="md:w-2/3">
            <form class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Nombre</label>
                  <input type="text" value="Juan" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Apellido</label>
                  <input type="text" value="Pérez" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Email</label>
                <input type="email" value="usuario@email.com" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Teléfono</label>
                <input type="tel" value="+56 9 1234 5678" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Contraseña</label>
                <input type="password" value="********" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              </div>
              <div class="flex justify-end">
                <button type="button" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
                  Cancelar
                </button>
                <button type="button" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `
  }

  // Inicializar eventos después de cambiar el contenido
  function initializeEvents() {
    // Reinicializar eventos para los botones de ver detalles
    document.querySelectorAll(".fa-eye").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()

        // Obtener información del pedido
        const orderRow = this.closest("tr")
        const orderId = orderRow.querySelector("td:first-child").textContent.trim()

        // Mostrar modal de detalles
        showOrderDetailsModal(orderId)
      })
    })

    // Reinicializar eventos para los botones de reordenar
    document.querySelectorAll(".fa-redo-alt").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()

        // Obtener información del pedido
        const orderRow = this.closest("tr")
        const orderId = orderRow.querySelector("td:first-child").textContent.trim()

        // Mostrar formulario de reordenar
        showReorderForm(orderId)
      })
    })

    // Reinicializar eventos para los botones "Ordenar de nuevo" en tarjetas de favoritos
    document.querySelectorAll("button.w-full").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()

        // Obtener información del producto
        const productCard = this.closest(".bg-gray-50")
        const productName = productCard.querySelector("h3").textContent.trim()

        // Mostrar formulario de reordenar
        showReorderForm(null, productName)
      })
    })

    // Reinicializar eventos para los enlaces "Ver todos"
    document.querySelectorAll('a[href="#"]').forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()

        // Determinar qué enlace "Ver todos" se hizo clic
        const parentSection = this.closest(".bg-white")
        if (!parentSection) return

        const sectionTitle = parentSection.querySelector("h2").textContent.trim()

        if (sectionTitle === "Pedidos Recientes") {
          showSection("orders")
        } else if (sectionTitle === "Tus Favoritos") {
          showSection("favorites")
        }
      })
    })
  }
})
