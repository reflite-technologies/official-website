/* Reflite Cyberspace - vanilla JavaScript */
const CONFIG = {
  phoneDisplay: "0115295927",
  whatsappNumber: "254115295927",
  email: "reflitetecnologies@gmail.com",
  prices: {
    "Printing": "From KSh 10",
    "Photocopying": "From KSh 5",
    "Scanning": "From KSh 30",
    "Typing": "From KSh 30",
    "CV Design": "From KSh 300",
    "Graphic Design": "From KSh 300",
    "Lamination": "From KSh 50",
    "Binding": "From KSh 100",
    "Computer Services": "From KSh 50",
    "Web Development": "From KSh 500",
    "Video Editing": "From KSh 500",
    "Online Services": "From KSh 100"
  }
};

const services = [
  ["Printing","cyber","▤","Quality document printing for everyday and professional needs."],
  ["Photocopying","cyber","▧","Clear copies for documents, forms and records."],
  ["Scanning","cyber","⌁","Convert physical documents into useful digital files."],
  ["Typing","cyber","⌨","Accurate typing and document preparation."],
  ["Document Formatting","cyber","▦","Professional layout, formatting and cleanup."],
  ["Lamination","cyber","◇","Protect important documents with clean lamination."],
  ["Binding","cyber","▥","Neat binding for reports, projects and documents."],
  ["File Conversion","cyber","⇄","Convert documents between common digital formats."],
  ["eCitizen Assistance","online","◎","Guidance with legitimate eCitizen services and processes."],
  ["KRA Services","online","◉","Assistance with legitimate KRA online services."],
  ["NSSF Services","online","◌","Assistance with legitimate NSSF online processes."],
  ["SHA Assistance","online","✚","Help navigating legitimate SHA-related online services."],
  ["HELB Services","online","◍","Assistance with legitimate HELB online services."],
  ["Passport Applications","online","▣","Guidance through passport application processes."],
  ["Visa Applications","online","✈","Digital assistance with legitimate visa application processes."],
  ["Certificate Applications","online","▤","Assistance with legitimate certificate application processes."],
  ["Business Registration","online","⌘","Guidance for legitimate business registration processes."],
  ["Online Applications","online","☁","General assistance with legitimate online applications."],
  ["Graphic Design","creative","✦","Professional visuals for personal and business needs."],
  ["CV Design","creative","▰","Clean, modern CV design and document presentation."],
  ["Posters","creative","▤","Promotional posters designed for print or digital use."],
  ["Business Cards","creative","▥","Professional business card design."],
  ["Social Media Graphics","creative","◈","Digital graphics for social media communication."],
  ["Video Editing","creative","▶","Editing support for polished videos and content."],
  ["Computer Troubleshooting","technology","⚙","Diagnose and resolve common computer problems."],
  ["Software Installation","technology","⬢","Install legitimate software and configure applications."],
  ["Computer Setup","technology","⌘","Set up computers for everyday productivity."],
  ["Internet Services","technology","◉","Internet access and basic digital connectivity support."],
  ["Email Assistance","technology","✉","Create, configure and troubleshoot email accounts."],
  ["Website Development","technology","</>","Professional websites for individuals and businesses."],
  ["Video Editing","technology","▶","Editing support for polished videos and content."],
  ["Online Services","technology","☁","General assistance with legitimate online applications."]
];

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const waUrl = (message) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

function renderServices(list = services) {
  const grid = $("#service-grid");
  grid.innerHTML = list.map(([name, category, icon, description]) => `
    <article class="service-card reveal visible" data-category="${category}" data-name="${name.toLowerCase()}">
      <div class="service-icon" aria-hidden="true">${icon}</div>
      <h3>${name}</h3><p>${description}</p>
      <button class="btn btn-primary service-request" type="button" data-service="${name}">Get Service <span>→</span></button>
    </article>`).join("");
  $("#no-results").hidden = list.length !== 0;
}

function renderPrices() {
  const items = Object.entries(CONFIG.prices);
  $("#pricing-grid").innerHTML = items.map(([name, price]) => `
    <article class="price-card reveal visible"><h3>${name}</h3><div class="price">${price}</div>
    <p>Service/assistance fee. Confirm the exact quote before work begins.</p><small>Official government/third-party fees are separate where applicable.</small></article>`).join("");
}

function populateServiceSelect() {
  const select = $("#contact-service");
  services.forEach(([name]) => {
    const option = document.createElement("option");
    option.value = name; option.textContent = name; select.appendChild(option);
  });
}

function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function openModal(service) {
  $("#modal-service").value = service;
  const modal = $("#service-modal");
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  setTimeout(() => $("input[name='name']", modal)?.focus(), 50);
}
function closeModal() {
  const modal = $("#service-modal");
  modal.classList.remove("open"); modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  $("#service-form").reset();
}

function validPhone(value) { return /^[0-9+\s()-]{9,15}$/.test(value.trim()); }

function initNavigation() {
  const toggle = $(".menu-toggle"), menu = $("#primary-menu");
  if (!toggle || !menu) return;

  const syncMenuState = (open) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    syncMenuState(!menu.classList.contains("open"));
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = menu.contains(event.target);
    const clickedToggle = toggle.contains(event.target);
    if (!clickedInsideMenu && !clickedToggle) {
      syncMenuState(false);
    }
  });

  $$(".nav-link").forEach(link => link.addEventListener("click", () => {
    syncMenuState(false);
  }));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) syncMenuState(false);
  });

  const sections = $$("main section[id]");
  const links = $$(".nav-link");
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`));
  }), {rootMargin:"-35% 0px -55% 0px"});
  sections.forEach(section => observer.observe(section));
}

function initFilters() {
  const search = $("#service-search");
  let currentFilter = "all";
  function apply() {
    const query = search.value.trim().toLowerCase();
    const filtered = services.filter(([name, category, , desc]) =>
      (currentFilter === "all" || category === currentFilter) &&
      (`${name} ${desc}`.toLowerCase().includes(query)));
    renderServices(filtered);
  }
  search.addEventListener("input", apply);
  $$(".filter-btn").forEach(btn => btn.addEventListener("click", () => {
    $$(".filter-btn").forEach(b => b.classList.remove("active")); btn.classList.add("active");
    currentFilter = btn.dataset.filter; apply();
  }));
}

function initModal() {
  document.addEventListener("click", e => {
    const button = e.target.closest(".service-request");
    if (button) openModal(button.dataset.service);
  });
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-cancel").addEventListener("click", closeModal);
  $("#service-modal").addEventListener("click", e => { if (e.target.id === "service-modal") closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#service-modal").classList.contains("open")) closeModal(); });
  $("#service-form").addEventListener("submit", e => {
    e.preventDefault();
    const form = e.currentTarget, data = new FormData(form);
    const name = data.get("name").trim(), phone = data.get("phone").trim(), service = data.get("service"), message = data.get("message").trim();
    if (!name || !validPhone(phone) || !service || !message) return showToast("Please complete all fields with a valid phone number.");
    const text = `Hello Reflite Cyberspace, I would like to request your service.\n\nService: ${service}\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
    window.open(waUrl(text), "_blank", "noopener,noreferrer"); closeModal();
  });
}

function initContactForm() {
  $("#contact-form").addEventListener("submit", e => {
    e.preventDefault();
    const form = e.currentTarget, data = new FormData(form);
    const name = data.get("name").trim(), phone = data.get("phone").trim(), email = data.get("email").trim();
    const service = data.get("service").trim(), message = data.get("message").trim();
    if (!name || !validPhone(phone) || !message) {
      $("#form-status").textContent = "Please enter your name, a valid phone number and message.";
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $("#form-status").textContent = "Please enter a valid email address.";
      return;
    }
    const text = `Hello Reflite Cyberspace, I would like to inquire about your services.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email || "Not provided"}\nService: ${service || "General inquiry"}\nMessage: ${message}`;
    $("#form-status").textContent = "Opening WhatsApp with your inquiry...";
    window.open(waUrl(text), "_blank", "noopener,noreferrer");
    form.reset();
  });
}

function initFAQ() {
  $$("#faq-list details").forEach(detail => detail.addEventListener("toggle", () => {
    if (detail.open) $$("#faq-list details").filter(d => d !== detail).forEach(d => d.removeAttribute("open"));
  }));
}

function initTheme() {
  const button = $(".theme-toggle");
  const backTop = $("#back-top");
  const saved = localStorage.getItem("reflite-theme");
  if (saved === "dark") document.documentElement.dataset.theme = "dark";

  const update = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    button.textContent = dark ? "☀" : "☾";
    button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    button.setAttribute("aria-pressed", String(dark));
    button.title = dark ? "Switch to light theme" : "Switch to dark theme";

    if (backTop) {
      backTop.classList.toggle("theme-dark", dark);
      backTop.setAttribute("aria-label", dark ? "Back to top" : "Back to top");
      backTop.title = dark ? "Back to top" : "Back to top";
    }
  };

  update();
  button.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme === "dark";
    document.documentElement.dataset.theme = dark ? "" : "dark";
    localStorage.setItem("reflite-theme", dark ? "light" : "dark");
    update();
  });
}

function initScrollUI() {
  const back = $("#back-top");
  window.addEventListener("scroll", () => back.classList.toggle("show", window.scrollY > 600), {passive:true});
  back.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); reveal.unobserve(entry.target); }
  }), {threshold:.08});
  $$(".reveal").forEach(el => reveal.observe(el));
}

function initYear() { $("#current-year").textContent = new Date().getFullYear(); }

document.addEventListener("DOMContentLoaded", () => {
  renderServices(); renderPrices(); populateServiceSelect();
  initNavigation(); initFilters(); initModal(); initContactForm(); initFAQ(); initTheme(); initScrollUI(); initYear();
});
