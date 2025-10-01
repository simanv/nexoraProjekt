document.addEventListener('DOMContentLoaded', () => {
  // Bildspel
  const bilder = document.querySelectorAll('.bildspel .bild');
  const prevKnapp = document.querySelector('.prev');
  const nextKnapp = document.querySelector('.next');
  let aktuellIndex = 0;

  function visaBild(nyttIndex) {
    if (!bilder.length) return;
    bilder.forEach(b => b.classList.remove('aktiv'));
    const aktuellBildIndex = (nyttIndex + bilder.length) % bilder.length;
    bilder[aktuellBildIndex].classList.add('aktiv');
    aktuellIndex = aktuellBildIndex;
  }
  prevKnapp && prevKnapp.addEventListener('click', () => visaBild(aktuellIndex - 1));
  nextKnapp && nextKnapp.addEventListener('click', () => visaBild(aktuellIndex + 1));
  visaBild(aktuellIndex);

  // Skill-bars on scroll
  const skillElement = document.querySelectorAll('.skill');
  const visibleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillRad = entry.target;
        const procent = skillRad.getAttribute('data-percent');
        const fillElement = skillRad.querySelector('.fill');
        if (fillElement && procent) {
          fillElement.style.width = procent + '%';
          fillElement.textContent = procent + '%';
        }
        visibleObserver.unobserve(skillRad);
      }
    });
  }, { threshold: 0.3 });
  skillElement.forEach(rad => visibleObserver.observe(rad));

  // Mobilmeny
  const navikon = document.querySelector('.navicon');
  const huvudmenyLista = document.querySelector('.huvudmeny ul');
  navikon && huvudmenyLista && navikon.addEventListener('click', () => huvudmenyLista.classList.toggle('visa'));

  // Projektlista: statusfilter + sortering
  const projektContainer = document.getElementById('projekt-lista');
  const statusSelect = document.getElementById('statusFilter');
  const sorteringSelect = document.getElementById('sortering');
  let allaProjekt = [];

  fetch('dianaProjekt.json')
    .then(response => { if (!response.ok) throw new Error('Kunde inte läsa in dianaProjekt.json'); return response.json(); })
    .then(projektData => {
      allaProjekt = projektData;

      // Fyll statusval (om bara "Alla" finns från början)
      if (statusSelect && statusSelect.options.length <= 1) {
        [...new Set(allaProjekt.map(p => p.status))].forEach(status => {
          statusSelect.add(new Option(status, status));
        });
      }

      // Lyssna på ändringar
      statusSelect && statusSelect.addEventListener('change', uppdateraProjekt);
      sorteringSelect && sorteringSelect.addEventListener('change', uppdateraProjekt);

      uppdateraProjekt();
    })
    .catch(fel => console.error('Fel vid inläsning av projekt:', fel));

  function uppdateraProjekt() {
    if (!projektContainer) return;

    const valdStatus = statusSelect?.value || 'alla';
    const valdSortering = sorteringSelect?.value || 'datum-nyast';

    // 1) Filtrera på status
    let lista = valdStatus === 'alla' ? allaProjekt : allaProjekt.filter(p => p.status === valdStatus);

    // 2) Sortera
    const prioritetRang = { hög: 3, medel: 2, låg: 1 };
    lista = [...lista]; // sortera en kopia (mutera inte källan)
    if (valdSortering === 'datum-nyast') lista.sort((a,b) => new Date(b.datum||0) - new Date(a.datum||0));
    else if (valdSortering === 'datum-aldst') lista.sort((a,b) => new Date(a.datum||0) - new Date(b.datum||0));
    else if (valdSortering === 'prioritet-hog') lista.sort((a,b) => (prioritetRang[b.prioritet]||0) - (prioritetRang[a.prioritet]||0));
    else if (valdSortering === 'prioritet-lag') lista.sort((a,b) => (prioritetRang[a.prioritet]||0) - (prioritetRang[b.prioritet]||0));

    renderaProjekt(lista);
  }

  function renderaProjekt(projektLista) {
    projektContainer.innerHTML = '';
    projektLista.forEach(projekt => {
      const datumText = projekt.datum
        ? new Date(projekt.datum).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Okänt datum';
      projektContainer.insertAdjacentHTML('beforeend', `
        <div class="projekt-item">
          <h3>${projekt.namn ?? ''}</h3>
          <p>${projekt.beskrivning ?? ''}</p>
          <p><strong>Kategori:</strong> ${projekt.kategori ?? ''}</p>
          <p><strong>Status:</strong> ${projekt.status ?? ''}</p>
          <p><strong>Prioritet:</strong> ${projekt.prioritet ?? ''}</p>
          <p><strong>Datum:</strong> ${datumText}</p>
        </div>
      `);
    });
  }
});
