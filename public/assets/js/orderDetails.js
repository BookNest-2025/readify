// Get order_id from URL
const url = new URL(window.location.href);
const order_id = url.searchParams.get("order_id");

let orderData = null;

// Fetch order details
const fetchOrderDetails = () => {
  connectBackEnd({
    backendUrl: `../backend/orders_get.php?order_id=${order_id}`,
    callback: (data) => {
      if (data.success) {
        orderData = data.data;
        const { customer, order, order_items } = data.data;
        let totalQuantity = 0;

        // Build order items HTML
        let orderItemsHTML = "";
        order_items.forEach((order_item) => {
          totalQuantity += order_item.quantity;

          orderItemsHTML += `
            <div class="list">
              <img src="./uploads/${order_item.image}" alt="book" />
              <div class="list-details">
                <p>Name: ${order_item.title}</p>
                <p>Quantity: ${order_item.quantity}</p>
                <p class="price">Unit Price: ${order_item.price} LKR</p>
                <p class="price">Total Price: ${Number(
                  order_item.quantity * order_item.price
                ).toFixed(2)} LKR</p>
              </div>
              ${
                order.status === "delivered"
                  ? `<button class="review-btn" onclick="window.location.href='book.html?id=${order_item.book_id}#review'">
                      Add Review
                    </button>`
                  : ""
              }
            </div>
          `;
        });

        // Platform review button (for delivered orders)
        const platformReviewButton =
          order.status === "delivered"
            ? ` <button class="review-btn platform" onclick="window.location.href='platformReviews.html?order_id=${order_id}'">
                   Review our platform
                 </button>
               `
            : "";

        // Cancel button only if order is not delivered, shipped, or cancelled
        const cancelButton =
          order.status !== "delivered" &&
          order.status !== "shipped" &&
          order.status !== "cancelled"
            ? `<button class="cancel-order-btn" onclick="cancelOrder()">Cancel Order</button>`
            : "";

        // Render everything
        document.getElementById("orderDetails").innerHTML = `
          <div class="order-container">
            <div class="details-box">
              <h3>Order Details</h3>
              <p>Status: ${order.status}</p>
              <p>Ordered At: ${order.created_at}</p>
              <p>Ordered Type: Cash on Delivery</p>
              <p>Total Quantity: ${totalQuantity}</p>
            </div>
            <div class="items-box">
              <h3>Order items</h3>
              ${orderItemsHTML}
            </div>
          </div>
        `;

        document.querySelector(".buttons").innerHTML = `
          ${cancelButton}
          ${platformReviewButton}
        `;
      }

      if (data.error) addAlert(data.error);
      if (data.redirect) redirect(data.redirect);
    },
  });
};

// Initial fetch
fetchOrderDetails();

// Cancel order function
const cancelOrder = () => {
  connectBackEnd({
    backendUrl: `../backend/order_update_status.php?order_id=${order_id}&status=cancelled`,
    callback: (data) => {
      if (data.success) {
        addAlert(data.message, false);
        redirect("profile.html");
      }
      if (data.error) {
        addAlert(data.error);
        if (!data.redirect) redirect("profile.html");
      }
      if (data.redirect) redirect(data.redirect);
    },
  });
};
