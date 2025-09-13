const orderItems = document.querySelector(".order-items");
const orderTotals = document.querySelectorAll(".order-total");

const fetchUserData = () => {
  connectBackEnd({
    backendUrl: "../backend/fetchUserData.php",
    callback: (data) => {
      if (data.success) {
        if (data.data) {
          const { name, email, telno, address } = data.data;
          document.querySelector(".user-info").innerHTML = `
                <div class="info-row">
                <span class="label">Name</span>
                    ${name}
                </div>
                <div class="info-row">
                    <span class="label">Email</span>
                    ${email}
                </div>
                <div class="info-row">
                    <span class="label">Phone</span>
                    ${telno}
                </div>
                <div class="info-row">
                    <span class="label">Address</span>
                    ${address}
                </div>       
            `;
        } else {
          addAlert(data.error);
          redirect("index.html");
        }
      } else {
        addAlert(data.error);
      }
    },
  });
};

const fetchOrders = () => {
  connectBackEnd({
    backendUrl: "../backend/fetchCartItems.php",
    callback: (data) => {
      if (data.success) {
        if (data.data && data.data.length > 0) {
          orderItems.innerHTML = showOrderItems(data.data);
        } else {
          orderItems.innerHTML = `<p>Your order items are empty</p>`;
          orderTotals.forEach((orderTotal) => {
            orderTotal.textContent = "0 LKR";
          });
        }
      } else {
        addAlert(data.error);
      }
    },
  });
};

showOrderItems = (orderItems) => {
  let html = "";
  let total = 0;

  orderItems.map(({ cart_id, title, stock, image, price, quantity }) => {
    const numericPrice = parseFloat(price);
    const numericQty = parseInt(quantity);
    total += numericPrice * numericQty;
    html += `
        <div class="order-item">
            <img src="./uploads/${image}" alt="${title}" />
            <div class="item-details">
                <h4>${title}</h4>
                <span>Qty: ${quantity}</span>
            </div>
            <div class="price">${numericPrice * numericQty} LKR</div>
        </div>
    `;
  });
  orderTotals.forEach((orderTotal) => {
    orderTotal.innerHTML = `${total} LKR`;
  });
  return html;
};

fetchOrders();
fetchUserData();

//place order

const placeOrder = () => {
  connectBackEnd({
    backendUrl: "../backend/placeOrder.php",
    callback: (data) => {
      if (data.success) addAlert(data.message, false);
      if (data.error) addAlert(data.error);
      if (data.redirect) redirect(data.redirect);
    },
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // Get modal elements
  const modal = document.getElementById("paymentModal");
  const openBtn = document.getElementById("place-order");
  const closeBtn = document.querySelector(".close-button");
  const pay = document.getElementById("final-pay-btn");

  // Get payment option elements
  const paymentOptions = document.querySelectorAll(
    'input[name="payment_method"]'
  );

  // Function to open the modal
  const openModal = () => {
    modal.style.display = "flex";
  };

  // Function to close the modal
  const closeModal = () => {
    modal.style.display = "none";
  };

  // Event listeners to open and close the modal
  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  // Close modal if user clicks on the overlay
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  //only cod allowd.
  paymentOptions.forEach((paymentOption) => {
    paymentOption.addEventListener("click", (e) => {
      e.preventDefault();
      if (paymentOption.value !== "cod") {
        addAlert("Not implemented yet.<br>Please use Cash on Delivery");
      }
    });
  });

  //place order
  pay.addEventListener("click", () => {
    placeOrder();
  });
});
