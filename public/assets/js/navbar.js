document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.getElementById("search-icon");
  const searchPanel = document.getElementById("search-panel");
  const searchInputField = document.getElementById("search-input-field");
  const toggleHandlerSearch = document.getElementById("toggle-handler-search");
  const toggleHandlerMenu = document.getElementById("toggle-handler-menu");

  searchIcon.addEventListener("click", () => {
    searchPanel.classList.toggle("active");
    if (searchPanel.classList.contains("active")) {
      toggleHandlerSearch.classList.add("active");
      searchInputField.focus();
    } else {
      toggleHandlerSearch.classList.remove("active");
    }
  });

  toggleHandlerSearch.addEventListener("click", () => {
    if (searchPanel.classList.contains("active")) {
      searchPanel.classList.remove("active");
    }
    toggleHandlerSearch.classList.remove("active");
  });

  const menuToggle = document.getElementById("menu-toggle");
  const navbarCenter = document.querySelector(".navbar-center");

  menuToggle.addEventListener("click", () => {
    navbarCenter.classList.toggle("show");
    if (navbarCenter.classList.contains("show")) {
      toggleHandlerMenu.classList.add("active");
    } else {
      toggleHandlerMenu.classList.remove("active");
    }
  });

  document.querySelectorAll(".navbar-center a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navbarCenter.classList.remove("show");
      }
    });
  });

  toggleHandlerMenu.addEventListener("click", () => {
    if (navbarCenter.classList.contains("show"))
      navbarCenter.classList.remove("show");
    toggleHandlerMenu.classList.remove("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.getElementById("user-icon");
  userIcon &&
    connectBackEnd({
      backendUrl: "../backend/checkUserLogin.php",
      callback: (data) => {
        if (data.isLoggedIn) {
          if (data.category === "admin") userIcon.href = "adminDashboard.html";
          else userIcon.href = "profile.html";
        } else {
          userIcon.href = "login.html";
          console.log("login");
        }
      },
      method: "GET",
    });
});
