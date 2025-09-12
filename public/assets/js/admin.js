const main = document.querySelector(".main");
const sidebar = document.querySelector(".sidebar");
const names = document.querySelectorAll(".sidebar .names");
const hideSidebar = () => {
  sidebar.classList.toggle("active");
  main.classList.toggle("active");
  names.forEach((name) => name.classList.toggle("active"));
};
