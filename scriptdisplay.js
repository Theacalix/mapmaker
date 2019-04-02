import {
  getLocal,
  startPan,
  endPan,
  storage
} from '/des157-g/prototype2/modulefunc.js'; //for github
// import {
//   getLocal,
//   startPan,
//   endPan,
//   storage
// }
// from '/modulefunc.js'; //for local

const inner = document.querySelector('.inner');

window.addEventListener('load', getLocal);
inner.addEventListener('mousedown', startPan);
inner.addEventListener('mouseup', endPan);

var checking = setInterval(update, 1000);

function update() {
  // if (storage.getItem(changed) == 'true') {
  //
  //   storage.setItem('changed', 'false');
  // }
  console.log('checking');
  var hide = storage.getItem('hide');
  var show = storage.getItem('show');
  var i;
  if (hide != '') {
    console.log('update hide');
    hide = hide.split(',');
    for (i = 0; i < hide.length; i++) {
      document.querySelector('#' + hide[i]).style.opacity = 0;
    }
    storage.setItem('hide', '');
  }
  if (show != '') {
    console.log('update show');
    show = show.split(',');
    for (i = 0; i < show.length; i++) {
      document.querySelector('#' + show[i]).style.opacity = 1;
    }
    storage.setItem('show', '');
  }
}