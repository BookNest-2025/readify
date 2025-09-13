 document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");

    navbar.classList.add("hidden");

    document.addEventListener("mousemove", function (e) {
    
      if (e.clientY <= 80) {
        navbar.classList.remove("hidden");
      } else {
        navbar.classList.add("hidden");
      }
    });
  });

