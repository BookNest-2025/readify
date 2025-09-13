document.getElementById("statusFilter").addEventListener("change", function() {
  const filter = this.value;
  const rows = document.querySelectorAll("#orderTable tr");

  rows.forEach(row => {
    const status = row.getAttribute("data-status");
    if (filter === "all" || status === filter) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});
