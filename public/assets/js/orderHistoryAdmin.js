const ordersHistoryTable = document.getElementById("orders-history");
const fetchOrders = () => {
  connectBackEnd({
    backendUrl: "../backend/orders_get_from_status.php",
    callback: (data) => {
      if (data.success) {
        ordersHistoryTable.innerHTML = "";
        data.data.forEach((order) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                 <td>${order.order_id}</td>
                    <td>${order.customer_name}</td>
                    <td>${order.total} LKR</td>
                    <td>${order.status}</td>
                    <td><button><a href="orderDetailsAdmin.html?order_id=${order.order_id}">View Details</a></button></td>
                  `;
          ordersHistoryTable.appendChild(row);
        });
      } else {
        ordersHistoryTable.innerHTML = `
                  <tr>
                    <td colspan="5">${data.message || "No data available"}</td>
                  </tr>
                `;
      }
    },
  });
};
fetchOrders();
