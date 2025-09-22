// ------------------------------
// Cart & Navbar JS (Safe Version)
// ------------------------------

// Image cache for cart items
const imageCache = {};
let currentCartData = [];

// ------------------------------
// DOM Elements
// ------------------------------
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.querySelector(".checkout-btn");
const userIcon = document.getElementById("user-icon");
const cartIcon = document.getElementById("cart-icon");
const continueShoppingBtn = document.querySelector(".continue-shopping-btn");

// ------------------------------
// Navbar & Search
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  try {
    const searchIcon = document.getElementById("search-icon");
    const searchPanel = document.getElementById("search-panel");
    const searchInputField = document.getElementById("search-input-field");
    const toggleHandlerSearch = document.getElementById(
      "toggle-handler-search"
    );
    const toggleHandlerMenu = document.getElementById("toggle-handler-menu");
    const menuToggle = document.getElementById("menu-toggle");
    const navbarCenter = document.querySelector(".navbar-center");

    // --- Search toggle ---
    searchIcon?.addEventListener("click", () => {
      searchPanel?.classList.toggle("active");
      toggleHandlerSearch?.classList.toggle(
        "active",
        searchPanel?.classList.contains("active")
      );
      if (searchPanel?.classList.contains("active")) searchInputField?.focus();
    });

    toggleHandlerSearch?.addEventListener("click", () => {
      searchPanel?.classList.remove("active");
      toggleHandlerSearch?.classList.remove("active");
    });

    // --- Navbar toggle ---
    menuToggle?.addEventListener("click", () => {
      navbarCenter?.classList.toggle("show");
      toggleHandlerMenu?.classList.toggle(
        "active",
        navbarCenter?.classList.contains("show")
      );
    });

    toggleHandlerMenu?.addEventListener("click", () => {
      navbarCenter?.classList.remove("show");
      toggleHandlerMenu?.classList.remove("active");
    });

    document.querySelectorAll(".navbar-center a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) navbarCenter?.classList.remove("show");
      });
    });

    // --- User & Cart logic ---
    if (userIcon) {
      connectBackEnd({
        backendUrl: "../backend/auth_check_login.php",
        callback: (data) => {
          try {
            if (data.isLoggedIn) {
              if (data.category === "admin") {
                userIcon.href = "adminDashboard.html";
                cartIcon?.addEventListener("click", (e) => {
                  e.preventDefault();
                  addAlert("Need to log in as customer to view cart.");
                });
              } else {
                userIcon.href = "profile.html";
                fetchCart();
                cartIcon?.addEventListener("click", (e) => {
                  e.preventDefault();
                  const cartContainer =
                    document.querySelector(".cart-container");
                  cartContainer?.classList.toggle("active");
                });
              }
            } else {
              userIcon.href = "login.html";
              cartIcon?.addEventListener("click", (e) => {
                e.preventDefault();
                addAlert("Need to log in as customer to view cart.");
              });
            }
          } catch (err) {
            console.error("User & Cart logic error:", err);
          }
        },
        method: "GET",
      });
    }
  } catch (err) {
    console.error("Navbar DOM setup error:", err);
  }
});

// ------------------------------
// Cart Functions
// ------------------------------
const fetchCartCallback = (data) => {
  try {
    if (!cartItemsContainer || !cartTotal) return;

    if (data.success) {
      if (data.data && data.data.length > 0) {
        updateCartItems(data.data);
      } else {
        cartItemsContainer.innerHTML = `<tr><td style="text-align:center" colspan="4">Your cart is empty.</td></tr>`;
        cartTotal.textContent = "0 LKR";
      }
    } else {
      addAlert(data.error);
    }
  } catch (err) {
    console.error("fetchCartCallback error:", err);
  }
};

const fetchCart = () => {
  try {
    connectBackEnd({
      backendUrl: "../backend/cart_items_get.php",
      callback: fetchCartCallback,
    });
  } catch (err) {
    console.error("fetchCart error:", err);
  }
};

const updateCartItems = (cartItems) => {
  try {
    if (!cartItemsContainer || !cartTotal) return;

    currentCartData = cartItems;
    let total = 0;
    const existingRows = {};

    cartItemsContainer.querySelectorAll("tr").forEach((tr) => {
      existingRows[tr.dataset.cartId] = tr;
    });

    cartItems.forEach(({ cart_id, title, stock, image, price, quantity }) => {
      total += parseFloat(price) * parseInt(quantity);
      let tr;

      if (existingRows[cart_id]) {
        tr = existingRows[cart_id];
        delete existingRows[cart_id];
        const qtyInput = tr.querySelector("input[type='number']");
        if (qtyInput) qtyInput.value = quantity;
      } else {
        tr = document.createElement("tr");
        tr.dataset.cartId = cart_id;
        tr.innerHTML = `
          <td>
            <div class="product-info">
              <img class="product-img" alt="${title}" loading="lazy"/>
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
        `;
        cartItemsContainer.appendChild(tr);
      }

      // Image cache
      const imgEl = tr.querySelector(".product-img");
      if (imgEl) {
        if (!imageCache[image]) {
          const img = new Image();
          img.src = `./uploads/${image}`;
          imageCache[image] = img.src;
        }
        imgEl.src = imageCache[image];
      }
    });

    // Remove old rows
    Object.values(existingRows).forEach((tr) => tr.remove());

    cartTotal.textContent = `${total} LKR`;
  } catch (err) {
    console.error("updateCartItems error:", err);
  }
};

const addToCart = async (id) => {
  try {
    await connectBackEnd({
      backendUrl: `../backend/cart_add.php?id=${id}`,
      method: "GET",
      callback: (data) => {
        if (data.success) addAlert(data.message, false);
        if (data.error) addAlert(data.error);
        if (data.redirect) redirect(data.redirect);
      },
    });
    fetchCart();
  } catch (err) {
    console.error("addToCart error:", err);
  }
};

const changeCartItem = (cart_id, operation) => {
  try {
    connectBackEnd({
      backendUrl: `../backend/cart_update.php?operation=${operation}&cart_id=${cart_id}`,
      callback: (data) => {
        if (data.success) {
          fetchCart();
          data.message && addAlert(data.message, false);
        }
        if (data.error) addAlert(data.error);
      },
      method: "GET",
    });
  } catch (err) {
    console.error("changeCartItem error:", err);
  }
};

// ------------------------------
// Checkout & Cart Visibility
// ------------------------------
checkoutBtn?.addEventListener("click", () => {
  if (currentCartData.length > 0) {
    window.location.href = "checkout.html";
  } else {
    addAlert("Add items to cart for checkout.");
  }
  hideCart();
});

continueShoppingBtn?.addEventListener("click", () => hideCart());

const hideCart = () => {
  const cartContainer = document.querySelector(".cart-container");
  cartContainer?.classList.remove("active");
};
