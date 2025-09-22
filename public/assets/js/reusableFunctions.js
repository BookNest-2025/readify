const alertMsg = document.querySelector(".alert");

const addAlert = (msg, err = true) => {
  alertMsg.style.backgroundColor = err
    ? "rgba(255, 0, 0, 0.8)"
    : "rgba(0, 163, 0, 0.8)";
  alertMsg.classList.add("active");
  alertMsg.innerHTML = `<p class="alert-message">${msg}</p>`;
  setTimeout(() => {
    alertMsg.classList.remove("active");
  }, 3000);
};

const redirect = (location, time = 2000) => {
  setTimeout(() => {
    window.location.href = location;
  }, time);
};

const connectBackEnd = async ({
  backendUrl,
  callback = (data) => {},
  method = "POST",
  formId = null,
}) => {
  const sendRequest = async (formData = null) => {
    let url = backendUrl;
    let options = { method };

    if (method.toUpperCase() === "POST" && formData) {
      options.body = formData;
    } else if (method.toUpperCase() === "GET" && formData) {
      const params = new URLSearchParams();
      for (let [key, value] of formData.entries()) {
        params.append(key, value);
      }
      url += "?" + params.toString();
    }

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      callback(data);
    } catch (err) {
      addAlert("Something went wrong. Please try again.");
      console.log(err);
    }
  };

  if (formId) {
    const form = document.getElementById(formId);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      sendRequest(formData);
    });
  } else {
    await sendRequest();
  }
};

const logout = (e) => {
  e.preventDefault();
  connectBackEnd({
    backendUrl: "../backend/auth_logout.php",
    method: "GET",
    callback: (data) => {
      if (data.success) addAlert(data.message, false);
      if (data.error) addAlert(data.error);
      if (data.redirect) redirect(data.redirect);
    },
  });
};

const checkAdmin = () => {
  connectBackEnd({
    backendUrl: "../backend/auth_check_login.php",
    method: "GET",
    callback: (data) => {
      if (!data.isLoggedIn || data.category !== "admin") {
        addAlert(
          "Can not view page without log in as an Admin.<br>Directiong to Homepage..."
        );
        redirect("index.html");
      }
    },
  });
};

const showBookCards = (books, containerId) => {
  const bookConatiner = document.getElementById(containerId);
  bookConatiner.innerHTML = "";
  return books.map((book) => {
    const { book_id, image, title, authors, price } = book;
    bookConatiner.innerHTML += `<div class="book-card">
        <a href="book.html?id=${book_id}">
          <div class="info">
            <h4>
              <span>${title}</span>
            </h4>
            <div class="details">
              <p>
                <span class="author" id="author"> ${authors.join(", ")} </span>
              </p>
              <p>
                <span class="price">${price} LKR</span>
              </p>
            </div>
          </div>
          <a href="book.html?id=${book_id}">
                <img
                  src="./uploads/${image}"
                  alt="book${book_id}"
                />
        </a>
      </div>`;


  });
};
