// const test = () => "Hello, world";

// console.log(test());

var title = document.getElementById('title');

function showHide() {
  if (title.style.display != 'block') { // если блок скрыт
    title.style.display = 'block'; // открываем его
  } else { // если открыт
    title.style.display = 'none'; // скрываем
  }
}