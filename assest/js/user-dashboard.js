document.addEventListener("DOMContentLoaded", () => {
    // Sidebar navigation links
    const sidebarLinks = document.querySelectorAll(".sidebar-link")
  
    // Action buttons
    const orderNowBtn = document.querySelector('a[href="/"]')
    const recentOrdersBtn = document.querySelector('a[href="#"]')
    const favoritesBtn = document.querySelector('a[href="#"]')
    const viewAllLinks = document.querySelectorAll('a[href="#"]')
    const orderAgainBtns = document.querySelectorAll("button.w-full")
    const actionIcons = document.querySelectorAll(".text-purple-600.hover\\:text-purple-800")
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
  
    // Handle "Ordenar Ahora" button
    if (orderNowBtn) {
      orderNowBtn.addEventListener("click", (e) => {
        e.preventDefault()
        window.location.href = "index.html#menu"
      })
    }
  
    // Handle "Pedidos Recientes" button
    if (recentOrdersBtn) {
      recentOrdersBtn.addEventListener("click", (e) => {
        e.preventDefault()
        showSection("orders")
      })
    }
  
    // Handle "Favoritos" button
    if (favoritesBtn) {
      favoritesBtn.addEventListener("click", (e) => {
        e.preventDefault()
        showSection("favorites")
      })
    }
  
    // Handle "Ver todos" links
    viewAllLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()
  
        // Determine which "Ver todos" was clicked based on its parent section
        const parentSection = this.closest(".bg-white")
        const sectionTitle = parentSection.querySelector("h2").textContent.trim()
  
        if (sectionTitle === "Pedidos Recientes") {
          showSection("orders")
        } else if (sectionTitle === "Tus Favoritos") {
          showSection("favorites")
        }
      })
    })
  
    // Handle "Ordenar de Nuevo" buttons
    orderAgainBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
  
        // Get product info from parent element
        const productCard = this.closest(".bg-gray-50")
        const productName = productCard.querySelector("h3").textContent.trim()
        const productPrice = productCard.querySelector(".text-purple-600").textContent.trim()
  
        // Show notification that item was added to cart
        showNotification(`${productName} añadido al carrito`)
  
        // Redirect to menu section after a short delay
        setTimeout(() => {
          window.location.href = "index.html#menu"
        }, 1500)
      })
    })
  
    // Handle action icons (eye and reload)
    actionIcons.forEach((icon) => {
      icon.addEventListener("click", function (e) {
        e.preventDefault()
  
        // Determine which icon was clicked
        const isViewIcon = this.querySelector(".fa-eye")
        const isReorderIcon = this.querySelector(".fa-redo-alt")
  
        // Get order info from the row
        const orderRow = this.closest("tr")
        const orderId = orderRow.querySelector("td:first-child").textContent.trim()
  
        if (isViewIcon) {
          // Show order details modal
          showOrderDetailsModal(orderId)
        } else if (isReorderIcon) {
          // Reorder the items from this order
          showNotification(`Pedido ${orderId} añadido al carrito`)
  
          // Redirect to menu section after a short delay
          setTimeout(() => {
            window.location.href = "index.html#menu"
          }, 1500)
        }
      })
    })
  
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
    }
  
    // Function to show order details modal
    function showOrderDetailsModal(orderId) {
      // Create modal
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
                                  <span>$17.98</span>
                              </li>
                              <li class="flex justify-between">
                                  <span>Mojito x1</span>
                                  <span>$6.99</span>
                              </li>
                              <li class="flex justify-between">
                                  <span>Pizza Pepperoni x1</span>
                                  <span>$13.99</span>
                              </li>
                          </ul>
                      </div>
                      <div class="border-t pt-2">
                          <div class="flex justify-between font-bold text-gray-800">
                              <span>Total:</span>
                              <span>$38.96</span>
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
  
      // Add event listeners to modal buttons
      modal.querySelector(".close-modal").addEventListener("click", () => {
        document.body.removeChild(modal)
      })
  
      modal.querySelector(".reorder-btn").addEventListener("click", () => {
        document.body.removeChild(modal)
        showNotification(`Pedido ${orderId} añadido al carrito`)
  
        // Redirect to menu section after a short delay
        setTimeout(() => {
          window.location.href = "index.html#menu"
        }, 1500)
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
  