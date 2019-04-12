import {
  getLocal,
  startPan,
  endPan,
  storage,
  appendStore
}
from '/des157-g/prototype2/modulefunc.js'; //for github
// from '/modulefunc.js'; //for local

const inner = document.querySelector('.inner');

window.addEventListener('load', getLocal);
inner.addEventListener('mousedown', startPan);
inner.addEventListener('mouseup', endPan);

var checking = setInterval(update, 1000);

function update() {
  console.log('checking');
  var hide = storage.getItem('hide');
  var show = storage.getItem('show');
  var i;
  if (hide != '') {
    console.log('update hide');
    hide = hide.split(',');
    for (i = 0; i < hide.length; i++) {
      document.querySelector('#' + hide[i]).style.opacity = 0;
      //remove from showList
      hideTile(hide[i]);
    }
    storage.setItem('hide', '');
  }
  if (show != '') {
    console.log('update show');
    show = show.split(',');
    for (i = 0; i < show.length; i++) {
      document.querySelector('#' + show[i]).style.opacity = 1;
      //add to showList
      appendStore('showList', ',', show[i]);
    }
    storage.setItem('show', '');

  }
}

function hideTile(tile) {
  var list = storage.getItem('showList');
  var n = list.search(tile);
  var e = n + tile.length;
  if (e < list.length) { //not last val
    list = list.substring(0, n - 1) + list.substring(e);
  } else {
    list = list.substring(0, n - 1); //-1 to remove ,
  }
  console.log('cur list: ' + list);
  storage.setItem('showList', list);
}