// ===== Bildspel =====
const bilder = [
  './Bilder/AmandaBild1.png',
  './Bilder/AmandaBild2.png',
  './Bilder/AmandaBild3.png',
  './Bilder/AmandaBild4.png'
];


let index = 0;
const imgEl = document.getElementById('slideshow-image');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

function visaBild() {
  imgEl.src = bilder[index];
}

prevBtn.addEventListener('click', () => {
  index = (index - 1 + bilder.length) % bilder.length;
  visaBild();
});

nextBtn.addEventListener('click', () => {
  index = (index + 1) % bilder.length;
  visaBild();
});

// Startbild
visaBild();


// Progress-bar animation
window.onload = () => 
  document.querySelectorAll('.fill').forEach(bar => {
    if (bar.classList.contains('UX&UIDesign')) {
      bar.style.width = '90%';
    } else if (bar.classList.contains('protoframtagning')) {
      bar.style.width = '85%';
    } else if (bar.classList.contains('problemlösning')) {
      bar.style.width = '90%';
    } else if (bar.classList.contains('projektledning')) {
      bar.style.width = '95%';
    }
  });

(async () => {
  const NAME = 'Amanda Majvind'; 
  const prioRank = { 'Låg': 1, 'Medel': 2, 'Hög': 3 };

  const listEl = document.getElementById('mina-projekt');
  const statusEl = document.getElementById('filter-status');
  const sortEl = document.getElementById('sort-prio');

  listEl.innerHTML = 'Laddar projekt...';

  let all = [];
  try {
    const res = await axios.get('./amanda.json', { responseType: 'json' });
    all = (Array.isArray(res.data) ? res.data : []).filter(p => p.ansvarig === NAME);
  } catch (e) {
    console.error(e);
    listEl.innerHTML = '<p style="color:red">Kunde inte läsa in projekten.</p>';
    return;
  }

  function render(items) {
  if (!items.length) { 
    listEl.innerHTML = '<p>Inga projekt.</p>'; 
    return; 
  }
  listEl.innerHTML = items.map(p => `
    <article class="project-card">
      <h3>${p.titel}</h3>
      <p class="project-lead">${p.beskrivning}</p>
      <ul>
        <li><strong>Status:</strong> ${p.status}</li>
        <li><strong>Prioritet:</strong> ${p.prioritet}</li>
        <li><strong>Period:</strong> ${p.startDatum} – ${p.slutDatum}</li>
      </ul>
    </article>
  `).join('');
}


  function apply() {
    let out = [...all];

    // Filtrera status
    const s = statusEl.value; // "Alla" | "Pågår" | "Avslutad" | "Planerad"
    if (s !== 'Alla') out = out.filter(p => p.status === s);

    // Sortera (låg -> hög prioritet)
    if (sortEl.value === 'prio-asc') {
      out.sort((a, b) => (prioRank[a.prioritet] ?? 999) - (prioRank[b.prioritet] ?? 999));
    }

    render(out);
  }

  // init
  apply();

  // lyssna på ändringar
  statusEl.addEventListener('change', apply);
  sortEl.addEventListener('change', apply);
})();

  document.addEventListener("DOMContentLoaded", () => {
  const rubrik = document.querySelector(".sned");
  setTimeout(() => {
    rubrik.classList.add("visa");
  }, 300);
});
