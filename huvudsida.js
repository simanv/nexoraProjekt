document.addEventListener("DOMContentLoaded", () => {
  const navicon = document.querySelector('.navicon');
  const meny = document.querySelector('.huvudmeny ul');

  if (navicon && meny) {
    navicon.addEventListener('click', () => {
      meny.classList.toggle('visa');
    });
  }
});
