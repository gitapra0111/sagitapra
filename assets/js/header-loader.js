// Load header.html dan set active menu berdasarkan halaman saat ini
document.addEventListener("DOMContentLoaded", function () {
  // Ambil file header.html
  fetch("header.html")
    .then((response) => response.text())
    .then((html) => {
      // Masukkan header ke dalam <body> paling atas
      const parser = new DOMParser();
      const headerDoc = parser.parseFromString(html, "text/html");
      const headerElement = headerDoc.body.firstChild;

      // Insert header di paling atas sebelum elemen lain
      const body = document.body;
      body.insertBefore(headerElement, body.firstChild);

      // Set active menu item berdasarkan current page
      setActiveMenu();

      // Setup mobile menu toggle
      setupMobileMenuToggle();

      // Setup auto-hide navbar on scroll
      setupAutoHideNavbar();
    })
    .catch((error) => {
      console.log("Error loading header:", error);
      // Fallback: tampilkan navbar walaupun fetch gagal
      showFallbackHeader();
    });
});

// Fungsi untuk set active menu item
function setActiveMenu() {
  // Dapatkan nama file current
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Dapatkan semua menu links
  const navLinks = document.querySelectorAll(".cs_nav_list a");

  // Remove class active dari semua
  navLinks.forEach((link) => {
    link.parentElement.classList.remove("active");
  });

  // Add class active ke link yang sesuai
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.parentElement.classList.add("active");
    }
  });
}

// Fungsi untuk mobile menu toggle
function setupMobileMenuToggle() {
  const menuToggle = document.querySelector("#mobileMenuToggle");
  const navMenu = document.querySelector("#navMenu");

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener("click", function (e) {
    e.preventDefault();
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Prevent body scroll
    if (menuToggle.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Tutup menu saat klik link
  const navLinks = document.querySelectorAll(".cs_nav_list a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Close menu saat resize ke desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// Fungsi untuk auto-hide navbar saat scroll
function setupAutoHideNavbar() {
  let lastScrollTop = 0;
  let scrollThreshold = 50;
  const header = document.querySelector(".cs_site_header");

  if (!header) return;

  window.addEventListener(
    "scroll",
    function () {
      // Disable auto-hide di mobile (layar lebih kecil dari 768px)
      if (window.innerWidth < 768) {
        header.style.transform = "translateY(0)";
        return;
      }

      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      let scrollDelta = Math.abs(scrollTop - lastScrollTop);

      if (scrollDelta < scrollThreshold) {
        lastScrollTop = scrollTop;
        return;
      }

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = "translateY(-100%)";
        header.style.transition = "transform 0.3s ease-in-out";
      } else {
        header.style.transform = "translateY(0)";
        header.style.transition = "transform 0.3s ease-in-out";
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    },
    false,
  );
}

// Re-setup auto-hide saat window resize
window.addEventListener("resize", function () {
  if (window.innerWidth < 768) {
    const header = document.querySelector(".cs_site_header");
    if (header) {
      header.style.transform = "translateY(0)";
    }
  }
});

// Fallback header jika fetch gagal
function showFallbackHeader() {
  console.warn("Using fallback header");
  // Navbar sudah ada di HTML, jadi tidak perlu fallback
}
