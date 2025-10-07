connectBackEnd({
  backendUrl: "../backend/auth_check_login.php",
  callback: (data) => {
    if (data.isLoggedIn) {
      if (data.category !== "customers") {
        addAlert("Please log in as customer to view own profile.");
        redirect("index.html");
      }
    } else {
      addAlert("Please log in to view profile.");
      redirect("login.html");
    }
  },
});

const fetchProfileData = () => {
  connectBackEnd({
    backendUrl: "../backend/user_get.php",
    callback: (data) => {
      if (data.success) {
        document.querySelector(".profile-pic").innerHTML = `
        <img
            src="./uploads/${data.data.photo}"
            alt="${data.data.name}" />`;
        document.getElementById("name").innerHTML = data.data.name;
        document.getElementById("contact-info").innerHTML = `
                <h3>Contact Information</h3>
                <p><strong>Email: </strong><span>${data.data.email}</span></p>
                <p><strong>Phone: </strong><span>${data.data.telno}</span></p>
                <p><strong>Address: </strong><span>${data.data.address}</span></p>
            `;
        fetchUserOrders();
      }
    },
  });
};

const fetchUserOrders = () => {
  const userOrders = document.getElementById("user-orders");
  connectBackEnd({
    backendUrl: "../backend/orders_get_from_status.php",
    callback: (data) => {
      let rows = "";
      data.data.reverse().forEach((order) => {
        if (order.status !== "cancelled") {
          rows += `
                  <tr>
                    <td>${order.order_id}</td>
                    <td>${order.total} LKR</td>
                    <td>${order.status}</td>
                    <td><button><a href="orderDetails.html?order_id=${order.order_id}">View</a></button></td>
                  </tr>
                `;
        }
      });
      if (!data.success || rows === "") {
        rows = `<tr>
        <td colspan="5" style="text-align: center">
        No Orders yet
        </td>
        </tr>`;
      }
      userOrders.innerHTML = rows;
    },
  });
};

fetchProfileData();
