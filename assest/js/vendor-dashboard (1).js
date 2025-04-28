import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Sidebar navigation links
  const sidebarLinks = document.querySelectorAll(".sidebar-link")

  // Action buttons
  const dateFilter = document.querySelector("input[type='date']")
  const notificationBtn = document.querySelector(".fas.fa-bell").parentElement
  const userProfileBtn = document.querySelector(".relative.group > button")

  // Content sections
  let showNewOrdersSection = false
  let showProcessingOrdersSection = false
  let showCompletedOrdersSection = false
  let showOrderHistorySection = false
  let showReportsSection = false

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
        case "Dashboard":
          showDashboardSection()
          break
        case "Nuevos Pedidos":
          showNewOrdersSection = true
          showNewOrders()
          break
        case "En Proceso":
          showProcessingOrdersSection = true
          showProcessingOrders()
          break
        case "Completados":
          showCompletedOrdersSection = true
          showCompletedOrders()
          break
        case "Historial":
          showOrderHistorySection = true
          showOrderHistory()
          break
        case "Reportes":
          showReportsSection = true
          showReports()
          break
      }
    })
  })

  // Highlight dashboard by default
  const dashboardLink = Array.from(sidebarLinks).find(
    (link) => link.querySelector("span").textContent.trim() === "Dashboard",
  )
  if (dashboardLink) {
    dashboardLink.classList.add("active", "bg-purple-100", "text-purple-800")
  }

  // Handle date filter
  if (dateFilter) {
    dateFilter.addEventListener("change", function () {
      const selectedDate = new Date(this.value)
      const formattedDate = selectedDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })

      showNotification(`Filtrando datos para: ${formattedDate}`)

      // Refresh the current section with the new date
      if (showNewOrdersSection) {
        showNewOrders(selectedDate)
      } else if (showProcessingOrdersSection) {
        showProcessingOrders(selectedDate)
      } else if (showCompletedOrdersSection) {
        showCompletedOrders(selectedDate)
      } else if (showOrderHistorySection) {
        showOrderHistory(selectedDate)
      } else if (showReportsSection) {
        showReports(selectedDate)
      }
    })
  }

  // Handle notification button
  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      // Show notifications modal
      showNotificationsModal()
    })
  }

  // Handle user profile button
  if (userProfileBtn) {
    userProfileBtn.addEventListener("click", function (e) {
      const dropdown = this.nextElementSibling
      dropdown.classList.toggle("hidden")
    })

    // Remove "Log Out" option from dropdown
    const dropdownMenu = userProfileBtn.nextElementSibling
    if (dropdownMenu) {
      const logoutLink = dropdownMenu.querySelector("a:last-child")
      if (logoutLink) {
        logoutLink.remove()
      }
    }
  }

  // Function to show dashboard section
  function showDashboardSection() {
    // Reset all section flags
    showNewOrdersSection = false
    showProcessingOrdersSection = false
    showCompletedOrdersSection = false
    showOrderHistorySection = false
    showReportsSection = false

    // Create dashboard section content
    const mainContent = document.querySelector("main")

    // If we have saved dashboard content, restore it
    if (mainContent.dataset.dashboardContent) {
      mainContent.innerHTML = mainContent.dataset.dashboardContent
      return
    }

    // Otherwise, create new dashboard content
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p class="text-gray-600">Bienvenido de nuevo, Carlos Rodríguez.</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="bg-purple-100 p-3 rounded-full mr-4">
              <i class="fas fa-shopping-bag text-purple-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">12</h2>
              <p class="text-gray-600">Nuevos Pedidos</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="bg-blue-100 p-3 rounded-full mr-4">
              <i class="fas fa-clock text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">8</h2>
              <p class="text-gray-600">Pedidos en Proceso</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="bg-green-100 p-3 rounded-full mr-4">
              <i class="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">24</h2>
              <p class="text-gray-600">Pedidos Completados Hoy</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">Pedidos Recientes</h2>
            <a href="#" class="text-purple-600 hover:text-purple-800 text-sm font-medium">Ver Todos</a>
          </div>
          
          <div class="space-y-4">
            <div class="border-l-4 border-yellow-500 pl-4 py-2">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-gray-800">#12345 - Juan Pérez</h3>
                  <p class="text-gray-600 text-sm">Pizza Pepperoni, California Roll, Mojito</p>
                  <p class="text-gray-500 text-xs">Hace 10 minutos</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
              </div>
            </div>
            
            <div class="border-l-4 border-blue-500 pl-4 py-2">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-gray-800">#12346 - María González</h3>
                  <p class="text-gray-600 text-sm">Dragon Roll, Limonada</p>
                  <p class="text-gray-500 text-xs">Hace 25 minutos</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Proceso</span>
              </div>
            </div>
            
            <div class="border-l-4 border-green-500 pl-4 py-2">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-gray-800">#12347 - Roberto Sánchez</h3>
                  <p class="text-gray-600 text-sm">Pizza Hawaiana</p>
                  <p class="text-gray-500 text-xs">Hace 45 minutos</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completado</span>
              </div>
            </div>
            
            <div class="border-l-4 border-green-500 pl-4 py-2">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-gray-800">#12348 - Ana Martínez</h3>
                  <p class="text-gray-600 text-sm">California Roll, Dragon Roll, Mojito</p>
                  <p class="text-gray-500 text-xs">Hace 1 hora</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completado</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">Ventas de Hoy</h2>
            <div class="text-purple-600 font-bold">$1,250.85</div>
          </div>
          
          <div class="h-64">
            <canvas id="salesChart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Productos Más Vendidos</h2>
          <select class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option>Hoy</option>
            <option>Esta Semana</option>
            <option>Este Mes</option>
          </select>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Producto</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Categoría</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Precio</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Vendidos</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=Pizza" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
                    <span class="text-gray-800">Pizza Pepperoni</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Pizza</td>
                <td class="py-3 px-4 text-gray-800">$13.99</td>
                <td class="py-3 px-4 text-gray-800">24</td>
                <td class="py-3 px-4 text-gray-800">$335.76</td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=Sushi" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
                    <span class="text-gray-800">California Roll</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Sushi</td>
                <td class="py-3 px-4 text-gray-800">$8.99</td>
                <td class="py-3 px-4 text-gray-800">32</td>
                <td class="py-3 px-4 text-gray-800">$287.68</td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=Sushi" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
                    <span class="text-gray-800">Dragon Roll</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Sushi</td>
                <td class="py-3 px-4 text-gray-800">$12.99</td>
                <td class="py-3 px-4 text-gray-800">18</td>
                <td class="py-3 px-4 text-gray-800">$233.82</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=Mojito" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
                    <span class="text-gray-800">Mojito</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Bebidas</td>
                <td class="py-3 px-4 text-gray-800">$6.99</td>
                <td class="py-3 px-4 text-gray-800">27</td>
                <td class="py-3 px-4 text-gray-800">$188.73</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `

    // Save dashboard content for later
    mainContent.dataset.dashboardContent = mainContent.innerHTML

    // Initialize sales chart
    setTimeout(() => {
      initializeSalesChart()
    }, 100)

    // Add event listeners to the dashboard content
    const viewAllLink = mainContent.querySelector("a.text-purple-600")
    if (viewAllLink) {
      viewAllLink.addEventListener("click", (e) => {
        e.preventDefault()
        showNewOrders()

        // Update sidebar active link
        sidebarLinks.forEach((l) => l.classList.remove("active", "bg-purple-100", "text-purple-800"))
        const newOrdersLink = Array.from(sidebarLinks).find(
          (link) => link.querySelector("span").textContent.trim() === "Nuevos Pedidos",
        )
        if (newOrdersLink) {
          newOrdersLink.classList.add("active", "bg-purple-100", "text-purple-800")
        }
      })
    }

    const periodSelect = mainContent.querySelector("select")
    if (periodSelect) {
      periodSelect.addEventListener("change", function () {
        showNotification(`Mostrando productos más vendidos: ${this.value}`)
      })
    }
  }

  // Function to show new orders section
  function showNewOrders(selectedDate) {
    // Create new orders section content
    const mainContent = document.querySelector("main")

    // Save dashboard content if not already saved
    if (!mainContent.dataset.dashboardContent) {
      mainContent.dataset.dashboardContent = mainContent.innerHTML
    }

    // Format date for display
    const dateStr = selectedDate
      ? selectedDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
      : new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })

    // Replace with new orders section
    mainContent.innerHTML = `
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Nuevos Pedidos</h1>
          <p class="text-gray-600">Pedidos pendientes de aceptación: ${dateStr}</p>
        </div>
        <div class="flex space-x-2">
          <input type="date" class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
          <button class="refresh-btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-300">
            <i class="fas fa-sync-alt mr-2"></i> Actualizar
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-yellow-50 px-4 py-2 border-b border-yellow-100">
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-800">#12345</span>
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Nuevo</span>
            </div>
            <p class="text-gray-500 text-sm">Hace 10 minutos</p>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-2">Juan Pérez</h3>
            <p class="text-gray-600 text-sm mb-3">Dirección: Calle Principal 123, Santiago</p>
            <p class="text-gray-600 text-sm mb-3">Teléfono: +56 9 1234 5678</p>
            
            <div class="border-t pt-3 mb-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Pizza Pepperoni</span>
                <span class="text-sm">x1</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">California Roll</span>
                <span class="text-sm">x2</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Mojito</span>
                <span class="text-sm">x1</span>
              </div>
            </div>
            
            <div class="border-t pt-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="font-medium">Total:</span>
                <span class="font-bold text-gray-800">$38.96</span>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button class="accept-order-btn flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Aceptar
              </button>
              <button class="reject-order-btn flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Rechazar
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-yellow-50 px-4 py-2 border-b border-yellow-100">
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-800">#12349</span>
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Nuevo</span>
            </div>
            <p class="text-gray-500 text-sm">Hace 5 minutos</p>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-2">Pedro Ramírez</h3>
            <p class="text-gray-600 text-sm mb-3">Dirección: Av. Providencia 1500, Santiago</p>
            <p class="text-gray-600 text-sm mb-3">Teléfono: +56 9 8765 4321</p>
            
            <div class="border-t pt-3 mb-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Dragon Roll</span>
                <span class="text-sm">x1</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Limonada</span>
                <span class="text-sm">x2</span>
              </div>
            </div>
            
            <div class="border-t pt-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="font-medium">Total:</span>
                <span class="font-bold text-gray-800">$22.97</span>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button class="accept-order-btn flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Aceptar
              </button>
              <button class="reject-order-btn flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Rechazar
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-yellow-50 px-4 py-2 border-b border-yellow-100">
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-800">#12350</span>
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Nuevo</span>
            </div>
            <p class="text-gray-500 text-sm">Hace 2 minutos</p>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-2">Laura Martínez</h3>
            <p class="text-gray-600 text-sm mb-3">Dirección: Calle Los Olivos 456, Santiago</p>
            <p class="text-gray-600 text-sm mb-3">Teléfono: +56 9 2222 3333</p>
            
            <div class="border-t pt-3 mb-3">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Pizza Hawaiana</span>
                <span class="text-sm">x2</span>
              </div>
            </div>
            
            <div class="border-t pt-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="font-medium">Total:</span>
                <span class="font-bold text-gray-800">$25.98</span>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button class="accept-order-btn flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Aceptar
              </button>
              <button class="reject-order-btn flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>
    `

    // Add event listeners to the new content
    const refreshBtn = mainContent.querySelector(".refresh-btn")
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        showNotification("Actualizando pedidos...")
        setTimeout(() => {
          showNewOrders()
          showNotification("Pedidos actualizados")
        }, 1000)
      })
    }

    const dateInput = mainContent.querySelector("input[type='date']")
    if (dateInput) {
      // Set default value to today or selected date
      dateInput.valueAsDate = selectedDate || new Date()

      dateInput.addEventListener("change", function () {
        const newDate = new Date(this.value)
        showNewOrders(newDate)
      })
    }

    const acceptOrderBtns = mainContent.querySelectorAll(".accept-order-btn")
    acceptOrderBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderCard = this.closest(".bg-white")
        const orderId = orderCard.querySelector(".font-bold.text-gray-800").textContent
        showAcceptOrderModal(orderId, orderCard)
      })
    })

    const rejectOrderBtns = mainContent.querySelectorAll(".reject-order-btn")
    rejectOrderBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderCard = this.closest(".bg-white")
        const orderId = orderCard.querySelector(".font-bold.text-gray-800").textContent
        showRejectOrderConfirmation(orderId, orderCard)
      })
    })
  }

  // Function to show processing orders section
  function showProcessingOrders(selectedDate) {
    // Create processing orders section content
    const mainContent = document.querySelector("main")

    // Save dashboard content if not already saved
    if (!mainContent.dataset.dashboardContent) {
      mainContent.dataset.dashboardContent = mainContent.innerHTML
    }

    // Format date for display
    const dateStr = selectedDate
      ? selectedDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
      : new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })

    // Replace with processing orders section
    mainContent.innerHTML = `
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Pedidos en Proceso</h1>
          <p class="text-gray-600">Pedidos en preparación: ${dateStr}</p>
        </div>
        <div class="flex space-x-2">
          <input type="date" class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
          <button class="refresh-btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-300">
            <i class="fas fa-sync-alt mr-2"></i> Actualizar
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-blue-50 px-4 py-2 border-b border-blue-100">
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-800">#12346</span>
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Preparación</span>
            </div>
            <p class="text-gray-500 text-sm">Hace 25 minutos</p>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-2">María González</h3>
            <p class="text-gray-600 text-sm mb-3">Dirección: Av. Las Condes 789, Santiago</p>
            <p class="text-gray-600 text-sm mb-3">Teléfono: +56 9 5555 6666</p>
            
            <div class="border-t pt-3 mb-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Dragon Roll</span>
                <span class="text-sm">x1</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Limonada</span>
                <span class="text-sm">x1</span>
              </div>
            </div>
            
            <div class="border-t pt-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="font-medium">Total:</span>
                <span class="font-bold text-gray-800">$17.98</span>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button class="ready-for-delivery-btn flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Listo para Entrega
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-blue-50 px-4 py-2 border-b border-blue-100">
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-800">#12351</span>
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Preparación</span>
            </div>
            <p class="text-gray-500 text-sm">Hace 15 minutos</p>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-2">Carlos Mendoza</h3>
            <p class="text-gray-600 text-sm mb-3">Dirección: Calle Alameda 567, Santiago</p>
            <p class="text-gray-600 text-sm mb-3">Teléfono: +56 9 7777 8888</p>
            
            <div class="border-t pt-3 mb-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Pizza Pepperoni</span>
                <span class="text-sm">x2</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Mojito</span>
                <span class="text-sm">x2</span>
              </div>
            </div>
            
            <div class="border-t pt-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="font-medium">Total:</span>
                <span class="font-bold text-gray-800">$41.96</span>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button class="ready-for-delivery-btn flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Listo para Entrega
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-blue-50 px-4 py-2 border-b border-blue-100">
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-800">#12352</span>
              <span class="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Listo para Entrega</span>
            </div>
            <p class="text-gray-500 text-sm">Hace 30 minutos</p>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-2">Sofía Vargas</h3>
            <p class="text-gray-600 text-sm mb-3">Dirección: Av. Kennedy 890, Santiago</p>
            <p class="text-gray-600 text-sm mb-3">Teléfono: +56 9 3333 4444</p>
            
            <div class="border-t pt-3 mb-3">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">California Roll</span>
                <span class="text-sm">x3</span>
              </div>
            </div>
            
            <div class="border-t pt-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="font-medium">Total:</span>
                <span class="font-bold text-gray-800">$26.97</span>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button class="assign-delivery-btn flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
                Asignar Repartidor
              </button>
            </div>
          </div>
        </div>
      </div>
    `

    // Add event listeners to the new content
    const refreshBtn = mainContent.querySelector(".refresh-btn")
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        showNotification("Actualizando pedidos...")
        setTimeout(() => {
          showProcessingOrders()
          showNotification("Pedidos actualizados")
        }, 1000)
      })
    }

    const dateInput = mainContent.querySelector("input[type='date']")
    if (dateInput) {
      // Set default value to today or selected date
      dateInput.valueAsDate = selectedDate || new Date()

      dateInput.addEventListener("change", function () {
        const newDate = new Date(this.value)
        showProcessingOrders(newDate)
      })
    }

    const readyForDeliveryBtns = mainContent.querySelectorAll(".ready-for-delivery-btn")
    readyForDeliveryBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderCard = this.closest(".bg-white")
        const orderId = orderCard.querySelector(".font-bold.text-gray-800").textContent

        // Update status badge
        const statusBadge = orderCard.querySelector(".px-2.py-1.rounded-full")
        statusBadge.className = "px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
        statusBadge.textContent = "Listo para Entrega"

        // Replace button with assign delivery button
        this.outerHTML = `
          <button class="assign-delivery-btn flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
            Asignar Repartidor
          </button>
        `

        // Add event listener to the new button
        const assignDeliveryBtn = orderCard.querySelector(".assign-delivery-btn")
        assignDeliveryBtn.addEventListener("click", () => {
          showAssignDeliveryPersonModal(orderId, orderCard)
        })

        showNotification(`Pedido ${orderId} marcado como listo para entrega`)
      })
    })

    const assignDeliveryBtns = mainContent.querySelectorAll(".assign-delivery-btn")
    assignDeliveryBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderCard = this.closest(".bg-white")
        const orderId = orderCard.querySelector(".font-bold.text-gray-800").textContent
        showAssignDeliveryPersonModal(orderId, orderCard)
      })
    })
  }

  // Function to show completed orders section
  function showCompletedOrders(selectedDate) {
    // Create completed orders section content
    const mainContent = document.querySelector("main")

    // Save dashboard content if not already saved
    if (!mainContent.dataset.dashboardContent) {
      mainContent.dataset.dashboardContent = mainContent.innerHTML
    }

    // Format date for display
    const dateStr = selectedDate
      ? selectedDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
      : new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })

    // Replace with completed orders section
    mainContent.innerHTML = `
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Pedidos Completados</h1>
          <p class="text-gray-600">Pedidos entregados: ${dateStr}</p>
        </div>
        <div class="flex space-x-2">
          <input type="date" class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
          <button class="refresh-btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-300">
            <i class="fas fa-sync-alt mr-2"></i> Actualizar
          </button>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedido #</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Cliente</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Repartidor</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Hora de Entrega</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12347</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Roberto Sánchez</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Miguel Torres</td>
                <td class="py-3 px-4 text-gray-600">Hoy, 11:45 AM</td>
                <td class="py-3 px-4 text-gray-800">$12.99</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <button class="view-order-btn text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12348</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Ana Martínez</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Miguel Torres</td>
                <td class="py-3 px-4 text-gray-600">Hoy, 10:30 AM</td>
                <td class="py-3 px-4 text-gray-800">$36.96</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <button class="view-order-btn text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12340</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Luis Fernández</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Carlos Díaz</td>
                <td class="py-3 px-4 text-gray-600">Hoy, 9:15 AM</td>
                <td class="py-3 px-4 text-gray-800">$28.97</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <button class="view-order-btn text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12339</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Carmen Rojas</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Miguel Torres</td>
                <td class="py-3 px-4 text-gray-600">Ayer, 7:30 PM</td>
                <td class="py-3 px-4 text-gray-800">$42.97</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <button class="view-order-btn text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12338</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Jorge Muñoz</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Carlos Díaz</td>
                <td class="py-3 px-4 text-gray-600">Ayer, 6:45 PM</td>
                <td class="py-3 px-4 text-gray-800">$19.98</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <button class="view-order-btn text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-6 flex justify-between items-center">
          <div class="text-gray-600">Mostrando 1-5 de 24 pedidos completados</div>
          <div class="flex space-x-1">
            <button class="px-3 py-1 rounded-md bg-gray-200 text-gray-600">&laquo;</button>
            <button class="px-3 py-1 rounded-md bg-purple-600 text-white">1</button>
            <button class="px-3 py-1 rounded-md bg-gray-200 text-gray-600">2</button>
            <button class="px-3 py-1 rounded-md bg-gray-200 text-gray-600">3</button>
            <button class="px-3 py-1 rounded-md bg-gray-200 text-gray-600">&raquo;</button>
          </div>
        </div>
      </div>
    `

    // Add event listeners to the new content
    const refreshBtn = mainContent.querySelector(".refresh-btn")
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        showNotification("Actualizando pedidos...")
        setTimeout(() => {
          showCompletedOrders()
          showNotification("Pedidos actualizados")
        }, 1000)
      })
    }

    const dateInput = mainContent.querySelector("input[type='date']")
    if (dateInput) {
      // Set default value to today or selected date
      dateInput.valueAsDate = selectedDate || new Date()

      dateInput.addEventListener("change", function () {
        const newDate = new Date(this.value)
        showCompletedOrders(newDate)
      })
    }

    const viewOrderBtns = mainContent.querySelectorAll(".view-order-btn")
    viewOrderBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderRow = this.closest("tr")
        const orderId = orderRow.querySelector("td:first-child").textContent.trim()
        showOrderDetailsModal(orderId)
      })
    })

    const paginationBtns = mainContent.querySelectorAll(".flex.space-x-1 button")
    paginationBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        if (!this.classList.contains("bg-purple-600")) {
          showNotification("Cambiando a otra página de resultados")
        }
      })
    })
  }

  // Function to show order history section
  function showOrderHistory(selectedDate) {
    // Create order history section content
    const mainContent = document.querySelector("main")

    // Save dashboard content if not already saved
    if (!mainContent.dataset.dashboardContent) {
      mainContent.dataset.dashboardContent = mainContent.innerHTML
    }

    // Format date for display
    const dateStr = selectedDate
      ? selectedDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
      : new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })

    // Replace with order history section
    mainContent.innerHTML = `
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Historial de Pedidos</h1>
          <p class="text-gray-600">Todos los pedidos: ${dateStr}</p>
        </div>
        <div class="flex space-x-2">
          <input type="date" class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
          <select class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option>Todos los estados</option>
            <option>Entregados</option>
            <option>Cancelados</option>
            <option>Rechazados</option>
          </select>
          <button class="export-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
            <i class="fas fa-download mr-2"></i> Exportar
          </button>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedido #</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Cliente</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Fecha</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Productos</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12347</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Roberto Sánchez</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Hoy, 11:45 AM</td>
                <td class="py-3 px-4 text-gray-600">Pizza Hawaiana</td>
                <td class="py-3 px-4 text-gray-800">$12.99</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <button class="view-order-btn text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12346</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">María González</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Hoy, 9:45 AM</td>
                <td class="py-3 px-4 text-gray-600">Dragon Roll, Limonada</td>
                <td class="py-3 px-4 text-gray-800">$17.98</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Proceso</span>
                </td>
                <td class="py-3 px-4">
                  <button class="view-order-btn text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12345</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Juan Pérez</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Hoy, 9:23 AM</td>
                <td class="py-3 px-4 text-gray-600">Pizza Pepperoni, California Roll, Mojito</td>
                <td class="py-3 px-4 text-gray-800">$38.96</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
                </td>
                <td class="py-3 px-4">
                  <button class="view-order-btn text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12344</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Elena Castro</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Ayer, 8:15 PM</td>
                <td class="py-3 px-4 text-gray-600">California Roll, Limonada</td>
                <td class="py-3 px-4 text-gray-800">$13.98</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
                </td>
                <td class="py-3 px-4">
                  <button class="view-order-btn text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12343</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Pablo Herrera</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Ayer, 7:30 PM</td>
                <td class="py-3 px-4 text-gray-600">Pizza Pepperoni, Mojito</td>
                <td class="py-3 px-4 text-gray-800">$20.98</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelado</span>
                </td>
                <td class="py-3 px-4">
                  <button class="view-order-btn text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-6 flex justify-between items-center">
          <div class="text-gray-600">Mostrando 1-5 de 42 pedidos</div>
          <div class="flex space-x-1">
            <button class="px-3 py-1 rounded-md bg-gray-200 text-gray-600">&laquo;</button>
            <button class="px-3 py-1 rounded-md bg-purple-600 text-white">1</button>
            <button class="px-3 py-1 rounded-md bg-gray-200 text-gray-600">2</button>
            <button class="px-3 py-1 rounded-md bg-gray-200 text-gray-600">3</button>
            <button class="px-3 py-1 rounded-md bg-gray-200 text-gray-600">&raquo;</button>
          </div>
        </div>
      </div>
    `

    // Add event listeners to the new content
    const dateInput = mainContent.querySelector("input[type='date']")
    if (dateInput) {
      // Set default value to today or selected date
      dateInput.valueAsDate = selectedDate || new Date()

      dateInput.addEventListener("change", function () {
        const newDate = new Date(this.value)
        showOrderHistory(newDate)
      })
    }

    const statusFilter = mainContent.querySelector("select")
    if (statusFilter) {
      statusFilter.addEventListener("change", function () {
        showNotification(`Filtrando por estado: ${this.value}`)
      })
    }

    const exportBtn = mainContent.querySelector(".export-btn")
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        showExportOptionsModal()
      })
    }

    const viewOrderBtns = mainContent.querySelectorAll(".view-order-btn")
    viewOrderBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const orderRow = this.closest("tr")
        const orderId = orderRow.querySelector("td:first-child").textContent.trim()
        showOrderDetailsModal(orderId)
      })
    })

    const paginationBtns = mainContent.querySelectorAll(".flex.space-x-1 button")
    paginationBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        if (!this.classList.contains("bg-purple-600")) {
          showNotification("Cambiando a otra página de resultados")
        }
      })
    })
  }

  // Function to show reports section
  function showReports(selectedDate) {
    // Create reports section content
    const mainContent = document.querySelector("main")

    // Save dashboard content if not already saved
    if (!mainContent.dataset.dashboardContent) {
      mainContent.dataset.dashboardContent = mainContent.innerHTML
    }

    // Format date for display
    const dateStr = selectedDate
      ? selectedDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
      : new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })

    // Replace with reports section
    mainContent.innerHTML = `
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Reportes</h1>
          <p class="text-gray-600">Análisis de ventas y pedidos</p>
        </div>
        <div class="flex space-x-2">
          <select class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option>Hoy</option>
            <option>Esta Semana</option>
            <option>Este Mes</option>
            <option>Personalizado</option>
          </select>
          <button class="export-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
            <i class="fas fa-download mr-2"></i> Exportar
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="bg-purple-100 p-3 rounded-full mr-4">
              <i class="fas fa-shopping-bag text-purple-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">44</h2>
              <p class="text-gray-600">Total de Pedidos</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="bg-green-100 p-3 rounded-full mr-4">
              <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">$1,250.85</h2>
              <p class="text-gray-600">Ingresos Totales</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div class="bg-blue-100 p-3 rounded-full mr-4">
              <i class="fas fa-chart-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">$28.43</h2>
              <p class="text-gray-600">Valor Promedio</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">Ventas por Día</h2>
          </div>
          
          <div class="h-64">
            <canvas id="dailySalesChart"></canvas>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">Ventas por Categoría</h2>
          </div>
          
          <div class="h-64">
            <canvas id="categorySalesChart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Productos Más Vendidos</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Producto</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Categoría</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Precio</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Vendidos</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Ingresos</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">% del Total</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=Pizza" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
                    <span class="text-gray-800">Pizza Pepperoni</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Pizza</td>
                <td class="py-3 px-4 text-gray-800">$13.99</td>
                <td class="py-3 px-4 text-gray-800">24</td>
                <td class="py-3 px-4 text-gray-800">$335.76</td>
                <td class="py-3 px-4">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-purple-600 h-2.5 rounded-full" style="width: 27%"></div>
                  </div>
                  <span class="text-sm text-gray-600">27%</span>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=Sushi" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
                    <span class="text-gray-800">California Roll</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Sushi</td>
                <td class="py-3 px-4 text-gray-800">$8.99</td>
                <td class="py-3 px-4 text-gray-800">32</td>
                <td class="py-3 px-4 text-gray-800">$287.68</td>
                <td class="py-3 px-4">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-purple-600 h-2.5 rounded-full" style="width: 23%"></div>
                  </div>
                  <span class="text-sm text-gray-600">23%</span>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=Sushi" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
                    <span class="text-gray-800">Dragon Roll</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Sushi</td>
                <td class="py-3 px-4 text-gray-800">$12.99</td>
                <td class="py-3 px-4 text-gray-800">18</td>
                <td class="py-3 px-4 text-gray-800">$233.82</td>
                <td class="py-3 px-4">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-purple-600 h-2.5 rounded-full" style="width: 19%"></div>
                  </div>
                  <span class="text-sm text-gray-600">19%</span>
                </td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=Mojito" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
                    <span class="text-gray-800">Mojito</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Bebidas</td>
                <td class="py-3 px-4 text-gray-800">$6.99</td>
                <td class="py-3 px-4 text-gray-800">27</td>
                <td class="py-3 px-4 text-gray-800">$188.73</td>
                <td class="py-3 px-4">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-purple-600 h-2.5 rounded-full" style="width: 15%"></div>
                  </div>
                  <span class="text-sm text-gray-600">15%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `

    // Initialize charts
    setTimeout(() => {
      initializeReportCharts()
    }, 100)

    // Add event listeners to the new content
    const periodSelect = mainContent.querySelector("select")
    if (periodSelect) {
      periodSelect.addEventListener("change", function () {
        if (this.value === "Personalizado") {
          showDateRangeModal()
        } else {
          showNotification(`Mostrando reportes para: ${this.value}`)

          // Reinitialize charts with new data
          setTimeout(() => {
            initializeReportCharts()
          }, 500)
        }
      })
    }

    const exportBtn = mainContent.querySelector(".export-btn")
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        showExportOptionsModal()
      })
    }
  }

  // Function to show date range modal
  function showDateRangeModal() {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Seleccionar Rango de Fechas</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form id="dateRangeForm">
          <div class="mb-4">
            <label for="startDate" class="block text-gray-700 font-medium mb-2">Fecha de Inicio</label>
            <input type="date" id="startDate" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="mb-6">
            <label for="endDate" class="block text-gray-700 font-medium mb-2">Fecha de Fin</label>
            <input type="date" id="endDate" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="flex justify-end">
            <button type="button" class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
              Cancelar
            </button>
            <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              Aplicar
            </button>
          </div>
        </form>
      </div>
    `

    document.body.appendChild(modal)

    // Set default dates (last 7 days)
    const today = new Date()
    const lastWeek = new Date()
    lastWeek.setDate(today.getDate() - 7)

    document.getElementById("startDate").valueAsDate = lastWeek
    document.getElementById("endDate").valueAsDate = today

    // Add event listeners to modal buttons
    const closeButtons = modal.querySelectorAll(".close-modal")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.body.removeChild(modal)
      })
    })

    // Add event listener to form submission
    const dateRangeForm = modal.querySelector("#dateRangeForm")
    dateRangeForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const startDate = document.getElementById("startDate").value
      const endDate = document.getElementById("endDate").value

      // Show notification
      showNotification(`Mostrando reportes desde ${startDate} hasta ${endDate}`)

      // Close modal
      document.body.removeChild(modal)

      // Reinitialize charts with new data
      setTimeout(() => {
        initializeReportCharts()
      }, 500)
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show accept order modal
  function showAcceptOrderModal(orderId, orderCard) {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Aceptar Pedido ${orderId}</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <p class="text-gray-600 mb-4">Selecciona la persona que preparará este pedido:</p>
        
        <form id="acceptOrderForm">
          <div class="space-y-3 mb-6">
            <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" name="preparer" id="preparer1" value="Carlos Rodríguez" class="mr-3" checked>
              <label for="preparer1" class="flex items-center cursor-pointer flex-1">
                <img src="/placeholder.svg?height=30&width=30" alt="Preparador" class="h-10 w-10 rounded-full mr-3">
                <div>
                  <h4 class="font-bold text-gray-800">Carlos Rodríguez (Tú)</h4>
                  <p class="text-gray-600 text-sm">Chef Principal</p>
                </div>
              </label>
            </div>
            
            <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" name="preparer" id="preparer2" value="Ana López" class="mr-3">
              <label for="preparer2" class="flex items-center cursor-pointer flex-1">
                <img src="/placeholder.svg?height=30&width=30" alt="Preparador" class="h-10 w-10 rounded-full mr-3">
                <div>
                  <h4 class="font-bold text-gray-800">Ana López</h4>
                  <p class="text-gray-600 text-sm">Chef Sushi</p>
                </div>
              </label>
            </div>
            
            <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" name="preparer" id="preparer3" value="Miguel Torres" class="mr-3">
              <label for="preparer3" class="flex items-center cursor-pointer flex-1">
                <img src="/placeholder.svg?height=30&width=30" alt="Preparador" class="h-10 w-10 rounded-full mr-3">
                <div>
                  <h4 class="font-bold text-gray-800">Miguel Torres</h4>
                  <p class="text-gray-600 text-sm">Chef Pizza</p>
                </div>
              </label>
            </div>
          </div>
          
          <div class="mb-4">
            <label for="estimatedTime" class="block text-gray-700 font-medium mb-2">Tiempo estimado de preparación</label>
            <select id="estimatedTime" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
              <option value="15">15 minutos</option>
              <option value="20" selected>20 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
            </select>
          </div>
          
          <div class="flex justify-end">
            <button type="button" class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
              Cancelar
            </button>
            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              Confirmar
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

    // Make the entire row clickable for radio buttons
    const radioRows = modal.querySelectorAll(".flex.items-center.p-3.border")
    radioRows.forEach((row) => {
      row.addEventListener("click", function () {
        const radio = this.querySelector('input[type="radio"]')
        radio.checked = true
      })
    })

    // Add event listener to form submission
    const acceptOrderForm = modal.querySelector("#acceptOrderForm")
    acceptOrderForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const preparer = document.querySelector('input[name="preparer"]:checked').value
      const estimatedTime = document.getElementById("estimatedTime").value

      // Show notification
      showNotification(`Pedido ${orderId} aceptado. ${preparer} lo preparará en ${estimatedTime} minutos.`)

      // Close modal
      document.body.removeChild(modal)

      // Update order card status
      if (orderCard) {
        // Animate card removal
        orderCard.style.transition = "all 0.5s ease"
        orderCard.style.opacity = "0"
        orderCard.style.transform = "scale(0.8)"

        setTimeout(() => {
          orderCard.remove()
        }, 500)
      }
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show reject order confirmation
  function showRejectOrderConfirmation(orderId, orderCard) {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Rechazar Pedido ${orderId}</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <p class="text-gray-600 mb-4">¿Estás seguro de que deseas rechazar este pedido? Esta acción no se puede deshacer.</p>
        
        <form id="rejectOrderForm">
          <div class="mb-6">
            <label for="rejectReason" class="block text-gray-700 font-medium mb-2">Motivo del rechazo</label>
            <select id="rejectReason" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mb-2">
              <option value="unavailable">Productos no disponibles</option>
              <option value="busy">Restaurante muy ocupado</option>
              <option value="closed">Restaurante a punto de cerrar</option>
              <option value="other">Otro motivo</option>
            </select>
            <textarea id="rejectComment" placeholder="Comentarios adicionales (opcional)" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"></textarea>
          </div>
          
          <div class="flex justify-end">
            <button type="button" class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
              Cancelar
            </button>
            <button type="submit" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
              Rechazar Pedido
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
    const rejectOrderForm = modal.querySelector("#rejectOrderForm")
    rejectOrderForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const rejectReason = document.getElementById("rejectReason").value
      const rejectComment = document.getElementById("rejectComment").value

      // Show notification
      showNotification(`Pedido ${orderId} rechazado.`)

      // Close modal
      document.body.removeChild(modal)

      // Update order card status
      if (orderCard) {
        // Animate card removal
        orderCard.style.transition = "all 0.5s ease"
        orderCard.style.opacity = "0"
        orderCard.style.transform = "scale(0.8)"

        setTimeout(() => {
          orderCard.remove()
        }, 500)
      }
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show assign delivery person modal
  function showAssignDeliveryPersonModal(orderId, orderCard) {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Asignar Repartidor</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <p class="text-gray-600 mb-4">Selecciona el repartidor para el pedido ${orderId}:</p>
        
        <form id="assignDeliveryForm">
          <div class="space-y-3 mb-6">
            <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" name="deliveryPerson" id="delivery1" value="Miguel Torres" class="mr-3" checked>
              <label for="delivery1" class="flex items-center cursor-pointer flex-1">
                <img src="/placeholder.svg?height=30&width=30" alt="Repartidor" class="h-10 w-10 rounded-full mr-3">
                <div>
                  <h4 class="font-bold text-gray-800">Miguel Torres</h4>
                  <p class="text-gray-600 text-sm">Disponible - 2 pedidos en curso</p>
                </div>
              </label>
            </div>
            
            <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" name="deliveryPerson" id="delivery2" value="Carlos Díaz" class="mr-3">
              <label for="delivery2" class="flex items-center cursor-pointer flex-1">
                <img src="/placeholder.svg?height=30&width=30" alt="Repartidor" class="h-10 w-10 rounded-full mr-3">
                <div>
                  <h4 class="font-bold text-gray-800">Carlos Díaz</h4>
                  <p class="text-gray-600 text-sm">Disponible - 1 pedido en curso</p>
                </div>
              </label>
            </div>
            
            <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" name="deliveryPerson" id="delivery3" value="Laura Gómez" class="mr-3">
              <label for="delivery3" class="flex items-center cursor-pointer flex-1">
                <img src="/placeholder.svg?height=30&width=30" alt="Repartidor" class="h-10 w-10 rounded-full mr-3">
                <div>
                  <h4 class="font-bold text-gray-800">Laura Gómez</h4>
                  <p class="text-gray-600 text-sm">Disponible - 0 pedidos en curso</p>
                </div>
              </label>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button type="button" class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
              Cancelar
            </button>
            <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              Asignar
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

    // Make the entire row clickable for radio buttons
    const radioRows = modal.querySelectorAll(".flex.items-center.p-3.border")
    radioRows.forEach((row) => {
      row.addEventListener("click", function () {
        const radio = this.querySelector('input[type="radio"]')
        radio.checked = true
      })
    })

    // Add event listener to form submission
    const assignDeliveryForm = modal.querySelector("#assignDeliveryForm")
    assignDeliveryForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const deliveryPerson = document.querySelector('input[name="deliveryPerson"]:checked').value

      // Show notification
      showNotification(`Pedido ${orderId} asignado a ${deliveryPerson} para entrega.`)

      // Close modal
      document.body.removeChild(modal)

      // Update order card status
      if (orderCard) {
        // Animate card removal
        orderCard.style.transition = "all 0.5s ease"
        orderCard.style.opacity = "0"
        orderCard.style.transform = "scale(0.8)"

        setTimeout(() => {
          orderCard.remove()
        }, 500)
      }
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show order details modal
  function showOrderDetailsModal(orderId) {
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
            <h3 class="font-bold text-gray-800 mb-2">Información del Cliente</h3>
            <p class="text-gray-600"><span class="font-medium">Nombre:</span> Juan Pérez</p>
            <p class="text-gray-600"><span class="font-medium">Email:</span> juan@email.com</p>
            <p class="text-gray-600"><span class="font-medium">Teléfono:</span> +56 9 1234 5678</p>
            <p class="text-gray-600"><span class="font-medium">Dirección:</span> Calle Principal 123, Santiago</p>
          </div>
          <div>
            <h3 class="font-bold text-gray-800 mb-2">Información del Pedido</h3>
            <p class="text-gray-600"><span class="font-medium">Fecha:</span> 23/04/2023, 10:23 AM</p>
            <p class="text-gray-600"><span class="font-medium">Estado:</span> <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completado</span></p>
            <p class="text-gray-600"><span class="font-medium">Método de Pago:</span> Tarjeta de Crédito</p>
            <p class="text-gray-600"><span class="font-medium">Repartidor:</span> Miguel Torres</p>
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
          <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            Imprimir
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

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show notifications modal
  function showNotificationsModal() {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Notificaciones</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div class="p-3 border rounded-lg bg-yellow-50">
            <div class="flex items-start">
              <div class="bg-yellow-100 p-2 rounded-full mr-3">
                <i class="fas fa-shopping-bag text-yellow-600"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">Nuevo Pedido</h4>
                <p class="text-gray-600 text-sm">Pedido #12350 recibido de Laura Martínez.</p>
                <p class="text-gray-500 text-xs mt-1">Hace 2 minutos</p>
              </div>
            </div>
          </div>
          <div class="p-3 border rounded-lg bg-blue-50">
            <div class="flex items-start">
              <div class="bg-blue-100 p-2 rounded-full mr-3">
                <i class="fas fa-check-circle text-blue-600"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">Pedido Completado</h4>
                <p class="text-gray-600 text-sm">Pedido #12347 entregado a Roberto Sánchez.</p>
                <p class="text-gray-500 text-xs mt-1">Hace 30 minutos</p>
              </div>
            </div>
          </div>
          <div class="p-3 border rounded-lg bg-green-50">
            <div class="flex items-start">
              <div class="bg-green-100 p-2 rounded-full mr-3">
                <i class="fas fa-dollar-sign text-green-600"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">Pago Recibido</h4>
                <p class="text-gray-600 text-sm">Pago de $38.96 recibido por el pedido #12345.</p>
                <p class="text-gray-500 text-xs mt-1">Hace 45 minutos</p>
              </div>
            </div>
          </div>
          <div class="p-3 border rounded-lg bg-purple-50">
            <div class="flex items-start">
              <div class="bg-purple-100 p-2 rounded-full mr-3">
                <i class="fas fa-star text-purple-600"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">Nueva Reseña</h4>
                <p class="text-gray-600 text-sm">Ana Martínez calificó su pedido con 5 estrellas.</p>
                <p class="text-gray-500 text-xs mt-1">Hace 1 hora</p>
              </div>
            </div>
          </div>
          <div class="p-3 border rounded-lg bg-red-50">
            <div class="flex items-start">
              <div class="bg-red-100 p-2 rounded-full mr-3">
                <i class="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">Alerta de Inventario</h4>
                <p class="text-gray-600 text-sm">El producto "Dragon Roll" está por agotarse.</p>
                <p class="text-gray-500 text-xs mt-1">Hace 2 horas</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
            Cerrar
          </button>
          <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            Marcar como leídas
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

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to show export options modal
  function showExportOptionsModal() {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Exportar Reporte</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <p class="text-gray-600 mb-4">Selecciona el formato de exportación:</p>
        <div class="space-y-3 mb-6">
          <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div class="bg-red-100 p-2 rounded-full mr-3">
              <i class="fas fa-file-pdf text-red-600"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-800">PDF</h4>
              <p class="text-gray-600 text-sm">Exportar como documento PDF</p>
            </div>
          </div>
          <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div class="bg-green-100 p-2 rounded-full mr-3">
              <i class="fas fa-file-excel text-green-600"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-800">Excel</h4>
              <p class="text-gray-600 text-sm">Exportar como hoja de cálculo Excel</p>
            </div>
          </div>
          <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div class="bg-blue-100 p-2 rounded-full mr-3">
              <i class="fas fa-file-csv text-blue-600"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-800">CSV</h4>
              <p class="text-gray-600 text-sm">Exportar como archivo CSV</p>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
            Cancelar
          </button>
          <button class="export-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            Exportar
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

    // Add event listeners to export format options
    const exportOptions = modal.querySelectorAll(".flex.items-center.p-3")
    let selectedOption = null

    exportOptions.forEach((option) => {
      option.addEventListener("click", () => {
        // Remove selected class from all options
        exportOptions.forEach((opt) => opt.classList.remove("bg-purple-50", "border-purple-300"))

        // Add selected class to clicked option
        option.classList.add("bg-purple-50", "border-purple-300")
        selectedOption = option
      })
    })

    // Add event listener to export button
    const exportBtn = modal.querySelector(".export-btn")
    exportBtn.addEventListener("click", () => {
      if (selectedOption) {
        const formatName = selectedOption.querySelector("h4").textContent.trim()

        // Show notification
        showNotification(`Exportando reporte en formato ${formatName}`)

        // Simulate download
        setTimeout(() => {
          showNotification(`Reporte en formato ${formatName} descargado correctamente`)
        }, 1500)

        // Close modal
        document.body.removeChild(modal)
      } else {
        alert("Por favor selecciona un formato de exportación")
      }
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Function to initialize sales chart on dashboard
  function initializeSalesChart() {
    const salesCtx = document.getElementById("salesChart")
    if (salesCtx) {
      const salesChart = new Chart(salesCtx, {
        type: "line",
        data: {
          labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
          datasets: [
            {
              label: "Ventas",
              data: [120, 190, 300, 500, 450, 380, 240, 190, 210],
              fill: false,
              borderColor: "rgba(139, 92, 246, 1)",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    }
  }

  // Function to initialize report charts
  function initializeReportCharts() {
    // Daily Sales Chart
    const dailySalesCtx = document.getElementById("dailySalesChart")
    if (dailySalesCtx) {
      const dailySalesChart = new Chart(dailySalesCtx, {
        type: "bar",
        data: {
          labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          datasets: [
            {
              label: "Ventas",
              data: [650, 590, 800, 810, 560, 950, 400],
              backgroundColor: "rgba(139, 92, 246, 0.8)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    }

    // Category Sales Chart
    const categorySalesCtx = document.getElementById("categorySalesChart")
    if (categorySalesCtx) {
      const categorySalesChart = new Chart(categorySalesCtx, {
        type: "pie",
        data: {
          labels: ["Pizza", "Sushi", "Bebidas"],
          datasets: [
            {
              data: [45, 35, 20],
              backgroundColor: ["rgba(139, 92, 246, 0.8)", "rgba(59, 130, 246, 0.8)", "rgba(16, 185, 129, 0.8)"],
              borderColor: ["rgba(139, 92, 246, 1)", "rgba(59, 130, 246, 1)", "rgba(16, 185, 129, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      })
    }
  }

  // Function to show notification
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
})
