const getOrders = (status, elementId) => {
  const element = document.getElementById(elementId);
  connectBackEnd({
    backendUrl: "../backend/orders_get_from_status.php?status=" + status,
    callback: (data) => {
      if (!data.success) {
        element.innerHTML = '<tr><td colspan="5">No data available</td></tr>';
        return;
      }
      let rows = "";
      data.data.forEach((order) => {
        rows += `
                <tr>
                  <td>${order.order_id}</td>
                  <td>${order.customer_name}</td>
                  <td>${order.total} LKR</td>
                  <td>${order.status}</td>
                  <td><button><a href="orderDetailsAdmin.html?order_id=${order.order_id}">View</a></button></td>
                </tr>
              `;
      });
      element.innerHTML = rows;
    },
  });
};

getOrders("pending", "to-pack");
getOrders("packed", "to-ship");
getOrders("shipped", "to-deliver");
getOrders("delivered", "completed");
getOrders("cancelled", "cancelled");
