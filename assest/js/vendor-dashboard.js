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

  // Inicialmente marcar la sección activa
  const currentPath = window.location.pathname
  if (currentPath.includes("vendor-dashboard")) {
    const dashboardLink = document.querySelector(".sidebar-link:has(.fa-tachometer-alt)")
    if (dashboardLink) {
      dashboardLink.classList.add("active")
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
      if (!parentSection) return

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

    // Modificar el menú desplegable del vendedor
    const dropdown = userProfileBtn.nextElementSibling
    if (dropdown) {
      // Mantener solo "Mi Perfil" y eliminar las otras opciones
      const menuItems = dropdown.querySelectorAll("a")
      menuItems.forEach((item) => {
        const text = item.textContent.trim()
        if (text.includes("Cerrar Sesión")) {
          item.remove()
        }
      })
    }
  }

  // Función para mostrar diferentes secciones
  function showSection(sectionName) {
    console.log(`Mostrando sección: ${sectionName}`) // Debug log

    // Activar el enlace correspondiente en la barra lateral
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

    // Mostrar contenido según la sección
    const mainContent = document.querySelector("main")
    if (!mainContent) {
      console.error("No se encontró el elemento main") // Debug log
      return
    }

    let content = ""
    switch (sectionName) {
      case "dashboard":
        content = createDashboardContent()
        break
      case "new-orders":
        content = createNewOrdersContent()
        break
      case "processing-orders":
        content = createProcessingOrdersContent()
        break
      case "completed-orders":
        content = createCompletedOrdersContent()
        break
      case "history":
        content = createHistoryContent()
        break
      case "reports":
        content = createReportsContent()
        break
      case "settings":
        content = createSettingsContent()
        break
      default:
        console.error(`Sección desconocida: ${sectionName}`) // Debug log
        return
    }

    // Limpiar el contenido principal y agregar el nuevo contenido
    mainContent.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Dashboard de Vendedor</h1>
        <p class="text-gray-600">Bienvenido, Carlos. Aquí puedes gestionar los pedidos.</p>
      </div>
      ${content}
    `

    // Reinicializar los eventos después de cambiar el contenido
    initializeEvents()
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

  // Función para mostrar el modal de asignar repartidor
  function showAssignDeliveryModal(orderId) {
    // Crear modal
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
        <div class="mb-4">
          <p class="text-gray-600 mb-2">Pedido #${orderId}</p>
          <label class="block text-gray-700 font-medium mb-2">Seleccionar Repartidor</label>
          <select class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="">Seleccionar repartidor...</option>
            <option value="1">Luis Morales</option>
            <option value="2">Ana García</option>
            <option value="3">Pedro Sánchez</option>
            <option value="4">María Torres</option>
          </select>
        </div>
        <div class="mt-6 flex justify-end">
          <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
            Cancelar
          </button>
          <button class="confirm-assign bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            Asignar
          </button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Agregar event listeners a los botones del modal
    modal.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    modal.querySelector(".confirm-assign").addEventListener("click", () => {
      const select = modal.querySelector("select")
      const deliveryPersonId = select.value
      const deliveryPersonName = select.options[select.selectedIndex].text

      if (deliveryPersonId) {
        document.body.removeChild(modal)
        assignDeliveryPerson(orderId, deliveryPersonId, deliveryPersonName)
      } else {
        // Mostrar error si no se seleccionó un repartidor
        const select = modal.querySelector("select")
        select.classList.add("border-red-500")

        // Verificar si ya existe un mensaje de error
        let errorMsg = modal.querySelector(".error-message")
        if (!errorMsg) {
          errorMsg = document.createElement("p")
          errorMsg.className = "text-red-500 text-sm mt-1 error-message"
          errorMsg.textContent = "Por favor, seleccione un repartidor"
          select.parentNode.appendChild(errorMsg)
        }
      }
    })

    // Cerrar modal al hacer clic fuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Función para asignar repartidor
  function assignDeliveryPerson(orderId, deliveryPersonId, deliveryPersonName) {
    // Buscar la fila del pedido
    const orderRows = document.querySelectorAll("tr")
    let orderRow = null

    orderRows.forEach((row) => {
      const id = row.querySelector("td:first-child")
      if (id && id.textContent.trim() === orderId) {
        orderRow = row
      }
    })

    if (orderRow) {
      // Actualizar el estado del pedido
      const statusCell = orderRow.querySelector("td:nth-child(4)")
      if (statusCell) {
        statusCell.innerHTML = `
          <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            En Progreso
          </span>
        `
      }

      // Actualizar la columna de repartidor
      const deliveryPersonCell = orderRow.querySelector("td:nth-child(5)")
      if (deliveryPersonCell) {
        deliveryPersonCell.textContent = deliveryPersonName
      }

      // Actualizar las acciones disponibles
      const actionsCell = orderRow.querySelector("td:last-child")
      if (actionsCell) {
        actionsCell.innerHTML = `
          <button class="view-order-details text-purple-600 hover:text-purple-800 mr-2">
            <i class="fas fa-eye"></i>
          </button>
          <button class="mark-delivered text-green-600 hover:text-green-800">
            <i class="fas fa-check-circle"></i>
          </button>
        `

        // Reinicializar eventos para los nuevos botones
        actionsCell.querySelector(".view-order-details").addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          showOrderDetailsModal(orderId)
        })

        actionsCell.querySelector(".mark-delivered").addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          confirmMarkAsDelivered(orderId, orderRow)
        })
      }

      showNotification(`Repartidor ${deliveryPersonName} asignado al pedido #${orderId}`)
    }
  }

  // Función para confirmar marcar como entregado
  function confirmMarkAsDelivered(orderId, orderRow) {
    // Crear modal de confirmación
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Confirmar Entrega</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <p class="text-gray-600 mb-4">¿Está seguro que desea marcar el pedido #${orderId} como entregado?</p>
        <div class="mt-6 flex justify-end">
          <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
            Cancelar
          </button>
          <button class="confirm-delivered bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            Confirmar Entrega
          </button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Agregar event listeners a los botones del modal
    modal.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    modal.querySelector(".confirm-delivered").addEventListener("click", () => {
      document.body.removeChild(modal)
      markAsDelivered(orderId, orderRow)
    })

    // Cerrar modal al hacer clic fuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Función para marcar como entregado
  function markAsDelivered(orderId, orderRow) {
    if (orderRow) {
      // Actualizar el estado del pedido
      const statusCell = orderRow.querySelector("td:nth-child(4)")
      if (statusCell) {
        statusCell.innerHTML = `
          <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Entregado
          </span>
        `
      }

      // Actualizar las acciones disponibles
      const actionsCell = orderRow.querySelector("td:last-child")
      if (actionsCell) {
        actionsCell.innerHTML = `
          <button class="view-order-details text-purple-600 hover:text-purple-800">
            <i class="fas fa-eye"></i>
          </button>
        `

        // Reinicializar eventos para el nuevo botón
        actionsCell.querySelector(".view-order-details").addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          showOrderDetailsModal(orderId)
        })
      }

      showNotification(`Pedido #${orderId} marcado como entregado`)
    }
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
            <p class="text-gray-600">Cliente: Juan Pérez</p>
            <p class="text-gray-600">Dirección: Calle Principal 123, Ciudad</p>
            <p class="text-gray-600">Teléfono: +56 9 1234 5678</p>
            <p class="text-gray-600">Estado: <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En Progreso</span></p>
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
              <span>Subtotal:</span>
              <span>$38.960 CLP</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Envío:</span>
              <span>$2.500 CLP</span>
            </div>
            <div class="flex justify-between font-bold text-gray-800 mt-2">
              <span>Total:</span>
              <span>$41.460 CLP</span>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button class="close-modal bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
            Cerrar
          </button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Agregar event listeners al botón de cerrar
    modal.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    // Cerrar modal al hacer clic fuera
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

  // Contenido para cada sección
  function createDashboardContent() {
    return `
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center">
          <div class="bg-purple-100 p-3 rounded-full mr-4">
            <i class="fas fa-shopping-bag text-purple-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Pedidos Nuevos</h3>
            <p class="text-2xl font-bold text-gray-800">3</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center">
          <div class="bg-blue-100 p-3 rounded-full mr-4">
            <i class="fas fa-tasks text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">En Proceso</h3>
            <p class="text-2xl font-bold text-gray-800">5</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center">
          <div class="bg-green-100 p-3 rounded-full mr-4">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Completados Hoy</h3>
            <p class="text-2xl font-bold text-gray-800">12</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center">
          <div class="bg-yellow-100 p-3 rounded-full mr-4">
            <i class="fas fa-dollar-sign text-yellow-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm">Ventas del Día</h3>
            <p class="text-2xl font-bold text-gray-800">$458.90</p>
          </div>
        </div>
      </div>
    </div>

    <!-- New Orders Section -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-800">Pedidos Nuevos</h2>
        <a href="#" class="text-purple-600 hover:text-purple-800 transition duration-300 view-all-new-orders">Ver todos</a>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedido #</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Cliente</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Teléfono</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Productos</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Propina</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12350</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">María González</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">+1 234 567 890</td>
              <td class="py-3 px-4 text-gray-600">2x California Roll, 1x Mojito</td>
              <td class="py-3 px-4 text-gray-800">$25.97</td>
              <td class="py-3 px-4 text-green-600">Sí ($2.60)</td>
              <td class="py-3 px-4">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm mr-2">
                  Aceptar
                </button>
                <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                  Rechazar
                </button>
              </td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12351</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">Juan Pérez</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">+1 987 654 321</td>
              <td class="py-3 px-4 text-gray-600">1x Pizza Pepperoni, 2x Agua Mineral</td>
              <td class="py-3 px-4 text-gray-800">$17.97</td>
              <td class="py-3 px-4 text-red-600">No</td>
              <td class="py-3 px-4">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm mr-2">
                  Aceptar
                </button>
                <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                  Rechazar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Processing Orders Section -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-800">Pedidos en Proceso</h2>
        <a href="#" class="text-purple-600 hover:text-purple-800 transition duration-300 view-all-processing-orders">Ver todos</a>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedido #</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Cliente</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Dirección</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Productos</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12348</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">Roberto Sánchez</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">Calle Principal 123, Ciudad</td>
              <td class="py-3 px-4 text-gray-600">1x Pizza Hawaiana, 1x Limonada</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Preparando</span>
              </td>
              <td class="py-3 px-4">
                <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                  Listo para Entrega
                </button>
              </td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12349</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">Laura Gómez</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">Av. Central 456, Ciudad</td>
              <td class="py-3 px-4 text-gray-600">3x California Roll, 2x Agua Mineral</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Camino</span>
              </td>
              <td class="py-3 px-4">
                <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                  Marcar Entregado
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `
  }

  // Función para crear el contenido de "Pedidos Nuevos"
  function createNewOrdersContent() {
    return `
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Pedidos Nuevos</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedido #</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Cliente</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Teléfono</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Productos</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Propina</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12350</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">María González</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">+1 234 567 890</td>
              <td class="py-3 px-4 text-gray-600">2x California Roll, 1x Mojito</td>
              <td class="py-3 px-4 text-gray-800">$25.97</td>
              <td class="py-3 px-4 text-green-600">Sí ($2.60)</td>
              <td class="py-3 px-4">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm mr-2">
                  Aceptar
                </button>
                <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                  Rechazar
                </button>
              </td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12351</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">Juan Pérez</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">+1 987 654 321</td>
              <td class="py-3 px-4 text-gray-600">1x Pizza Pepperoni, 2x Agua Mineral</td>
              <td class="py-3 px-4 text-gray-800">$17.97</td>
              <td class="py-3 px-4 text-red-600">No</td>
              <td class="py-3 px-4">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm mr-2">
                  Aceptar
                </button>
                <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                  Rechazar
                </button>
              </td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12352</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">Ana Martínez</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">+1 555 123 456</td>
              <td class="py-3 px-4 text-gray-600">2x Dragon Roll, 1x Tempura Roll, 1x Limonada</td>
              <td class="py-3 px-4 text-gray-800">$36.96</td>
              <td class="py-3 px-4 text-green-600">Sí ($3.70)</td>
              <td class="py-3 px-4">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm mr-2">
                  Aceptar
                </button>
                <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                  Rechazar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `
  }

  // Función para crear el contenido de "Pedidos en Proceso"
  function createProcessingOrdersContent() {
    return `
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Pedidos en Proceso</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedido #</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Cliente</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Dirección</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Productos</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12348</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">Roberto Sánchez</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">Calle Principal 123, Ciudad</td>
              <td class="py-3 px-4 text-gray-600">1x Pizza Hawaiana, 1x Limonada</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Preparando</span>
              </td>
              <td class="py-3 px-4">
                <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                  Listo para Entrega
                </button>
              </td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12349</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">Laura Gómez</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">Av. Central 456, Ciudad</td>
              <td class="py-3 px-4 text-gray-600">3x California Roll, 2x Agua Mineral</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Camino</span>
              </td>
              <td class="py-3 px-4">
                <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                  Marcar Entregado
                </button>
              </td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12347</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">Pedro Ramírez</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">Calle Norte 789, Ciudad</td>
              <td class="py-3 px-4 text-gray-600">1x Pizza Pepperoni, 1x Mojito</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Esperando Repartidor</span>
              </td>
              <td class="py-3 px-4">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
                  Asignar Repartidor
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `
  }

  // Función para crear el contenido de "Pedidos Completados"
  function createCompletedOrdersContent() {
    return `
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Pedidos Completados</h2>
      
      <!-- Date Filter -->
      <div class="flex items-center mb-6">
        <div class="relative">
          <input type="date" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" value="2023-04-23">
        </div>
        <button class="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
          Filtrar
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedido #</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Cliente</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Fecha</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Repartidor</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12347</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">Carlos Rodríguez</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">Hoy, 9:30 AM</td>
              <td class="py-3 px-4 text-gray-800">$28.750 CLP</td>
              <td class="py-3 px-4 text-gray-600">Ana García</td>
              <td class="py-3 px-4">
                <button class="view-order-details text-purple-600 hover:text-purple-800">
                  <i class="fas fa-eye"></i>
                </button>
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
              <td class="py-3 px-4 text-gray-600">Hoy, 9:15 AM</td>
              <td class="py-3 px-4 text-gray-800">$35.990 CLP</td>
              <td class="py-3 px-4 text-gray-600">Luis Morales</td>
              <td class="py-3 px-4">
                <button class="view-order-details text-purple-600 hover:text-purple-800">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12342</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">Ana Torres</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">Ayer, 3:45 PM</td>
              <td class="py-3 px-4 text-gray-800">$42.500 CLP</td>
              <td class="py-3 px-4 text-gray-600">Pedro Sánchez</td>
              <td class="py-3 px-4">
                <button class="view-order-details text-purple-600 hover:text-purple-800">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12340</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">María González</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">Ayer, 2:30 PM</td>
              <td class="py-3 px-4 text-gray-800">$31.990 CLP</td>
              <td class="py-3 px-4 text-gray-600">Luis Morales</td>
              <td class="py-3 px-4">
                <button class="view-order-details text-purple-600 hover:text-purple-800">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `
  }

  // Función para crear el contenido de "Historial"
  function createHistoryContent() {
    return `
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Historial de Pedidos</h2>
      
      <!-- Date Filter -->
      <div class="flex items-center mb-6">
        <div class="relative">
          <input type="date" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" value="2023-04-23">
        </div>
        <button class="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
          Filtrar
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Pedido #</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Cliente</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Fecha</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Repartidor</th>
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
              <td class="py-3 px-4 text-gray-600">23/04/2023, 9:15 AM</td>
              <td class="py-3 px-4 text-gray-800">$35.990 CLP</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
              </td>
              <td class="py-3 px-4 text-gray-600">Luis Morales</td>
              <td class="py-3 px-4">
                <button class="view-order-details text-purple-600 hover:text-purple-800">
                  <i class="fas fa-eye"></i>
                </button>
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
              <td class="py-3 px-4 text-gray-600">23/04/2023, 9:45 AM</td>
              <td class="py-3 px-4 text-gray-800">$42.500 CLP</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
              </td>
              <td class="py-3 px-4 text-gray-600">Luis Morales</td>
              <td class="py-3 px-4">
                <button class="view-order-details text-purple-600 hover:text-purple-800">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">#12347</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img src="/placeholder.svg?height=30&width=30" alt="Cliente" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-gray-800">Carlos Rodríguez</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">23/04/2023, 9:30 AM</td>
              <td class="py-3 px-4 text-gray-800">$28.750 CLP</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Entregado</span>
              </td>
              <td class="py-3 px-4 text-gray-600">Ana García</td>
              <td class="py-3 px-4">
                <button class="view-order-details text-purple-600 hover:text-purple-800">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `
  }

  // Función para crear el contenido de "Reportes"
  function createReportsContent() {
    return `
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Reportes</h2>
      
      <!-- Report Type Selector -->
      <div class="flex items-center mb-6">
        <select class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2">
          <option value="daily">Reporte Diario</option>
          <option value="weekly">Reporte Semanal</option>
          <option value="monthly">Reporte Mensual</option>
        </select>
        <div class="relative">
          <input type="date" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" value="2023-04-23">
        </div>
        <button class="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
          Generar
        </button>
      </div>
      
      <!-- Report Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-purple-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600">Total Ventas</p>
              <h3 class="text-3xl font-bold text-gray-800">$458.750 CLP</h3>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <i class="fas fa-dollar-sign text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600">Pedidos Completados</p>
              <h3 class="text-3xl font-bold text-gray-800">24</h3>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <i class="fas fa-shopping-bag text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600">Ticket Promedio</p>
              <h3 class="text-3xl font-bold text-gray-800">$19.115 CLP</h3>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <i class="fas fa-chart-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sales by Category -->
      <h3 class="text-xl font-bold text-gray-800 mb-4">Ventas por Categoría</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="h-64 flex items-center justify-center">
            <!-- Placeholder for pie chart -->
            <div class="relative w-48 h-48 rounded-full overflow-hidden">
              <div class="absolute inset-0 bg-purple-500" style="clip-path: polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0);"></div>
              <div class="absolute inset-0 bg-blue-500" style="clip-path: polygon(50% 50%, 0 0, 100% 0);"></div>
              <div class="absolute inset-0 bg-green-500" style="clip-path: polygon(50% 50%, 100% 0, 100% 50%);"></div>
              <div class="absolute w-32 h-32 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          <div class="flex justify-around mt-4">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">Comida (45%)</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">Bebidas (30%)</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">Postres (25%)</span>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2 px-4 text-gray-600 font-medium">Categoría</th>
                <th class="text-left py-2 px-4 text-gray-600 font-medium">Ventas</th>
                <th class="text-left py-2 px-4 text-gray-600 font-medium">%</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="py-2 px-4 text-gray-800">Comida</td>
                <td class="py-2 px-4 text-gray-800">$206.438 CLP</td>
                <td class="py-2 px-4 text-gray-800">45%</td>
              </tr>
              <tr class="border-b">
                <td class="py-2 px-4 text-gray-800">Bebidas</td>
                <td class="py-2 px-4 text-gray-800">$137.625 CLP</td>
                <td class="py-2 px-4 text-gray-800">30%</td>
              </tr>
              <tr>
                <td class="py-2 px-4 text-gray-800">Postres</td>
                <td class="py-2 px-4 text-gray-800">$114.688 CLP</td>
                <td class="py-2 px-4 text-gray-800">25%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Top Products -->
      <h3 class="text-xl font-bold text-gray-800 mb-4">Productos Más Vendidos</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Producto</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Categoría</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Cantidad</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">Pizza Pepperoni</td>
              <td class="py-3 px-4 text-gray-600">Comida</td>
              <td class="py-3 px-4 text-gray-800">15</td>
              <td class="py-3 px-4 text-gray-800">$209.850 CLP</td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">California Roll</td>
              <td class="py-3 px-4 text-gray-600">Comida</td>
              <td class="py-3 px-4 text-gray-800">12</td>
              <td class="py-3 px-4 text-gray-800">$107.880 CLP</td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">Mojito</td>
              <td class="py-3 px-4 text-gray-600">Bebidas</td>
              <td class="py-3 px-4 text-gray-800">10</td>
              <td class="py-3 px-4 text-gray-800">$69.900 CLP</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">Cheesecake</td>
              <td class="py-3 px-4 text-gray-600">Postres</td>
              <td class="py-3 px-4 text-gray-800">8</td>
              <td class="py-3 px-4 text-gray-800">$47.920 CLP</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Export Options -->
      <div class="flex justify-end mt-6">
        <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
          <i class="fas fa-file-pdf mr-2"></i> PDF
        </button>
        <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2">
          <i class="fas fa-file-excel mr-2"></i> Excel
        </button>
        <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
          <i class="fas fa-print mr-2"></i> Imprimir
        </button>
      </div>
    </div>
    `
  }

  // Función para crear el contenido de "Configuración"
  function createSettingsContent() {
    return `
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h2>
      <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/3 flex flex-col items-center">
          <div class="relative mb-4">
            <img src="/placeholder.svg?height=150&width=150" alt="Vendedor" class="h-32 w-32 rounded-full">
            <button class="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full">
              <i class="fas fa-camera"></i>
            </button>
          </div>
          <h3 class="text-lg font-bold text-gray-800">Carlos Rodríguez</h3>
          <p class="text-gray-600">vendedor@email.com</p>
        </div>
        <div class="md:w-2/3">
          <form class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Nombre</label>
                <input type="text" value="Carlos" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Apellido</label>
                <input type="text" value="Rodríguez" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              </div>
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">Email</label>
              <input type="email" value="vendedor@email.com" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">Teléfono</label>
              <input type="tel" value="+56 9 8765 4321" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
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

  // Función para inicializar eventos después de cambiar el contenido
  function initializeEvents() {
    console.log("Inicializando eventos") // Debug log

    // Reinicializar eventos para los botones de aceptar
    document.querySelectorAll(".bg-blue-500").forEach((btn) => {
      if (btn.textContent.trim() === "Aceptar") {
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
      }
    })

    // Reinicializar eventos para los botones de rechazar
    document.querySelectorAll(".bg-red-500").forEach((btn) => {
      if (btn.textContent.trim() === "Rechazar") {
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
      }
    })

    // Reinicializar eventos para los botones "Listo para Entrega"
    document.querySelectorAll(".bg-green-500").forEach((btn) => {
      if (btn.textContent.trim() === "Listo para Entrega") {
        btn.addEventListener("click", function () {
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
    })

    // Reinicializar eventos para los botones "Marcar Entregado"
    document.querySelectorAll(".bg-green-500").forEach((btn) => {
      if (btn.textContent.trim() === "Marcar Entregado") {
        btn.addEventListener("click", function () {
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
    })

    // Reinicializar eventos para los botones "Asignar Repartidor"
    document.querySelectorAll(".bg-blue-500").forEach((btn) => {
      if (btn.textContent.trim() === "Asignar Repartidor") {
        btn.addEventListener("click", function () {
          // Get order info from the row
          const orderRow = this.closest("tr")
          const orderId = orderRow.querySelector("td:first-child").textContent.trim()

          // Show delivery person selection modal
          showDeliveryPersonModal(orderId, orderRow)
        })
      }
    })

    // Reinicializar eventos para los botones de ver detalles
    document.querySelectorAll(".view-order-details").forEach((btn) => {
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

    // Reinicializar eventos para los enlaces "Ver todos"
    document.querySelector(".view-all-new-orders")?.addEventListener("click", (e) => {
      e.preventDefault()
      showSection("new-orders")
    })

    document.querySelector(".view-all-processing-orders")?.addEventListener("click", (e) => {
      e.preventDefault()
      showSection("processing-orders")
    })
  }

  // Inicializar la página mostrando el dashboard
  showSection("dashboard")
})
