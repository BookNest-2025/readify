document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.getElementById("search-icon");
  const searchPanel = document.getElementById("search-panel");
  const searchInputField = document.getElementById("search-input-field");
  const toggleHandlerSearch = document.getElementById("toggle-handler-search");
  const toggleHandlerMenu = document.getElementById("toggle-handler-menu");

  searchIcon.addEventListener("click", () => {
    searchPanel.classList.toggle("active");
    if (searchPanel.classList.contains("active")) {
      toggleHandlerSearch.classList.add("active");
      searchInputField.focus();
    } else {
      toggleHandlerSearch.classList.remove("active");
    }
  });

  toggleHandlerSearch.addEventListener("click", () => {
    if (searchPanel.classList.contains("active")) {
      searchPanel.classList.remove("active");
    }
    toggleHandlerSearch.classList.remove("active");
  });

  const menuToggle = document.getElementById("menu-toggle");
  const navbarCenter = document.querySelector(".navbar-center");

  menuToggle.addEventListener("click", () => {
    navbarCenter.classList.toggle("show");
    if (navbarCenter.classList.contains("show")) {
      toggleHandlerMenu.classList.add("active");
    } else {
      toggleHandlerMenu.classList.remove("active");
    }
  });

  document.querySelectorAll(".navbar-center a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navbarCenter.classList.remove("show");
      }
    });
  });

  toggleHandlerMenu.addEventListener("click", () => {
    if (navbarCenter.classList.contains("show"))
      navbarCenter.classList.remove("show");
    toggleHandlerMenu.classList.remove("active");
  });
});

//cart and login icons
document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.getElementById("user-icon");
  const cartIcon = document.getElementById("cart-icon");
  userIcon &&
    connectBackEnd({
      backendUrl: "../backend/checkUserLogin.php",
      callback: (data) => {
        if (data.isLoggedIn) {
          if (data.category === "admin") {
            userIcon.href = "adminDashboard.html";
            cartIcon.addEventListener("click", (e) => {
              e.preventDefault();
              addAlert("Need to log in as customer to view cart.");
            });
          } else {
            userIcon.href = "profile.html";
            cartIcon.addEventListener("click", (e) => {
              e.preventDefault();
              document
                .querySelector(".cart-container")
                .classList.toggle("active");
              fetchCart();
            });
          }
        } else {
          cartIcon.addEventListener("click", (e) => {
            e.preventDefault();
            addAlert("Need to log in as customer to view cart.");
          });
          userIcon.href = "login.html";
        }
      },
      method: "GET",
    });
});

// cart

const hideCart = (e) => {
  e.preventDefault();
  document.querySelector(".cart-container").classList.remove("active");
};

const addToCart = async (id) => {
  await connectBackEnd({
    backendUrl: `../backend/addToCart.php?id=${id}`,
    method: "GET",
    callback: (data) => {
      if (data.success) addAlert(data.message, false);
      if (data.error) addAlert(data.error);
      if (data.redirect) redirect(data.redirect);
    },
  });
  setTimeout(fetchCart(), 2000);
};

const fetchCart = () => {
  const cartItems = document.querySelector(".cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkout = document.querySelector(".checkout-btn");
  connectBackEnd({
    backendUrl: "../backend/fetchCartItems.php",
    callback: (data) => {
      if (data.success) {
        if (data.data && data.data.length > 0) {
          cartItems.innerHTML = showCartItems(data.data);
          checkout.addEventListener("click", () => {
            window.location.href = "checkout.html";
          });
        } else {
          cartItems.innerHTML = `<tr><td colspan="4">Your cart is empty.</td></tr>`;
          cartTotal.textContent = "0 LKR";
          checkout.addEventListener("click", () => {
            addAlert("Add items to cart for checkout.");
          });
        }
      } else {
        addAlert(data.error);
      }
    },
  });
};

const showCartItems = (cartItems) => {
  const cartTotal = document.getElementById("cart-total");

  let html = "";
  let total = 0;

  cartItems.map(({ cart_id, title, stock, image, price, quantity }) => {
    const numericPrice = parseFloat(price);
    const numericQty = parseInt(quantity);
    total += numericPrice * numericQty;
    html += `
      <tr>
        <td>
          <div class="product-info">
            <img src="./uploads/${image}" alt="${title}" />
            <div class="product-details">
              <h4>${title}</h4>
              <p>Stock = ${stock}</p>
            </div>
          </div>
        </td>
        <td>${price} LKR</td>
        <td>
          <div class="quantity-control">
            <button onclick="changeCartItem(${cart_id}, 'red')">-</button>
            <input type="number" value="${quantity}" min="1" readonly />
            <button onclick="changeCartItem(${cart_id}, 'add')">+</button>
          </div>
        </td>
        <td class="action-icons">
          <button onclick="changeCartItem(${cart_id}, 'del')">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  cartTotal.innerHTML = `${total} LKR`;
  return html;
};

const changeCartItem = (cart_id, operation) => {
  //operation can be add, red, or del.
  connectBackEnd({
    backendUrl: `../backend/changeCartQuantity.php?operation=${operation}&cart_id=${cart_id}`,
    callback: (data) => {
      if (data.success) fetchCart();
      if (data.error) addAlert(data.error);
    },
    method: "GET",
  });
};
