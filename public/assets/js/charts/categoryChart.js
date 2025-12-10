// /assets/js/charts/categoryChart.js
document.addEventListener("DOMContentLoaded", function () {
  const el = document.querySelector("#categoryChart");
  if (!el || typeof ApexCharts === "undefined") return;

  const data = (window.REPORT_CHARTS && window.REPORT_CHARTS.category) || {};
  const labels = data.labels || [];
  const values = data.values || [];

  if (!labels.length || !values.length) {
    el.innerHTML = "<p class='op-text'>Kategori verisi bulunamadı.</p>";
    return;
  }

  const options = {
    chart: {
      type: "donut",
      height: 260,
    },
    labels: labels,
    series: values,
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      fontSize: "11px",
    },
    stroke: {
      width: 1,
      show: true,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " adet";
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "13px",
            },
            value: {
              show: true,
              fontSize: "16px",
              formatter: function (val) {
                return val + " adet";
              },
            },
            total: {
              show: true,
              label: "Toplam",
              formatter: function (w) {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return sum + " adet";
              },
            },
          },
        },
      },
    },
  };

  const chart = new ApexCharts(el, options);
  chart.render();
});
