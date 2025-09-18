const url = new URL(window.location.href);
const order_id = url.searchParams.get("order_id");

let orderData = null;

const fetchOrderDetails = () => {
  connectBackEnd({
    backendUrl: `../backend/orders_get.php?order_id=${order_id}`,
    callback: (data) => {
      if (data.success) {
        orderData = data.data;
        const { customer, order, order_items } = data.data;
        let totalQuantity = 0;
        let orderItemsHTML = "";
        order_items.map((order_item) => {
          totalQuantity += order_item.quantity;
          orderItemsHTML += `
                        <div class="list">
                          <img
                            src="./uploads/${order_item.image}"
                            alt="book" />
                          <div class="list-details">
                            <p>Name : ${order_item.title}</p>
                            <p>Quentity : ${order_item.quantity}</p>
                          </div>
                          <p class="price">Unit Price : ${order_item.price}</p>
                          <p class="price">Total Price : ${
                            order_item.quantity * order_item.price
                          }</p>
                        </div>
                      `;
        });
        document.getElementById("orderDetails").innerHTML = `
                <div class="order-container">
                  <div class="details-box">
                    <h3>Order</h3>
                    <p>Status : ${order.status}</p>
                    <p>Ordered At : ${order.created_at}</p>
                    <p>Ordered Type : Cash on Delivery</p>
                    <p>Total Quentity : ${totalQuantity}</p>
                  </div>
                  <div class="items-box">
                    <h3>Order items</h3>
                    ${orderItemsHTML}
                  </div>
                <button onclick="cancleOrder()" ${
                  order.status === "cancelled" ||
                  order.status === "delivered" ||
                  order.status === "shipped"
                    ? "disabled"
                    : ""
                }>Cancel Order</button>  
              `;
      }
      if (data.error) {
        addAlert(data.error);
      }
      if (data.redirect) {
        redirect(data.redirect);
      }
    },
  });
};
fetchOrderDetails();

const cancleOrder = (status) => {
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
      if (data.redirect) {
        redirect(data.redirect);
      }
    },
  });
};
