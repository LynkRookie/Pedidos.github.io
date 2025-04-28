document.addEventListener("DOMContentLoaded", () => {
    // Sidebar navigation links
    const sidebarLinks = document.querySelectorAll(".sidebar-link")
  
    // Action buttons
    const acceptButtons = document.querySelectorAll("button.bg-blue-500")
    const rejectButtons = document.querySelectorAll("button.bg-red-500")
    const readyForDeliveryBtn = document.querySelector("button.bg-green-500")
    const markDeliveredBtn = document.querySelectorAll("button.bg-green-500")[1]
    const assignDeliveryBtn = document.querySelector("button.bg-blue-500.hover\\:bg-blue-600")
    const viewAllLinks = document.querySelectorAll('a[href="#"]')
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
          case "Pedidos Nuevos":
            showSection("new-orders")
            break
          case "Pedidos en Proceso":
            showSection("processing-orders")
            break
          case "Pedidos Completados":
            showSection("completed-orders")
            break
          case "Historial":
            showSection("history")
            break
          case "Reportes":
            showSection("reports")
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
  
    // Handle Accept buttons
    acceptButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Get order info from the row
        const orderRow = this.closest("tr")
        const orderId = orderRow.querySelector("td:first-child").textContent.trim()
  
        // Show notification
        showNotification(`Pedido ${orderId} aceptado`)
  
        // Remove the row after a short delay
        setTimeout(() => {
          orderRow.remove()
  
          // Update order count in sidebar
          const orderCountBadge = document.querySelector(".sidebar-link .ml-auto")
          if (orderCountBadge) {
            const currentCount = Number.parseInt(orderCountBadge.textContent)
            orderCountBadge.textContent = currentCount - 1
          }
  
          // Update header notification count
          const notificationBadge = document.querySelector(".fas.fa-bell + span")
          if (notificationBadge) {
            const currentCount = Number.parseInt(notificationBadge.textContent)
            notificationBadge.textContent = currentCount - 1
          }
        }, 1000)
      })
    })
  
    // Handle Reject buttons
    rejectButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Get order info from the row
        const orderRow = this.closest("tr")
        const orderId = orderRow.querySelector("td:first-child").textContent.trim()
  
        // Show confirmation dialog
        if (confirm(`¿Estás seguro de rechazar el pedido ${orderId}?`)) {
          // Show notification
          showNotification(`Pedido ${orderId} rechazado`)
  
          // Remove the row after a short delay
          setTimeout(() => {
            orderRow.remove()
  
            // Update order count in sidebar
            const orderCountBadge = document.querySelector(".sidebar-link .ml-auto")
            if (orderCountBadge) {
              const currentCount = Number.parseInt(orderCountBadge.textContent)
              orderCountBadge.textContent = currentCount - 1
            }
  
            // Update header notification count
            const notificationBadge = document.querySelector(".fas.fa-bell + span")
            if (notificationBadge) {
              const currentCount = Number.parseInt(notificationBadge.textContent)
              notificationBadge.textContent = currentCount - 1
            }
          }, 1000)
        }
      })
    })
  
    // Handle Ready for Delivery button
    if (readyForDeliveryBtn) {
      readyForDeliveryBtn.addEventListener("click", function () {
        // Get order info from the row
        const orderRow = this.closest("tr")
        const orderId = orderRow.querySelector("td:first-child").textContent.trim()
  
        // Update status
        const statusSpan = orderRow.querySelector(".rounded-full")
        statusSpan.textContent = "Listo para Entrega"
        statusSpan.className = "px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
  
        // Update button
        this.textContent = "Asignar Repartidor"
        this.className = "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
  
        // Show notification
        showNotification(`Pedido ${orderId} listo para entrega`)
      })
    }
  
    // Handle Mark Delivered button
    if (markDeliveredBtn) {
      markDeliveredBtn.addEventListener("click", function () {
        // Get order info from the row
        const orderRow = this.closest("tr")
        const orderId = orderRow.querySelector("td:first-child").textContent.trim()
  
        // Show notification
        showNotification(`Pedido ${orderId} marcado como entregado`)
  
        // Remove the row after a short delay
        setTimeout(() => {
          orderRow.remove()
        }, 1000)
      })
    }
  
    // Handle Assign Delivery button
    if (assignDeliveryBtn) {
      assignDeliveryBtn.addEventListener("click", function () {
        // Get order info from the row
        const orderRow = this.closest("tr")
        const orderId = orderRow.querySelector("td:first-child").textContent.trim()
  
        // Show delivery person selection modal
        showDeliveryPersonModal(orderId, orderRow)
      })
    }
  
    // Handle "Ver todos" links
    viewAllLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()
  
        // Determine which "Ver todos" was clicked based on its parent section
        const parentSection = this.closest(".bg-white")
        const sectionTitle = parentSection.querySelector("h2").textContent.trim()
  
        if (sectionTitle === "Pedidos Nuevos") {
          showSection("new-orders")
        } else if (sectionTitle === "Pedidos en Proceso") {
          showSection("processing-orders")
        }
      })
    })
  
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
          (sectionName === "new-orders" && linkText === "pedidos nuevos") ||
          (sectionName === "processing-orders" && linkText === "pedidos en proceso") ||
          (sectionName === "completed-orders" && linkText === "pedidos completados") ||
          (sectionName === "history" && linkText === "historial") ||
          (sectionName === "reports" && linkText === "reportes") ||
          (sectionName === "settings" && linkText === "configuración")
        ) {
          link.classList.add("active")
        } else {
          link.classList.remove("active")
        }
      })
    }
  
    // Function to show delivery person selection modal
    function showDeliveryPersonModal(orderId, orderRow) {
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
                  <p class="text-gray-600 mb-4">Selecciona un repartidor para el pedido ${orderId}:</p>
                  <div class="space-y-3 mb-6">
                      <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <img src="/placeholder.svg?height=40&width=40" alt="Repartidor" class="h-10 w-10 rounded-full mr-3">
                          <div>
                              <h4 class="font-bold text-gray-800">Luis Ramírez</h4>
                              <p class="text-gray-600 text-sm">Disponible - 3 entregas pendientes</p>
                          </div>
                      </div>
                      <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <img src="/placeholder.svg?height=40&width=40" alt="Repartidor" class="h-10 w-10 rounded-full mr-3">
                          <div>
                              <h4 class="font-bold text-gray-800">Ana Torres</h4>
                              <p class="text-gray-600 text-sm">Disponible - 1 entrega pendiente</p>
                          </div>
                      </div>
                      <div class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <img src="/placeholder.svg?height=40&width=40" alt="Repartidor" class="h-10 w-10 rounded-full mr-3">
                          <div>
                              <h4 class="font-bold text-gray-800">Carlos Mendoza</h4>
                              <p class="text-gray-600 text-sm">Disponible - 0 entregas pendientes</p>
                          </div>
                      </div>
                  </div>
                  <div class="flex justify-end">
                      <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
                          Cancelar
                      </button>
                      <button class="assign-btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                          Asignar
                      </button>
                  </div>
              </div>
          `
  
      document.body.appendChild(modal)
  
      // Add event listeners to modal buttons
      modal.querySelector(".close-modal").addEventListener("click", () => {
        document.body.removeChild(modal)
      })
  
      // Add event listeners to delivery person options
      const deliveryOptions = modal.querySelectorAll(".flex.items-center.p-3")
      let selectedOption = null
  
      deliveryOptions.forEach((option) => {
        option.addEventListener("click", () => {
          // Remove selected class from all options
          deliveryOptions.forEach((opt) => opt.classList.remove("bg-purple-50", "border-purple-300"))
  
          // Add selected class to clicked option
          option.classList.add("bg-purple-50", "border-purple-300")
          selectedOption = option
        })
      })
  
      modal.querySelector(".assign-btn").addEventListener("click", () => {
        if (selectedOption) {
          const deliveryPersonName = selectedOption.querySelector("h4").textContent.trim()
  
          // Update status in the order row
          const statusSpan = orderRow.querySelector(".rounded-full")
          statusSpan.textContent = "En Camino"
          statusSpan.className = "px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
  
          // Update button
          const button = orderRow.querySelector("button")
          button.textContent = "Marcar Entregado"
          button.className = "bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
  
          // Show notification
          showNotification(`Pedido ${orderId} asignado a ${deliveryPersonName}`)
  
          // Close modal
          document.body.removeChild(modal)
        } else {
          alert("Por favor selecciona un repartidor")
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
                                  <i class="fas fa-bell text-yellow-600"></i>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-800">Nuevo Pedido #12350</h4>
                                  <p class="text-gray-600 text-sm">María González ha realizado un nuevo pedido.</p>
                                  <p class="text-gray-500 text-xs mt-1">Hace 5 minutos</p>
                              </div>
                          </div>
                      </div>
                      <div class="p-3 border rounded-lg bg-yellow-50">
                          <div class="flex items-start">
                              <div class="bg-yellow-100 p-2 rounded-full mr-3">
                                  <i class="fas fa-bell text-yellow-600"></i>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-800">Nuevo Pedido #12351</h4>
                                  <p class="text-gray-600 text-sm">Juan Pérez ha realizado un nuevo pedido.</p>
                                  <p class="text-gray-500 text-xs mt-1">Hace 15 minutos</p>
                              </div>
                          </div>
                      </div>
                      <div class="p-3 border rounded-lg bg-yellow-50">
                          <div class="flex items-start">
                              <div class="bg-yellow-100 p-2 rounded-full mr-3">
                                  <i class="fas fa-bell text-yellow-600"></i>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-800">Nuevo Pedido #12352</h4>
                                  <p class="text-gray-600 text-sm">Ana Martínez ha realizado un nuevo pedido.</p>
                                  <p class="text-gray-500 text-xs mt-1">Hace 30 minutos</p>
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
  })
  