import {
  getLocal,
  startPan,
  endPan,
  storage,
  appendStore
}
from '/mapmaker/modulefunc.js'; //for github
// from '/modulefunc.js'; //for local

const inner = document.querySelector('.inner');

window.addEventListener('load', function() {
  console.log('showing tiles');
  console.log(storage.getItem('showList'));
  getLocal();
  // showPrev();
});
inner.addEventListener('mousedown', startPan);
inner.addEventListener('mouseup', endPan);

let checking = setInterval(update, 1000);

function update() {
  console.log('checking');
  let hide = storage.getItem('hide');
  let show = storage.getItem('show');
  let i;
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
      console.log(storage.getItem('showList'));
    }
    storage.setItem('show', '');

  }
}

function hideTile(tile) {
  let list = storage.getItem('showList');
  let n = list.search(tile);
  let e = n + tile.length;
  if (e < list.length) { //not last val
    list = list.substring(0, n - 1) + list.substring(e);
  } else {
    list = list.substring(0, n - 1); //-1 to remove ,
  }
  console.log('cur list: ' + list);
  storage.setItem('showList', list);
}
