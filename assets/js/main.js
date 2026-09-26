const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/*=============== SHOW / HIDE MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

function setMenu(open) {
  navMenu.classList.toggle("show-menu", open);
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}

navToggle.addEventListener("click", () => setMenu(true));
navClose.addEventListener("click", () => setMenu(false));
document
  .querySelectorAll(".nav__link")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu.classList.contains("show-menu"))
    setMenu(false);
});

/*=============== HEADER BACKGROUND + SCROLL UP ===============*/
const header = document.getElementById("header"),
  scrollUpButton = document.getElementById("scroll-up");

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scroll-header", y >= 50);
  scrollUpButton.classList.toggle("show-scroll", y >= 350);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const navLinks = new Map(
  [...document.querySelectorAll(".nav__link")].map((link) => [
    link.getAttribute("href").slice(1),
    link,
  ]),
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link, id) =>
        link.classList.toggle("active-link", id === entry.target.id),
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
document
  .querySelectorAll("main section[id]")
  .forEach((section) => sectionObserver.observe(section));

/*=============== FAQ: ACORDEÃO ANIMADO ===============*/
/* Anima a altura do <details> para abrir/fechar igual em todos os navegadores */
const FAQ_DURATION = 400;
const FAQ_EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

document.querySelectorAll(".faq__card").forEach((details) => {
  const summary = details.querySelector("summary");
  let animation = null;

  function animateHeight(from, to, opening) {
    animation?.cancel();
    details.style.overflow = "hidden";
    animation = details.animate(
      { height: [`${from}px`, `${to}px`] },
      { duration: FAQ_DURATION, easing: FAQ_EASING },
    );
    animation.onfinish = () => {
      details.open = opening;
      details.style.height = details.style.overflow = "";
      animation = null;
    };
  }

  summary.addEventListener("click", (e) => {
    if (prefersReducedMotion) {
      details.classList.toggle("is-open", !details.open);
      return;
    }
    e.preventDefault();

    const startHeight = details.offsetHeight;
    const closing = details.classList.contains("is-open");

    if (closing) {
      details.classList.remove("is-open");
      const border = details.offsetHeight - details.clientHeight;
      animateHeight(startHeight, summary.offsetHeight + border, false);
    } else {
      details.open = true;
      // Força o reflow antes de adicionar a classe para a resposta animar
      void details.offsetHeight;
      details.classList.add("is-open");
      animateHeight(startHeight, details.scrollHeight, true);
    }
  });
});

/*=============== REVEAL ON SCROLL ===============*/
if (!prefersReducedMotion) {
  const STAGGER = 80; // ms entre itens irmãos

  const revealObserver = new IntersectionObserver(
    (entries) => {
      // Itens que entram na tela juntos aparecem em sequência
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          const el = entry.target;
          el.style.setProperty(
            "--reveal-delay",
            `${Math.min(i, 5) * STAGGER}ms`,
          );
          el.classList.add("is-visible");
          revealObserver.unobserve(el);
          // Remove as classes ao fim da entrada para não interferir nos hovers
          el.addEventListener("transitionend", function done(e) {
            if (e.target !== el) return; // ignora transições dos filhos
            el.removeEventListener("transitionend", done);
            el.classList.remove("reveal", "is-visible");
            el.style.removeProperty("--reveal-delay");
          });
        });
    },
    { rootMargin: "0px 0px -10% 0px" },
  );

  document
    .querySelectorAll(
      ".section__header, .about__content, .about__images, .cta__container, .specialty__group, .faq__card, .reviews__card",
    )
    .forEach((el) => {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
}

/*=============== GOOGLE ADS: CONVERSÃO NO CLIQUE DO WHATSAPP ===============*/
document.querySelectorAll(".js-whatsapp").forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof gtag === "function") {
      gtag("event", "conversion", {
        send_to: "AW-395923033/ZiSbCILypokZENmc5bwB",
        transport_type: "beacon",
      });
    }
  });
});
