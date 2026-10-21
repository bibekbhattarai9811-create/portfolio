// Shared behaviour for case-study pages: nav hairline, Jonesboro clock, scroll reveal.
const nav = document.querySelector("header.nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const clock = document.getElementById("clock");
const tick = () => {
  const t = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago", timeZoneName: "short" }).format(new Date());
  clock.textContent = "Jonesboro, AR · " + t;
};
tick();
setInterval(tick, 30000);
document.getElementById("yr").textContent = new Date().getFullYear();

const pending = new Set(document.querySelectorAll(".rv"));
const reveal = () => {
  for (const el of pending) if (el.getBoundingClientRect().top < innerHeight * 0.92) { el.classList.add("in"); pending.delete(el); }
};
addEventListener("scroll", reveal, { passive: true });
addEventListener("resize", reveal);
reveal();
