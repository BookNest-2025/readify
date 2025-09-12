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

const logout = () => {
  fetch("../ajax/logout.php", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        addAlert(data.message, false);
        redirect(data.redirect);
      }
    })
    .catch((err) => console.error("Logout failed:", err));
};

const connectBackEnd = ({
  backendUrl,
  callback = (data) => {},
  method = "POST",
  formId = null,
}) => {
  const sendRequest = (formData = null) => {
    let url = backendUrl;
    let options = { method };
    // options is a object use when fetching data.
    // {method: "POST",
    //  body : formdata}

    if (method.toUpperCase() === "POST" && formData) {
      options.body = formData;
    } else if (method.toUpperCase() === "GET" && formData) {
      const params = new URLSearchParams();
      for (let [key, value] of formData.entries()) {
        params.append(key, value);
      }
      url += "?" + params.toString();
    }

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => callback(data))
      .catch((err) => addAlert("Something went wrong. Please try again."));
  };

  if (formId) {
    const form = document.getElementById(formId);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      sendRequest(formData);
    });
  } else {
    sendRequest();
  }
};
