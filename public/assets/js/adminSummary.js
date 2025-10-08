// Summary Data

connectBackEnd({
  backendUrl: "../backend/admin_get_summary.php",
  callback: (data) => {
    if (data.success) {
      showData(data.data);
    }
    if (data.error) {
      addAlert(data.error);
    }
  },
});

const showData = (summary) => {
  if (!summary) return;

  const kpi = summary.kpi;

  // update kpis

  document.getElementById("sales").textContent = `${kpi.totalSales} LKR`;
  document.getElementById("orders").textContent = kpi.totalOrders;
  document.getElementById("customers").textContent = kpi.customers;
  document.getElementById("books").textContent = kpi.books;
  document.getElementById("outStock").textContent = kpi.outStock;

  const growth = summary.weeklyGrowth.toFixed(1);
  document.getElementById("weeklyGrowth").textContent = `Weekly Growth: ${
    growth > 0 ? "+" : ""
  }${growth}%`;
  document.getElementById("weeklyGrowth").style.color =
    growth >= 0 ? "#10b981" : "#ef4444";

  // order stats cards
  const orderStats = summary.orders;
  const oc = document.getElementById("orderCards");
  orderStats.forEach((o) => {
    const div = document.createElement("div");
    div.className = "orders-card";
    div.innerHTML = `<h4>${o.label}</h4><p>${o.count}</p><a href="ordersAdmin.html#${o.slug}"><button>View</button></a>`;
    oc.appendChild(div);
  });

  // Bar Chart
  const sales = summary.sales;
  function getLast7DayLabels() {
    const labels = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(
        d.toLocaleDateString("en-US", { weekday: "short" }) // "Sun", "Mon", etc.
      );
    }
    return labels;
  }

  const days = getLast7DayLabels();

  // spread sales data to ensure all 7 days are represented
  const max = Math.max(...sales);

  const barChart = document.getElementById("barChart");

  sales.forEach((val, i) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = "0";
    bar.innerHTML = `<span>${val} LKR</span>`;
    barChart.appendChild(bar);
    setTimeout(() => (bar.style.height = (val / max) * 100 + "%"), i * 80);
  });
  const barLabels = document.getElementById("barLabels");
  days.forEach((d) => {
    const span = document.createElement("span");
    span.textContent = d;
    barLabels.appendChild(span);
  });

  // Pie Chart
  const genres = summary.genres;
  const pie = document.querySelector(".pie");
  const legend = document.getElementById("pieLegend");

  legend.innerHTML = "";

  let start = 0;
  const stops = genres.map((g) => {
    const end = start + (g.percent / 100) * 360;
    const s = document.createElement("span"); //spans for show fictions and their precentages.
    s.textContent = `${g.name} - ${g.percent}%`;
    s.style.color = g.color;
    legend.appendChild(s);
    const css = `${g.color} ${start}deg ${end}deg`;
    start = end;
    return css;
  });

  // do like that background: conic-gradient(red 45deg 90deg, yellow 90deg 210deg, green 210deg 360deg);

  pie.style.background = `conic-gradient(${stops.join(",")})`;
};
