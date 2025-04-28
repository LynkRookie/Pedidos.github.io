document.addEventListener("DOMContentLoaded", () => {
  // Sidebar navigation links
  const sidebarLinks = document.querySelectorAll(".sidebar-link")

  // Action buttons
  const exportReportBtn = document.querySelector(".bg-purple-600.hover\\:bg-purple-700")
  const dateFilter = document.querySelector("select.border.border-gray-300")
  const notificationBtn = document.querySelector(".fas.fa-bell").parentElement
  const userProfileBtn = document.querySelector(".relative.group > button")

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
        case "Dashboard":
          showSection("dashboard")
          break
        case "Usuarios":
          showUsersSection()
          break
        case "Vendedores":
          showVendorsSection()
          break
        case "Productos":
          showProductsSection()
          break
        case "Pedidos":
          showOrdersSection()
          break
        case "Estadísticas":
          showStatisticsSection()
          break
        case "Configuración":
          showSettingsSection()
          break
        case "Cerrar Sesión":
          window.location.href = "login.html"
          break
      }
    })
  })

  // Replace date filter dropdown with calendar picker
  if (dateFilter) {
    const dateFilterContainer = dateFilter.parentElement
    const dateFilterLabel = dateFilterContainer.querySelector("h3")
    
    // Create date picker input
    const datePicker = document.createElement("input")
    datePicker.type = "date"
    datePicker.className = "border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
    datePicker.value = new Date().toISOString().split('T')[0] // Set to today's date
    
    // Replace the select with the date picker
    dateFilterContainer.replaceChild(datePicker, dateFilter)
    
    // Add event listener to the date picker
    datePicker.addEventListener("change", function() {
      const selectedDate = new Date(this.value)
      const formattedDate = selectedDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      
      showNotification(`Filtrando datos para: ${formattedDate}`)
      
      // Simulate loading data
      const dashboardContent = document.querySelector("main")
      dashboardContent.style.opacity = "0.5"
      
      setTimeout(() => {
        dashboardContent.style.opacity = "1"
        showNotification("Datos actualizados")
      }, 1000)
    })
  }

  // Handle Export Report button
  if (exportReportBtn) {
    exportReportBtn.addEventListener("click", () => {
      // Show export options modal
      showExportOptionsModal()
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
    
    // Change "Mi Perfil" to "Editar Perfil"
    const profileLink = document.querySelector(".relative.group > button + div a:first-child")
    if (profileLink) {
      profileLink.innerHTML = '<i class="fas fa-user-edit mr-2"></i> Editar Perfil'
    }
  }

  // Function to show users section
  function showUsersSection() {
    // Create users section content
    const mainContent = document.querySelector("main")
    const currentContent = mainContent.innerHTML
    
    // Save current content to restore later if needed
    mainContent.dataset.dashboardContent = currentContent
    
    // Replace with users section
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <p class="text-gray-600">Administra los usuarios registrados en la plataforma.</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Usuarios Registrados</h2>
          <div class="flex space-x-2">
            <input type="text" placeholder="Buscar usuario..." class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
            <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
              <i class="fas fa-search mr-2"></i> Buscar
            </button>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-gray-600 font-medium">ID</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Usuario</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Email</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Fecha Registro</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedidos</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#001</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Usuario" class="h-8 w-8 rounded-full mr-2">
                    <div>
                      <span class="block text-gray-800">Juan Pérez</span>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">juan@email.com</td>
                <td class="py-3 px-4 text-gray-600">15/03/2023</td>
                <td class="py-3 px-4 text-gray-800">24</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#002</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Usuario" class="h-8 w-8 rounded-full mr-2">
                    <div>
                      <span class="block text-gray-800">María González</span>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">maria@email.com</td>
                <td class="py-3 px-4 text-gray-600">20/03/2023</td>
                <td class="py-3 px-4 text-gray-800">18</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#003</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Usuario" class="h-8 w-8 rounded-full mr-2">
                    <div>
                      <span class="block text-gray-800">Roberto Sánchez</span>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">roberto@email.com</td>
                <td class="py-3 px-4 text-gray-600">25/03/2023</td>
                <td class="py-3 px-4 text-gray-800">7</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Inactivo</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#004</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Usuario" class="h-8 w-8 rounded-full mr-2">
                    <div>
                      <span class="block text-gray-800">Laura Martínez</span>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">laura@email.com</td>
                <td class="py-3 px-4 text-gray-600">01/04/2023</td>
                <td class="py-3 px-4 text-gray-800">12</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-6 flex justify-between items-center">
          <div class="text-gray-600">Mostrando 1-4 de 56 usuarios</div>
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
    const searchButton = mainContent.querySelector("button.bg-purple-600")
    if (searchButton) {
      searchButton.addEventListener("click", () => {
        const searchInput = mainContent.querySelector("input[type='text']")
        if (searchInput && searchInput.value.trim() !== "") {
          showNotification(`Buscando: ${searchInput.value}`)
        }
      })
    }
  }

  // Function to show vendors section
  function showVendorsSection() {
    // Create vendors section content
    const mainContent = document.querySelector("main")
    const currentContent = mainContent.innerHTML
    
    // Save current content to restore later if needed
    mainContent.dataset.dashboardContent = currentContent
    
    // Replace with vendors section
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Vendedores</h1>
        <p class="text-gray-600">Administra los vendedores registrados en la plataforma.</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Vendedores Registrados</h2>
          <div class="flex space-x-2">
            <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300">
              <i class="fas fa-plus mr-2"></i> Nuevo Vendedor
            </button>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-gray-600 font-medium">ID</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Vendedor</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Email</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Teléfono</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Ventas</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Calificación</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#V001</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Vendedor" class="h-8 w-8 rounded-full mr-2">
                    <div>
                      <span class="block text-gray-800">Carlos Rodríguez</span>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">carlos@email.com</td>
                <td class="py-3 px-4 text-gray-600">+56 9 1234 5678</td>
                <td class="py-3 px-4 text-gray-800">$12,450</td>
                <td class="py-3 px-4 text-gray-800">
                  <div class="flex text-yellow-500">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <span class="ml-1 text-gray-600">4.5</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#V002</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Vendedor" class="h-8 w-8 rounded-full mr-2">
                    <div>
                      <span class="block text-gray-800">Ana López</span>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">ana@email.com</td>
                <td class="py-3 px-4 text-gray-600">+56 9 8765 4321</td>
                <td class="py-3 px-4 text-gray-800">$9,875</td>
                <td class="py-3 px-4 text-gray-800">
                  <div class="flex text-yellow-500">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                    <span class="ml-1 text-gray-600">4.0</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#V003</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Vendedor" class="h-8 w-8 rounded-full mr-2">
                    <div>
                      <span class="block text-gray-800">Miguel Torres</span>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">miguel@email.com</td>
                <td class="py-3 px-4 text-gray-600">+56 9 5555 6666</td>
                <td class="py-3 px-4 text-gray-800">$7,320</td>
                <td class="py-3 px-4 text-gray-800">
                  <div class="flex text-yellow-500">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                    <i class="far fa-star"></i>
                    <span class="ml-1 text-gray-600">3.5</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Inactivo</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `
    
    // Add event listeners to the new content
    const newVendorButton = mainContent.querySelector("button.bg-green-600")
    if (newVendorButton) {
      newVendorButton.addEventListener("click", () => {
        showNotification("Formulario para nuevo vendedor")
      })
    }
  }

  // Function to show products section
  function showProductsSection() {
    // Create products section content
    const mainContent = document.querySelector("main")
    const currentContent = mainContent.innerHTML
    
    // Save current content to restore later if needed
    mainContent.dataset.dashboardContent = currentContent
    
    // Replace with products section
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
        <p class="text-gray-600">Administra los productos disponibles en la plataforma.</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Productos</h2>
          <div class="flex space-x-2">
            <select class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
              <option>Todas las categorías</option>
              <option>Sushi</option>
              <option>Pizza</option>
              <option>Bebidas</option>
            </select>
            <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300">
              <i class="fas fa-plus mr-2"></i> Nuevo Producto
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="border rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=California+Roll" alt="California Roll" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">California Roll</h3>
                <span class="text-purple-600 font-bold">$8.99</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Delicioso roll con aguacate, pepino y cangrejo.</p>
              <div class="flex justify-between items-center">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Disponible</span>
                <div>
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="border rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Pizza+Pepperoni" alt="Pizza Pepperoni" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Pizza Pepperoni</h3>
                <span class="text-purple-600 font-bold">$13.99</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Deliciosa pizza con abundante pepperoni y queso mozzarella.</p>
              <div class="flex justify-between items-center">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Disponible</span>
                <div>
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="border rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Mojito" alt="Mojito" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Mojito</h3>
                <span class="text-purple-600 font-bold">$6.99</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Clásico cóctel con ron, lima, menta y azúcar.</p>
              <div class="flex justify-between items-center">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Disponible</span>
                <div>
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="border rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Dragon+Roll" alt="Dragon Roll" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Dragon Roll</h3>
                <span class="text-purple-600 font-bold">$12.99</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Exquisito roll con anguila, aguacate y pepino.</p>
              <div class="flex justify-between items-center">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Bajo stock</span>
                <div>
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="border rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Limonada" alt="Limonada" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Limonada</h3>
                <span class="text-purple-600 font-bold">$4.99</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Refrescante limonada natural con menta.</p>
              <div class="flex justify-between items-center">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Disponible</span>
                <div>
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="border rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=150&width=300&text=Pizza+Hawaiana" alt="Pizza Hawaiana" class="w-full h-40 object-cover">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Pizza Hawaiana</h3>
                <span class="text-purple-600 font-bold">$12.99</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">Pizza con jamón, piña y queso mozzarella.</p>
              <div class="flex justify-between items-center">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Agotado</span>
                <div>
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    
    // Add event listeners to the new content
    const newProductButton = mainContent.querySelector("button.bg-purple-600")
    if (newProductButton) {
      newProductButton.addEventListener("click", () => {
        showNotification("Formulario para nuevo producto")
      })
    }
    
    const categorySelect = mainContent.querySelector("select")
    if (categorySelect) {
      categorySelect.addEventListener("change", function() {
        showNotification(`Filtrando por categoría: ${this.value}`)
      })
    }
  }

  // Function to show orders section
  function showOrdersSection() {
    // Create orders section content
    const mainContent = document.querySelector("main")
    const currentContent = mainContent.innerHTML
    
    // Save current content to restore later if needed
    mainContent.dataset.dashboardContent = currentContent
    
    // Replace with orders section
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
        <p class="text-gray-600">Administra todos los pedidos de la plataforma.</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Pedidos Recientes</h2>
          <div class="flex space-x-2">
            <select class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
              <option>Todos los estados</option>
              <option>Pendiente</option>
              <option>En Proceso</option>
              <option>Completado</option>
              <option>Cancelado</option>
            </select>
            <input type="date" class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedido #</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Cliente</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Vendedor</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Fecha</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
                <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12345</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Juan Pérez</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Carlos Rodríguez</td>
                <td class="py-3 px-4 text-gray-600">Hoy, 10:23 AM</td>
                <td class="py-3 px-4 text-gray-800">$35.99</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completado</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
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
                <td class="py-3 px-4 text-gray-600">Carlos Rodríguez</td>
                <td class="py-3 px-4 text-gray-600">Hoy, 9:45 AM</td>
                <td class="py-3 px-4 text-gray-800">$42.50</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Proceso</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                  <button class="text-yellow-600 hover:text-yellow-800 mr-2"><i class="fas fa-pause"></i></button>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12347</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Roberto Sánchez</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Carlos Rodríguez</td>
                <td class="py-3 px-4 text-gray-600">Ayer, 3:30 PM</td>
                <td class="py-3 px-4 text-gray-800">$28.75</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completado</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
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
                <td class="py-3 px-4 text-gray-600">Carlos Rodríguez</td>
                <td class="py-3 px-4 text-gray-600">Ayer, 2:15 PM</td>
                <td class="py-3 px-4 text-gray-800">$36.96</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completado</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-800">#12349</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                    <span class="text-gray-800">Pedro Ramírez</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600">Ana López</td>
                <td class="py-3 px-4 text-gray-600">Ayer, 11:45 AM</td>
                <td class="py-3 px-4 text-gray-800">$22.50</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
                </td>
                <td class="py-3 px-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-eye"></i></button>
                  <button class="text-green-600 hover:text-green-800 mr-2"><i class="fas fa-check"></i></button>
                  <button class="text-red-600 hover:text-red-800"><i class="fas fa-times"></i></button>
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
    const statusFilter = mainContent.querySelector("select")
    if (statusFilter) {
      statusFilter.addEventListener("change", function() {
        showNotification(`Filtrando por estado: ${this.value}`)
      })
    }
    
    const dateFilter = mainContent.querySelector("input[type='date']")
    if (dateFilter) {
      dateFilter.addEventListener("change", function() {
        showNotification(`Filtrando por fecha: ${this.value}`)
      })
    }
    
    const viewButtons = mainContent.querySelectorAll(".text-blue-600")
    viewButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        const orderRow = this.closest("tr")
        const orderId = orderRow.querySelector("td:first-child").textContent.trim()
        showOrderDetailsModal(orderId)
      })
    })
  }

  // Function to show statistics section
  function showStatisticsSection() {
    // Create statistics section content
    const mainContent = document.querySelector("main")
    const currentContent = mainContent.innerHTML
    
    // Save current content to restore later if needed
    mainContent.dataset.dashboardContent = currentContent
    
    // Replace with statistics section
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Estadísticas</h1>
        <p class="text-gray-600">Análisis detallado del rendimiento de la plataforma.</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Ventas por Categoría</h2>
          <div class="flex space-x-2">
            <select class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
              <option>Últimos 7 días</option>
              <option>Este mes</option>
              <option>Mes pasado</option>
              <option>Este año</option>
            </select>
          </div>
        </div>
        
        <div class="h-80">
          <canvas id="salesChart"></canvas>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Pedidos por Día</h2>
          <div class="flex space-x-2">
            <select class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
              <option>Últimos 7 días</option>
              <option>Este mes</option>
              <option>Mes pasado</option>
              <option>Este año</option>
            </select>
          </div>
        </div>
        
        <div class="h-80">
          <canvas id="ordersChart"></canvas>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">Vendedores Top</h2>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center">
              <img src="/placeholder.svg?height=30&width=30" alt="Vendedor" class="h-10 w-10 rounded-full mr-3">
              <div class="flex-1">
                <div class="flex justify-between">
                  <h4 class="font-bold text-gray-800">Carlos Rodríguez</h4>
                  <span class="text-purple-600 font-bold">$12,450</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div class="bg-purple-600 h-2.5 rounded-full" style="width: 85%"></div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center">
              <img src="/placeholder.svg?height=30&width=30" alt="Vendedor" class="h-10 w-10 rounded-full mr-3">
              <div class="flex-1">
                <div class="flex justify-between">
                  <h4 class="font-bold text-gray-800">Ana López</h4>
                  <span class="text-purple-600 font-bold">$9,875</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div class="bg-purple-600 h-2.5 rounded-full" style="width: 70%"></div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center">
              <img src="/placeholder.svg?height=30&width=30" alt="Vendedor" class="h-10 w-10 rounded-full mr-3">
              <div class="flex-1">
                <div class="flex justify-between">
                  <h4 class="font-bold text-gray-800">Miguel Torres</h4>
                  <span class="text-purple-600 font-bold">$7,320</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div class="bg-purple-600 h-2.5 rounded-full" style="width: 55%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">Productos Más Vendidos</h2>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center">
              <img src="/placeholder.svg?height=30&width=30&text=Pizza" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
              <div class="flex-1">
                <div class="flex justify-between">
                  <h4 class="font-bold text-gray-800">Pizza Pepperoni</h4>
                  <span class="text-purple-600 font-bold">342 vendidos</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div class="bg-purple-600 h-2.5 rounded-full" style="width: 90%"></div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center">
              <img src="/placeholder.svg?height=30&width=30&text=Sushi" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
              <div class="flex-1">
                <div class="flex justify-between">
                  <h4 class="font-bold text-gray-800">California Roll</h4>
                  <span class="text-purple-600 font-bold">287 vendidos</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div class="bg-purple-600 h-2.5 rounded-full" style="width: 75%"></div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center">
              <img src="/placeholder.svg?height=30&width=30&text=Mojito" alt="Producto" class="h-10 w-10 rounded mr-3 object-cover">
              <div class="flex-1">
                <div class="flex justify-between">
                  <h4 class="font-bold text-gray-800">Mojito</h4>
                  <span class="text-purple-600 font-bold">215 vendidos</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div class="bg-purple-600 h-2.5 rounded-full" style="width: 60%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    
    // Initialize charts
    setTimeout(() => {
      initializeCharts()
    }, 100)
    
    // Add event listeners to the new content
    const periodSelects = mainContent.querySelectorAll("select")
    periodSelects.forEach(select => {
      select.addEventListener("change", function() {
        showNotification(`Cambiando período a: ${this.value}`)
        
        // Reinitialize charts with new data
        setTimeout(() => {
          initializeCharts()
        }, 500)
      })
    })
  }

  // Function to show settings section
  function showSettingsSection() {
    // Create settings section content
    const mainContent = document.querySelector("main")
    const currentContent = mainContent.innerHTML
    
    // Save current content to restore later if needed
    mainContent.dataset.dashboardContent = currentContent
    
    // Replace with settings section
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
              <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-300 mb-2">
                Cambiar Foto
              </button>
              <p class="text-gray-500 text-sm text-center">JPG, GIF o PNG. Máximo 2MB</p>
            </div>
          </div>
          
          <div class="md:w-2/3">
            <form>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label for="firstName" class="block text-gray-700 font-medium mb-2">Nombre</label>
                  <input type="text" id="firstName" value="Ana" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                </div>
                <div>
                  <label for="lastName" class="block text-gray-700 font-medium mb-2">Apellido</label>
                  <input type="text" id="lastName" value="Martínez" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                </div>
                <div>
                  <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
                  <input type="email" id="email" value="ana@email.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                </div>
                <div>
                  <label for="phone" class="block text-gray-700 font-medium mb-2">Teléfono</label>
                  <input type="tel" id="phone" value="+56 9 1234 5678" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                </div>
              </div>
              
              <div class="mb-6">
                <label for="address" class="block text-gray-700 font-medium mb-2">Dirección</label>
                <input type="text" id="address" value="Av. Principal 123, Santiago" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
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
        
        <form>
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
    const profileForm = mainContent.querySelector("form")
    if (profileForm) {
      profileForm.addEventListener("submit", function(e) {
        e.preventDefault()
        showNotification("Perfil actualizado correctamente")
      })
    }
    
    const changePhotoBtn = mainContent.querySelector("button.bg-purple-600")
    if (changePhotoBtn) {
      changePhotoBtn.addEventListener("click", function() {
        showNotification("Funcionalidad de cambio de foto")
      })
    }
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
    modal.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(modal)
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

    modal.querySelector(".export-btn").addEventListener("click", () => {
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
                <i class="fas fa-user-plus text-yellow-600"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">Nuevo Usuario Registrado</h4>
                <p class="text-gray-600 text-sm">María González se ha registrado en la plataforma.</p>
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
                <p class="text-gray-600 text-sm">El producto "California Roll" está por agotarse.</p>
                <p class="text-gray-500 text-xs mt-1">Hace 3 horas</p>
              </div>
            </div>
          </div>
          <div class="p-3 border rounded-lg bg-green-50">
            <div class="flex items-start">
              <div class="bg-green-100 p-2 rounded-full mr-3">
                <i class="fas fa-chart-line text-green-600"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">Ventas Incrementadas</h4>
                <p class="text-gray-600 text-sm">Las ventas han aumentado un 15% respecto al mes anterior.</p>
                <p class="text-gray-500 text-xs mt-1">Hace 5 horas</p>
              </div>
            </div>
          </div>
          <div class="p-3 border rounded-lg bg-blue-50">
            <div class="flex items-start">
              <div class="bg-blue-100 p-2 rounded-full mr-3">
                <i class="fas fa-user-tie text-blue-600"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">Nuevo Vendedor</h4>
                <p class="text-gray-600 text-sm">Roberto Sánchez se ha unido como vendedor.</p>
                <p class="text-gray-500 text-xs mt-1">Hace 1 día</p>
              </div>
            </div>
          </div>
          <div class="p-3 border rounded-lg bg-purple-50">
            <div class="flex items-start">
              <div class="bg-purple-100 p-2 rounded-full mr-3">
                <i class="fas fa-cog text-purple-600"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">Actualización del Sistema</h4>
                <p class="text-gray-600 text-sm">Se ha instalado la versión 2.0 del sistema.</p>
                <p class="text-gray-500 text-xs mt-1">Hace 2 días</p>
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

  // Function to initialize charts
  function initializeCharts() {
    // Sales by Category Chart
    const salesCtx = document.getElementById('salesChart')
    if (salesCtx) {
      const salesChart = new Chart(salesCtx, {
        type: 'pie',
        data: {
          labels: ['Sushi', 'Pizza', 'Bebidas'],
          datasets: [{
            data: [45, 35, 20],
            backgroundColor: [
              'rgba(139, 92, 246, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)'
            ],
            borderColor: [
              'rgba(139, 92, 246, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }
    
    // Orders by Day Chart
    const ordersCtx = document.getElementById('ordersChart')
    if (ordersCtx) {
      const ordersChart = new Chart(ordersCtx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: 'Pedidos',
            data: [65, 59, 80, 81, 56, 95, 40],
            fill: false,
            borderColor: 'rgba(139, 92, 246, 1)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
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

  // Function to show section
  function showSection(sectionName) {
    // This would normally load different content
    // For demo purposes, we'll just show a notification
    showNotification(`Sección de ${sectionName} cargada`)

    // Activate the corresponding sidebar link
    sidebarLinks.forEach((link) => {
      const linkText = link.querySelector("span").textContent.trim().toLowerCase()

      if (
        (sectionName === "dashboard" && linkText === "dashboard") ||
        (sectionName === "users" && linkText === "usuarios") ||
        (sectionName === "vendors" && linkText === "vendedores") ||
        (sectionName === "products" && linkText === "productos") ||
        (sectionName === "orders" && linkText === "pedidos") ||
        (sectionName === "statistics" && linkText === "estadísticas") ||
        (sectionName === "settings" && linkText === "configuración")
      ) {
        link.classList.add("active")
      } else {
        link.classList.remove("active")
      }
    })
  }
})
