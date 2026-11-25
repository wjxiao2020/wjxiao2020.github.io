/*
 * Prev / next navigation for the "Who I am" inner pages.
 *
 * To reorder the pages, just reorder this array. Every inner page's
 * ".go-back" and ".go-next" links are generated from it automatically.
 * (Remember to also reorder the cards in index.html to match.)
 */
const PAGE_ORDER = [
  { file: "software_engineer_page.html", name: "Software Engineer" },
  { file: "AIML_researcher_page.html",   name: "Machine Learning Researcher" },
  { file: "data_scientist_page.html",    name: "Machine Learning Engineer" },
  { file: "game_developer_page.html",    name: "Game Developer" },
];

(function () {
  // Compare without ".html" so it works whether or not the host strips the extension.
  const stripExt = (s) => s.replace(/\.html$/i, "");
  const current = stripExt(decodeURIComponent(window.location.pathname.split("/").pop() || ""));
  const idx = PAGE_ORDER.findIndex((p) => stripExt(p.file) === current);
  if (idx === -1) return;

  const prev = PAGE_ORDER[idx - 1];
  const next = PAGE_ORDER[idx + 1];

  const makeLink = (page, text) => {
    const a = document.createElement("a");
    a.href = page.file;
    a.textContent = text;
    return a;
  };

  document.querySelectorAll(".page-heading .go-back").forEach((el) => {
    el.replaceChildren();
    if (prev) el.appendChild(makeLink(prev, prev.name + " < "));
  });

  document.querySelectorAll(".page-heading .go-next").forEach((el) => {
    el.replaceChildren();
    const currentName = document.createElement("span");
    currentName.className = "current-page-name";
    currentName.textContent = PAGE_ORDER[idx].name;
    el.appendChild(currentName);
    if (next) {
      el.appendChild(document.createTextNode(" "));
      el.appendChild(makeLink(next, "> " + next.name));
    }
  });
})();
