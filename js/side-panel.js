const sidebarBox = document.querySelector('#box'),
sidebarBtn = document.querySelector('#btn');

sidebarBtn.addEventListener('click', event => {
  sidebarBtn.classList.toggle('active');
  sidebarBox.classList.toggle('active');
  $('#slideshow').toggleClass('col-lg-offset-4');
});

window.addEventListener('keydown', event => {
  if (sidebarBox.classList.contains('active') && event.keyCode === 27) {
    sidebarBtn.classList.remove('active');
  }
});