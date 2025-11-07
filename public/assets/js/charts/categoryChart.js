var options = {
  series: [44, 55, 41, 17],
  labels: ["Elektronik", "Gıda", "Giyim", "Diğer"],
  chart: {
    type: "donut",
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

var chart = new ApexCharts(document.querySelector("#categoryChart"), options);
chart.render();
