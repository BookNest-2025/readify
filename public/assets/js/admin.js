checkAdmin();

const summaryElem = document.querySelector(".summary");
const sidebar = document.querySelector(".sidebar");
const names = document.querySelectorAll(".sidebar .names");

const hideOnLoad = () => {
  if (window.innerWidth <= 768) {
    sidebar.classList.remove("active");
    summaryElem.classList.remove("active");
    names.forEach((name) => name.classList.remove("active"));
  }
};
hideOnLoad();

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sidebar.classList.add("active");
    summaryElem.classList.add("active");
    names.forEach((name) => name.classList.add("active"));
  }
  if (window.innerWidth <= 768) {
    sidebar.classList.remove("active");
    summary.classList.remove("active");
    names.forEach((name) => name.classList.remove("active"));
  }
});

const toggleSideBar = () => {
  sidebar.classList.toggle("active");
  summaryElem.classList.toggle("active");
  names.forEach((name) => name.classList.toggle("active"));
};
