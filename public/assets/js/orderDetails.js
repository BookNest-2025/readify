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
                  <div class="customer-box">
                    <h3>Customer Details</h3>
                    <p>Customer Name : ${customer.name}</p>
                    <p>Address :${customer.address}</p>
                    <p>Phone :${customer.telno}</p>
                    <p>Email :${customer.email}</p>
                  </div>
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
                 ${
                   order.status === "pending"
                     ? `<button onclick="printBill()">Print Bill</button>`
                     : ""
                 }
                ${
                  order.status !== "Delivered" && order.status !== "Cancelled"
                    ? `<button onclick="changeStatus('${
                        order.status
                      }')">Mark as ${
                        order.status === "pending"
                          ? "Packed"
                          : order.status === "packed"
                          ? "Shipped"
                          : "Delivered"
                      }</button>`
                    : ""
                }
                  
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

const printBill = () => {
  const { customer, order, order_items } = orderData;

  const grandTotal = order_items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  let itemsHTML = order_items
    .map(
      (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.title}</td>
                <td>${item.quantity}</td>
                <td>${Number(item.price).toFixed(2)}</td>
                <td>${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `
    )
    .join("");

  const htmlContent = `
    <html>
      <head>
        <title>Invoice #${order.order_id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, h3 { margin: 0; padding: 0; }
          .header { margin-bottom: 20px;
          text-align: center; }
          .shop-details, .customer-details { margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { text-align: right; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Readify</h1>
          <p>123 Main Street, City, Country</p>
          <p>Phone: +94 123456789 | Email: info@readify.com</p>
        </div>

        <div class="customer-details">
          <h3>Bill To:</h3>
          <p>${customer.name}</p>
          <p>${customer.address}</p>
          <p>Phone: ${customer.telno}</p>
        </div>
        <br/>

        <div class="order-details">
          <p><strong>Order ID:</strong> ${order.order_id}</p>
          <p><strong>Order Date:</strong> ${order.created_at}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Book Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <p class="total">Grand Total: ${grandTotal.toFixed(2)}</p>

        <p style="margin-top:50px;">Thank you for your purchase!</p>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
};

const statuses = ["pending", "packed", "shipped", "Delivered"];
const changeStatus = (status) => {
  const nextStatus = statuses[statuses.indexOf(status) + 1];
  console.log(nextStatus);
  console.log(order_id);
  connectBackEnd({
    backendUrl: `../backend/updateOrderStatus.php?order_id=${order_id}&status=${nextStatus}`,
    callback: (data) => {
      if (data.success) {
        addAlert(data.message, "success");
        redirect("ordersAdmin.html");
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
