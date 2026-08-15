(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Spotlight cursor tracking ---------- */
  if (!reduceMotion) {
    const spotEls = document.querySelectorAll("[data-spotlight]");
    spotEls.forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--mx", x + "%");
        el.style.setProperty("--my", y + "%");
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion) {
    const magnets = document.querySelectorAll(".magnetic");
    magnets.forEach((el) => {
      let raf = null;
      el.addEventListener("pointermove", (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        const strength = 0.28;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
        });
      });
      el.addEventListener("pointerleave", () => {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ---------- Live IST clock ---------- */
  const clockEl = document.getElementById("liveClock");
  const iconEl = document.getElementById("dayNightIcon");
  function tickClock() {
    if (!clockEl) return;
    const now = new Date();
    // Render in IST (UTC+5:30) regardless of visitor's local timezone
    const istString = now.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    clockEl.textContent = istString;

    const hour = parseInt(
      now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false }),
      10
    );
    if (iconEl) iconEl.textContent = hour >= 6 && hour < 18 ? "☀" : "☾";
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------- Nav mobile toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("open");
      })
    );
  }

  /* ---------- Project modal (case-study expand) ---------- */
  const projectData = {
    medsim: {
      eyebrow: "VR · HEALTHCARE TRAINING",
      title: "MEDSIM",
      desc: "A medical VR training simulation built to teach CPR technique and COVID-19 initial screening protocol. Covered full scene design, character animation, interaction scripting, grab systems, and hand-tracking so trainees could rehearse procedures in a realistic, repeatable environment before working with real patients.",
      tags: ["Unity", "C#", "Oculus VR SDK"],
    },
    olabs: {
      eyebrow: "WEBGL · EDTECH",
      title: "OLABS",
      desc: "A WebGL-based educational VR/simulation platform delivering virtual science labs for classes 6–10. Built scenes, cinemachine camera work, grab/interaction systems, and hand-tracking, along with server hosting and WebGL testing across HTML5 and WAMP deployments.",
      tags: ["Unity", "HTML5", "PHP", "WAMP"],
    },
    vehicle: {
      eyebrow: "COMPUTER VISION",
      title: "Vehicle Identification System",
      desc: "A computer vision system that identifies vehicle type, make, and color from images of cars, trucks, bikes, and buses common on Indian roads. Built the dataset, trained the model with YOLOv5 object detection and KNN-based color histogram classification, and served results via a Flask/Django pipeline with Elasticsearch.",
      tags: ["YOLOv5", "KNN", "Elasticsearch", "Django", "Flask"],
    },
    surveillance: {
      eyebrow: "CV · ACCESS CONTROL",
      title: "Surveillance Suite",
      desc: "A campus surveillance system for managing cameras, users, and employees, with face recognition and access control. Built the APIs and databases with Flask and Django, configuration UIs in JavaScript/HTML5/CSS, and server maintenance scripts for automatic old-footage deletion and video streaming.",
      tags: ["Flask", "Django", "MySQL", "JavaScript"],
    },
    smartbuy: {
      eyebrow: "AR · COMMERCE",
      title: "Smart Buy",
      desc: "A markerless AR solution that lets any e-commerce platform offer AR try-on for products, aimed at improving buyer confidence and reducing returns in trade. Built at SAP Labs India using Unity and Android Studio.",
      tags: ["Unity", "Android Studio", "AR"],
    },
    tripti: {
      eyebrow: "SOCIAL IMPACT · AWARD WINNER",
      title: "Tripti",
      desc: "A just-in-time resource-mapping tool envisioned during the Kerala–Karnataka floods to help NGOs and relief camps coordinate supplies. Won first prize and initial funding at SAP Labs' Invnt 2018 inter-entrepreneurial contest, under the '1 Billion Lives' innovation pillar, and saw strong traction with NGOs including Bangalore Food Bank and Akshayapatra.",
      tags: ["GMaps", "SAP UI5"],
    },
  };

  const backdrop = document.getElementById("modalBackdrop");
  const modal = document.getElementById("modal");
  const modalEyebrow = document.getElementById("modalEyebrow");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalTags = document.getElementById("modalTags");
  const modalClose = document.getElementById("modalClose");
  let lastFocused = null;

  function openModal(key, originEl) {
    const data = projectData[key];
    if (!data) return;
    modalEyebrow.textContent = data.eyebrow;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalTags.innerHTML = data.tags.map((t) => `<span class="tag">${t}</span>`).join("");

    lastFocused = originEl;
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeModal() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", () => openModal(card.getAttribute("data-project"), card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card.getAttribute("data-project"), card);
      }
    });
  });

  modalClose.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("open")) closeModal();
  });
})();
