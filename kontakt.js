// Hjälpfunktioner för validering
const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
// Svenska telefonnummer: 0… eller +46/0046, mellanslag/streck ok
const reTelefon = /^(?:\+46|0046|0)\s*(?:\d[\s-]?){7,12}\d$/;

function klass(el, ok){
  el.classList.remove('validerad-ok','validerad-fel');
  el.classList.add(ok ? 'validerad-ok' : 'validerad-fel');
}

function setHint(el, msg, typ){
  el.textContent = msg || '';
  el.classList.remove('ok','fel');
  if(!msg) return;
  el.classList.add(typ);
}

// Fält
const form = document.getElementById('kontaktForm');
const namn = document.getElementById('namn');
const telefon = document.getElementById('telefon');
const epost = document.getElementById('epost');
const meddelande = document.getElementById('meddelande');
const skicka = document.getElementById('skicka');
const statusEl = document.getElementById('formStatus');
const räknare = document.getElementById('räknare');

// Validerare (returnerar {ok, msg})
const check = {
  namn: (v) => {
    const ok = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/.test(v.trim());
    return { ok, msg: ok ? '✔ Ser bra ut.' : 'Minst 2 tecken. Endast bokstäver, mellanslag, - och \'.' };
  },
  telefon: (v) => {
    const ok = reTelefon.test(v.replace(/\s/g,''));
    return { ok, msg: ok ? '✔ Giltigt svenskt format.' : 'Ex: 070-1234567 eller +46 70 123 45 67.' };
  },
  epost: (v) => {
    const ok = reEmail.test(v.trim());
    return { ok, msg: ok ? '✔ Giltig e-post.' : 'Ange en giltig e-postadress.' };
  },
  meddelande: (v) => {
    const len = v.trim().length;
    const ok = len >= 10 && len <= 1000;
    return { ok, msg: ok ? '✔ Tack!' : 'Minst 10 tecken (max 1000).' };
  }
};

// Live-uppdatering
function uppdateraRäknare(){
  const len = meddelande.value.trim().length;
  räknare.textContent = `${len}/1000`;
}

function valideraFält(el, typ, hintEl){
  const { ok, msg } = check[typ](el.value);
  klass(el, ok);
  setHint(hintEl, msg, ok ? 'ok' : 'fel');
  uppdateraSkicka();
}

function uppdateraSkicka(){
  const v1 = check.namn(namn.value).ok;
  const v2 = check.telefon(telefon.value).ok;
  const v3 = check.epost(epost.value).ok;
  const v4 = check.meddelande(meddelande.value).ok;
  const ok = v1 && v2 && v3 && v4;
  skicka.disabled = !ok;
  statusEl.textContent = ok ? 'Allt ser bra ut – du kan skicka.' : '';
  statusEl.className = ok ? 'formstatus ok' : 'formstatus';
}

// Koppla händelser
namn.addEventListener('input', () => valideraFält(namn, 'namn', document.getElementById('namnHint')));
telefon.addEventListener('input', () => valideraFält(telefon, 'telefon', document.getElementById('telefonHint')));
epost.addEventListener('input', () => valideraFält(epost, 'epost', document.getElementById('epostHint')));
meddelande.addEventListener('input', () => {
  uppdateraRäknare();
  valideraFält(meddelande, 'meddelande', document.getElementById('meddelandeHint'));
});

// Init
uppdateraRäknare();
uppdateraSkicka();

// Avbryt faktisk submit (demo). Byt till din egen hantering/AJAX.
form.addEventListener('submit', (e) => {
  e.preventDefault();
  statusEl.textContent = 'Skickat! (här anropar du din backend eller e-posttjänst)';
  statusEl.className = 'formstatus ok';
  form.reset();
  [namn,telefon,epost,meddelande].forEach(el => el.classList.remove('validerad-ok','validerad-fel'));
  uppdateraRäknare();
  uppdateraSkicka();
});

// Meny 
document.addEventListener("DOMContentLoaded", () => {
  const navicon = document.querySelector('.navicon');
  const meny = document.querySelector('.huvudmeny ul');

  if (navicon && meny) {
    navicon.addEventListener('click', () => {
      meny.classList.toggle('visa');
    });
  }
});