'use strict';
const storage = window.localStorage;
var curTile,
  initialX,
  initialY,
  offsetX = 0,
  offsetY = 0,
  tiles = [];
const inner = document.querySelector('.inner');
const view = document.querySelector('.view');
const boxRect = document.querySelector('.box').getBoundingClientRect();
const cols = inner.childElementCount * boxRect.width;
const rows = document.querySelector('.row').childElementCount * boxRect.height;

function getLocal(event) {
  console.log('page loaded');
  var keys = Object.keys(storage),
    key, box, items, tile, rotateAmt;

  for (var i = 0; key = keys[i]; i++) {
    if (key != 'show' && key != 'hide') {
      console.log('key ' + key);
      box = document.querySelector('#' + key);
      items = storage.getItem(key);
      items = items.split(',');
      console.log(key);
      console.log(items);
      for (var j = 0; j < items.length; j++) {
        if (items[j] != '') {
          var item = items[j].split(';');
          console.log(item);
          tile = document.querySelector('#' + item[0]);
          tile = getTile(tile);
          tile.style.top = (-100 * j) + 'px';
          if (rotateAmt = item[1]) {
            rotateAmt--;
            rotate(rotateAmt, tile);
            box.appendChild(tile);
          } else {
            box.appendChild(tile);
          }
        }
      }
      rotateAmt = 0;
      curTile = '';
    }
  }
}

function getTile(toCopy) {
  var tile = toCopy.cloneNode();
  tile.style.top = 0;
  tile.style.left = 0;
  tile.setAttribute('draggable', false);
  tiles.push(tile); //used to add event listeners later
  return tile;
}

function getItems(tile) { //get array from local storage
  console.log('parent: ' + tile.parentNode);
  var items = storage.getItem(tile.parentNode.id);
  items = items.split(',');
  return items;
}

function rotate(rotateAmt, curTile) {
  console.log('rotate');
  rotateAmt++;
  if (rotateAmt > 3) {
    rotateAmt = 0;
  }
  curTile.style.transform = 'rotate(' + (rotateAmt * 90) + 'deg)';
  // event.stopPropagation();
  return rotateAmt;
}

//PAN MODE
function startPan(event) {
  console.log('startPan');
  initialX = event.clientX;
  initialY = event.clientY;
  offsetX = parseInt(this.style.left, 10);
  offsetY = parseInt(this.style.top, 10);

  if (isNaN(offsetX) || isNaN(offsetY)) {
    offsetX = 0;
    offsetY = 0;
  }

  inner.addEventListener('mousemove', pan);
}

function pan(event) {
  console.log('pan');
  var x = (event.clientX - initialX + offsetX);
  var y = (event.clientY - initialY + offsetY);
  if (x <= 0 && x >= (view.clientWidth - cols)) {
    this.style.left = x + 'px';
  }
  if (y <= 0 && y >= (view.clientHeight - rows)) {
    this.style.top = y + 'px';
  }
}

function endPan() {
  console.log('endPan');
  inner.removeEventListener('mousemove', pan);
}

export {
  getLocal,
  getTile,
  getItems,
  rotate,
  startPan,
  endPan,
  tiles,
  storage
};