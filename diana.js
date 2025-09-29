document.addEventListener("DOMContentLoaded", () => {
 

  const bilder = document.querySelectorAll('.bildspel .bild');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let aktuellIndex = 0;

  function visaBild(index) {
    bilder.forEach(bild => bild.classList.remove('aktiv'));
    bilder[index].classList.add('aktiv');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    aktuellIndex = (aktuellIndex - 1 + bilder.length) % bilder.length;
    visaBild(aktuellIndex);
  });

  nextBtn?.addEventListener('click', () => {
    aktuellIndex = (aktuellIndex + 1) % bilder.length;
    visaBild(aktuellIndex);
  });

  visaBild(aktuellIndex);


  const skills = document.querySelectorAll('.skill');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skill = entry.target;
        const percent = skill.getAttribute('data-percent');
        const fill = skill.querySelector('.fill');

        fill.style.width = percent + '%';
        fill.textContent = percent + '%';  

        observer.unobserve(skill);
      }
    });
  }, { threshold: 0.3 });

  skills.forEach(skill => observer.observe(skill));
});

let allaProjekt = [];


fetch('dianaProjekt.json')
  .then(response => {
    if (!response.ok) throw new Error('Kunde inte läsa in dianaProjekt.json');
    return response.json();
  })
  .then(data => {
    allaProjekt = data;
    fyllFilterAlternativ(data);
    visaProjekt(data);
  })
  .catch(error => console.error('Fel vid inläsning av projekt:', error));


function fyllFilterAlternativ(data) {
  const kategoriSelect = document.getElementById('kategoriFilter');
  const statusSelect = document.getElementById('statusFilter');

  const kategorier = [...new Set(data.map(p => p.kategori))];
  const statusar = [...new Set(data.map(p => p.status))];

  kategorier.forEach(kat => {
    const opt = document.createElement('option');
    opt.value = kat;
    opt.textContent = kat;
    kategoriSelect.appendChild(opt);
  });

  statusar.forEach(stat => {
    const opt = document.createElement('option');
    opt.value = stat;
    opt.textContent = stat;
    statusSelect.appendChild(opt);
  });

  kategoriSelect.addEventListener('change', uppdateraProjekt);
  statusSelect.addEventListener('change', uppdateraProjekt);
  document.getElementById('sortering').addEventListener('change', uppdateraProjekt);
}

function uppdateraProjekt() {
  const kategoriVal = document.getElementById('kategoriFilter').value;
  const statusVal = document.getElementById('statusFilter').value;
  const sortVal = document.getElementById('sortering').value;

  let filtrerade = allaProjekt.filter(projekt => {
    const kategoriMatch = kategoriVal === 'alla' || projekt.kategori === kategoriVal;
    const statusMatch = statusVal === 'alla' || projekt.status === statusVal;
    return kategoriMatch && statusMatch;
  });

  filtrerade.sort((a, b) => {
    if (sortVal === 'datum-nyast') return new Date(b.datum) - new Date(a.datum);
    if (sortVal === 'datum-aldst') return new Date(a.datum) - new Date(b.datum);

    const prioritetOrdning = { hög: 3, medel: 2, låg: 1 };
    if (sortVal === 'prioritet-hog') return prioritetOrdning[b.prioritet] - prioritetOrdning[a.prioritet];
    if (sortVal === 'prioritet-lag') return prioritetOrdning[a.prioritet] - prioritetOrdning[b.prioritet];
    return 0;
  });

  visaProjekt(filtrerade);
}

function visaProjekt(projektLista) {
  const container = document.getElementById('projekt-lista');
  container.innerHTML = '';

  projektLista.forEach(projekt => {
    const item = document.createElement('div');
    item.classList.add('projekt-item');

    let datumText = 'Okänt datum';
    if (projekt.datum) {
      const datum = new Date(projekt.datum);
      datumText = datum.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    item.innerHTML = `
      <h3>${projekt.namn}</h3>
      <p>${projekt.beskrivning}</p>
      <p><strong>Kategori:</strong> ${projekt.kategori}</p>
      <p><strong>Status:</strong> ${projekt.status}</p>
      <p><strong>Prioritet:</strong> ${projekt.prioritet}</p>
      <p><strong>Datum:</strong> ${datumText}</p>
    `;
    container.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const navicon = document.querySelector('.navicon');
  const meny = document.querySelector('.huvudmeny ul');

  if (navicon && meny) {
    navicon.addEventListener('click', () => {
      meny.classList.toggle('visa');
    });
  }
});
