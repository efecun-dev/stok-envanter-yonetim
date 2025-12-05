const buttons = document.querySelectorAll(".ct-tab-btn");
const containers = document.querySelectorAll(".product-container");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    target = btn.dataset.target;
    // Butonlar arası geçiş
    buttons.forEach((item) => {
      item.classList.remove("active");
    });
    btn.classList.add("active");

    // Sekmeler arası geçiş
    containers.forEach((container) => {
      container.classList.add("hidden");
      if (container.dataset.id == target) {
        container.classList.remove("hidden");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".ct-tab-btn");
  const containers = document.querySelectorAll(".product-container");
  const form = document.getElementById("stock-search-form");
  const searchInput = form.querySelector('input[name="search"]');

  let activeTab = "1";

  // Tab değiştirme (zaten benzeri vardır, yoksa kullan)
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      activeTab = btn.dataset.target; // 1 / 2 / 3 / 4

      containers.forEach((c) => {
        c.classList.toggle("hidden", c.dataset.id !== activeTab);
      });

      // tab değişince mevcut search değerine göre filtre uygula
      triggerSearch();
    });
  });

  form.addEventListener("submit", (e) => e.preventDefault());

  // Kullanıcı yazdıkça (istersen debounce eklersin)
  searchInput.addEventListener("input", () => {
    triggerSearch();
  });

  function triggerSearch() {
    const q = searchInput.value.trim();

    const url = new URL(
      "/stok-islemleri/stok-durumu/search",
      window.location.origin
    );
    url.searchParams.set("tab", activeTab);
    url.searchParams.set("q", q);

    fetch(url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const container = document.querySelector(
          `.product-container[data-id="${activeTab}"]`
        );
        if (container) {
          container.innerHTML = data.html; // partial’den gelen kartlar
        }
      })
      .catch((err) => {
        console.error("Stock search error:", err);
      });
  }
});
