// ===== Bildspel =====
const bilder = [
  './Bilder/SimelliP1.png',
  './Bilder/SimelliP2.jpg',
  './Bilder/SimelliP3.png',
  './Bilder/SimelliP4.png',
  './Bilder/SimelliP5.jpg'
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
    if (bar.classList.contains('html')) {
      bar.style.width = '90%';
    } else if (bar.classList.contains('css')) {
      bar.style.width = '85%';
    } else if (bar.classList.contains('problemlösning')) {
      bar.style.width = '90%';
    } else if (bar.classList.contains('teamwork')) {
      bar.style.width = '100%';
    }
  });
  
 // 
(async () => {
  const NAME = 'Simelli Ani'; 
  const prioRank = { 'Låg': 1, 'Medium': 2, 'Hög': 3 };

  const listEl = document.getElementById('mina-projekt');
  const statusEl = document.getElementById('filter-status');
  const sortEl = document.getElementById('sort-prio');

  listEl.innerHTML = 'Laddar projekt...';

  let all = [];
  try {
    const res = await axios.get('./simelli.json', { responseType: 'json' });
    all = (Array.isArray(res.data) ? res.data : []).filter(p => p.ansvarig === NAME);
  } catch (e) {
    console.error(e);
    listEl.innerHTML = '<p style="color:red">Kunde inte läsa in projekten.</p>';
    return;
  }


  function render(items) {
    if (!items.length) { listEl.innerHTML = '<p>Inga projekt.</p>'; return; }
    listEl.innerHTML = items.map(p => `
      <article class="projektkort">
        <h3>${p.titel}</h3>
        <p>${p.beskrivning}</p>
        <ul>
          <li><b>Status:</b> ${p.status}</li>
          <li><b>Prioritet:</b> ${p.prioritet}</li>
          <li><b>Period:</b> ${p.startDatum} – ${p.slutDatum}</li>
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


document.addEventListener("DOMContentLoaded", () => {
  const navicon = document.querySelector('.navicon');
  const meny = document.querySelector('.huvudmeny ul');

  if (navicon && meny) {
    navicon.addEventListener('click', () => {
      meny.classList.toggle('visa');
    });
  }
});
