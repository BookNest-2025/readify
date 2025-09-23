// ---------- Image cache ----------
const imageCache = {}; // {filename: blobUrl}
let currentCartData = [];

const cartItemsContainer = document.querySelector(".cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.querySelector(".checkout-btn");
const userIcon = document.getElementById("user-icon");
const cartIcon = document.getElementById("cart-icon");
const continueShoppingBtn = document.querySelector(".continue-shopping-btn");

async function getCachedImage(imgName) {
  if (!imageCache[imgName]) {
    const blob = await fetch(`./uploads/${imgName}`).then((r) => r.blob());
    imageCache[imgName] = URL.createObjectURL(blob);
  }
  return imageCache[imgName];
}

document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.getElementById("search-icon");
  const toggleHandlerMenu = document.getElementById("toggle-handler-menu");
  const menuToggle = document.getElementById("menu-toggle");
  const navbarCenter = document.querySelector(".navbar-center");

  // --- Search toggle ---
  searchIcon?.addEventListener("click", () => {
    window.location.href = "search.html";
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
      if (window.innerWidth <= 900) {
        navbarCenter?.classList.remove("show");
        toggleHandlerMenu?.classList.remove("active");
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      navbarCenter?.classList.remove("show");
      toggleHandlerMenu?.classList.remove("active");
    }
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
                document
                  .querySelector(".cart-container")
                  ?.classList.toggle("active");
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
});

const fetchCartCallback = async (data) => {
  try {
    if (!cartItemsContainer || !cartTotal) return;

    if (data.success) {
      if (data.data && data.data.length > 0) {
        await updateCartItems(data.data);
      } else {
        cartItemsContainer.innerHTML = `<p style="text-align:center; color:red;">Your cart is empty.</p>`;
        cartTotal.textContent = "0 LKR";
        currentCartData = [];
      }
    } else {
      addAlert(data.error);
    }
  } catch (err) {
    console.error("fetchCartCallback error:", err);
  }
};

async function fetchCart() {
  try {
    await connectBackEnd({
      backendUrl: "../backend/cart_items_get.php",
      callback: fetchCartCallback,
    });
  } catch (err) {
    console.error("fetchCart error:", err);
  }
}

async function updateCartItems(cartItems) {
  if (!cartItemsContainer || !cartTotal) return;

  currentCartData = cartItems;
  let total = 0;
  cartItemsContainer.innerHTML = ""; // clear previous

  for (const { cart_id, title, stock, image, price, quantity } of cartItems) {
    total += parseFloat(price) * parseInt(quantity);
    const totalPrice = (parseFloat(price) * parseInt(quantity)).toFixed(2);

    const card = document.createElement("div");
    card.className = "cart-item-card";
    card.dataset.cartId = cart_id;

    const imgSrc = await getCachedImage(image);

    card.innerHTML = `
      <img src="${imgSrc}" alt="${title}" loading="lazy"/>
      <div class="item-info">
        <h4>${title}</h4>
        <p>Stock: ${stock}</p>

        <div class="price-row">
          <span>Unit: ${price} LKR</span>
          <span>Total: ${totalPrice} LKR</span>
        </div>

        <div class="quantity-control">
          <button onclick="changeCartItem(${cart_id}, 'red')">-</button>
          <input type="number" value="${quantity}" min="1" readonly />
          <button onclick="changeCartItem(${cart_id}, 'add')">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="changeCartItem(${cart_id}, 'del')">
        <i class="fa fa-trash"></i>
      </button>
    `;
    cartItemsContainer.appendChild(card);
  }

  cartTotal.textContent = `${total.toFixed(2)} LKR`;
}

async function addToCart(id) {
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
}

function changeCartItem(cart_id, operation) {
  try {
    const card = document.querySelector(
      `.cart-item-card[data-cart-id="${cart_id}"]`
    );

    if (operation === "del" && card) {
      card.classList.add("removing");
      card.addEventListener(
        "animationend",
        () => {
          proceedChange();
        },
        { once: true }
      );
    } else {
      proceedChange();
    }

    function proceedChange() {
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
    }
  } catch (err) {
    console.error("changeCartItem error:", err);
  }
}

// Hide cart if clicked outside
document.addEventListener("click", (event) => {
  const cartContainer = document.querySelector(".cart-container");
  const mainCartIcon = document.getElementById("cart-icon");
  const addToCartIcons = document.querySelectorAll(".cart-icon");

  if (!cartContainer || !mainCartIcon) return;

  const clickedAddToCart = Array.from(addToCartIcons).some((icon) =>
    icon.contains(event.target)
  );

  if (
    cartContainer.classList.contains("active") &&
    !cartContainer.contains(event.target) &&
    !mainCartIcon.contains(event.target) &&
    !clickedAddToCart
  ) {
    cartContainer.classList.remove("active");
  }
});

checkoutBtn?.addEventListener("click", async () => {
  await fetchCart();

  if (currentCartData && currentCartData.length > 0) {
    window.location.href = "checkout.html";
  } else {
    addAlert("Add items to cart for checkout.");
  }
  hideCart();
});

continueShoppingBtn?.addEventListener("click", () => hideCart());

function hideCart() {
  document.querySelector(".cart-container")?.classList.remove("active");
}
