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
            showSection("users")
            break
          case "Vendedores":
            showSection("vendors")
            break
          case "Productos":
            showSection("products")
            break
          case "Pedidos":
            showSection("orders")
            break
          case "Estadísticas":
            showSection("statistics")
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
  
    // Handle Export Report button
    if (exportReportBtn) {
      exportReportBtn.addEventListener("click", () => {
        // Show export options modal
        showExportOptionsModal()
      })
    }
  
    // Handle Date Filter
    if (dateFilter) {
      dateFilter.addEventListener("change", function () {
        const selectedOption = this.value
        showNotification(`Filtrando datos por: ${selectedOption}`)
  
        // This would normally update the dashboard data
        // For demo purposes, we'll just show a loading indicator
        const dashboardContent = document.querySelector("main")
        dashboardContent.style.opacity = "0.5"
  
        setTimeout(() => {
          dashboardContent.style.opacity = "1"
          showNotification("Datos actualizados")
        }, 1000)
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
    }
  
    // Function to show different sections
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
  
    // Add date picker functionality for custom date range
    const dateFilterSelect = document.querySelector("select.border.border-gray-300")
    if (dateFilterSelect) {
      dateFilterSelect.addEventListener("change", function () {
        if (this.value === "Personalizado") {
          showDateRangePickerModal()
        }
      })
    }
  
    // Function to show date range picker modal
    function showDateRangePickerModal() {
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
                  <div class="space-y-4">
                      <div>
                          <label for="startDate" class="block text-gray-700 font-medium mb-2">Fecha de Inicio</label>
                          <input type="date" id="startDate" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                      </div>
                      <div>
                          <label for="endDate" class="block text-gray-700 font-medium mb-2">Fecha de Fin</label>
                          <input type="date" id="endDate" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                      </div>
                  </div>
                  <div class="mt-6 flex justify-end">
                      <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
                          Cancelar
                      </button>
                      <button class="apply-date-range bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                          Aplicar
                      </button>
                  </div>
              </div>
          `
  
      document.body.appendChild(modal)
  
      // Add event listeners to modal buttons
      modal.querySelector(".close-modal").addEventListener("click", () => {
        document.body.removeChild(modal)
        // Reset select to previous value
        dateFilterSelect.value = "Hoy"
      })
  
      modal.querySelector(".apply-date-range").addEventListener("click", () => {
        const startDate = modal.querySelector("#startDate").value
        const endDate = modal.querySelector("#endDate").value
  
        if (startDate && endDate) {
          // Show notification
          showNotification(`Filtrando datos desde ${startDate} hasta ${endDate}`)
  
          // This would normally update the dashboard data
          // For demo purposes, we'll just show a loading indicator
          const dashboardContent = document.querySelector("main")
          dashboardContent.style.opacity = "0.5"
  
          setTimeout(() => {
            dashboardContent.style.opacity = "1"
            showNotification("Datos actualizados")
          }, 1000)
  
          // Close modal
          document.body.removeChild(modal)
        } else {
          alert("Por favor selecciona fechas de inicio y fin")
        }
      })
  
      // Close modal when clicking outside
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal)
          // Reset select to previous value
          dateFilterSelect.value = "Hoy"
        }
      })
    }
  })
  