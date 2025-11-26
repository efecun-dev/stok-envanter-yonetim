var options = {
  series: [
    {
      name: "Desktops",
      data: [
        2400000, 2300000, 2000000, 1_800_000, 3_432_000, 5420000, 2400000,
        2300000, 2000000, 1_800_000, 3_432_000,
      ],
    },
  ],
  chart: {
    height: 350,
    type: "line",
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  xaxis: {
    categories: [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ],
  },
};

var chart = new ApexCharts(document.querySelector("#stockValueChart"), options);
chart.render();
