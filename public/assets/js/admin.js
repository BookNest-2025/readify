checkAdmin();

const summaryElem = document.querySelector(".summary");
const sidebar = document.querySelector(".sidebar");
const names = document.querySelectorAll(".sidebar .names");

const toggleOnLoad = () => {
  if (window.innerWidth <= 768) {
    sidebar.classList.remove("active");
    summaryElem.classList.remove("active");
    names.forEach((name) => name.classList.remove("active"));
  }
  if (window.innerWidth > 768) {
    sidebar.classList.add("active");
    summaryElem.classList.add("active");
    names.forEach((name) => name.classList.add("active"));
  }
};
toggleOnLoad();

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sidebar.classList.add("active");
    summaryElem.classList.add("active");
    names.forEach((name) => name.classList.add("active"));
  }
  if (window.innerWidth <= 768) {
    sidebar.classList.remove("active");
    summaryElem.classList.remove("active");
    names.forEach((name) => name.classList.remove("active"));
  }
});

const toggleSideBar = () => {
  sidebar.classList.toggle("active");
  summaryElem.classList.toggle("active");
  names.forEach((name) => name.classList.toggle("active"));
};
