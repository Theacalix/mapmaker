'use strict';
console.log('reading js');
import * as m from '/des157-g/prototype2/modulefunc.js'; //for github
// import * as m from '/modulefunc.js'; //for local
const acc = document.querySelectorAll('.accordion');
const but = document.querySelectorAll('.mode button');
const inner = document.querySelector('.inner');
// var initialX, initialY;
// var offsetX = 0,
//   offsetY = 0;
var dragged,
  curTile = '',
  storeTile;
var rotateAmt = 0;
const storage = window.localStorage;
var display;
var showing = false;


window.addEventListener('load', function() {
  m.getLocal();
  console.log(m.tiles);
  clickTiles();
});
document.addEventListener('dragstart', startDrag);
document.addEventListener('dragover', overDrag);
document.addEventListener('dragenter', enterDrag);
document.addEventListener('dragleave', leaveDrag);
document.addEventListener('drop', drop);
document.addEventListener('click', delesectTile);
//Reset and Display Buttons
document.querySelector('#reset').addEventListener('click', function() {
  console.log('clearing storage');
  storage.clear();
  location.reload();
});

document.querySelector('#display').addEventListener('click', function() {
  console.log('in display');
  document.querySelector('body').className = 'displaymode';
  console.log(document.querySelector('body').className);

  window.open('display.html', 'app', 'resizable=yes');
  var edit = document.querySelector('.edit');
  edit.style.display = 'block';
  document.querySelector('#edit').addEventListener('click', function() {
    location.reload();
  }); //return to edit page
  document.querySelector('#showhide').addEventListener('click', showAll); //showhide all tiles
  var boxes = document.querySelectorAll('.box');
  storage.setItem('show', ''); //blank entry to add too
  storage.setItem('hide', '');
  storage.setItem('showList', '');
  storage.setItem('ignore', 'ignore,show,hide,showList');

  for (var i = 0; i < boxes.length; i++) {
    boxes[i].style.opacity = .5;
    boxes[i].addEventListener('click', show);
  }
  declickTiles();
});

function show() {
  console.log('showing ' + event.currentTarget.id);
  event.currentTarget.style.opacity = 1;
  event.currentTarget.removeEventListener('click', show);
  event.currentTarget.addEventListener('click', hide);
  //update storage
  if (storage.getItem('show') != '') {
    m.appendStore('show', ',', event.currentTarget.id);
    // storage.setItem('show', storage.getItem('show') + ',' + event.currentTarget.id);
  } else {
    m.appendStore('show', '', event.currentTarget.id);
    // storage.setItem('show', storage.getItem('show') + event.currentTarget.id);
  }
  //storage.setItem('changed', 'true');
}

function hide() {
  console.log('hiding ' + event.currentTarget.id);
  event.currentTarget.style.opacity = .5;
  event.currentTarget.removeEventListener('click', hide);
  event.currentTarget.addEventListener('click', show);
  //update storage
  if (storage.getItem('hide') != '') {
    m.appendStore('hide', ',', event.currentTarget.id);
    // storage.setItem('hide', storage.getItem('hide') + ',' + event.currentTarget.id);
  } else {
    m.appendStore('hide', '', event.currentTarget.id);
    // storage.setItem('hide', storage.getItem('hide') + event.currentTarget.id);
  }
  //storage.setItem('changed', 'true');
}

function showAll() {
  console.log('inside showAll')
  var boxes = document.querySelectorAll('.box');
  if (showing) { //need to hide tiles
    console.log('hiding all');
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].style.opacity == 1) { //box is visible
        boxes[i].click(); //hide box;
      }
    }
    event.target.innerHTML = 'Show All';
    event.target.style.backgroundColor = '#DBDBDB';
    event.target.setAttribute('title', 'Show All Tiles');
    showing = false;
  } else { //need to show tiles
    console.log('showing all');
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].style.opacity == .5) { //box is hidden
        boxes[i].click(); //show box;
      }
    }
    event.target.innerHTML = 'Hide All';
    event.target.style.backgroundColor = '#909091';
    event.target.setAttribute('title', 'Hide All Tiles');
    showing = true;
  }
}

//ACCORDION MENU
for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function() {
    var icon = this.firstChild;
    var panel = this.nextElementSibling;
    if (panel.style.display === 'flex') {
      panel.style.display = 'none';
      icon.className = 'fas fa-caret-right';
      this.style.borderBottom = '2px solid #cedad9';
    } else {
      panel.style.display = 'flex';
      icon.className = 'fas fa-caret-down';
      this.style.border = 'none';
    }
  })
}
//MODE BUTTONS
but[0].addEventListener('click', function() { //mouse -drag
  if (this.id != 'active') {
    this.id = 'active';
    but[1].id = '';
    //remove pan event
    inner.removeEventListener('mousedown', m.startPan);
    inner.removeEventListener('mouseup', m.endPan);
    inner.style.cursor = 'default';
    //add drag events
    document.addEventListener('dragstart', startDrag);
    document.addEventListener('dragover', overDrag);
    document.addEventListener('dragenter', enterDrag);
    document.addEventListener('dragleave', leaveDrag);
    document.addEventListener('drop', drop);
    document.addEventListener('click', delesectTile);
    clickTiles();
  }
});

but[1].addEventListener('click', function() { //pan
  if (this.id != 'active') {
    this.id = 'active';
    but[0].id = '';
    delesectTile();
    inner.style.cursor = 'all-scroll';
    //remove drag events
    document.removeEventListener('dragstart', startDrag);
    document.removeEventListener('dragover', overDrag);
    document.removeEventListener('dragenter', enterDrag);
    document.removeEventListener('dragleave', leaveDrag);
    document.removeEventListener('drop', drop);
    document.removeEventListener('click', delesectTile);
    console.log('tiles' + m.tiles);
    declickTiles();
    //add pan event
    inner.addEventListener('mousedown', m.startPan);
    inner.addEventListener('mouseup', m.endPan);
  }
});

function clickTiles() {
  for (var i = 0; i < m.tiles.length; i++) {
    m.tiles[i].addEventListener('click', selectTile);
  }
}

function declickTiles() {
  for (var i = 0; i < m.tiles.length; i++) {
    m.tiles[i].removeEventListener('click', selectTile);
  }
}
//CLICK MODE
//drag and drop
function startDrag(event) {
  console.log('startdrag');
  dragged = event.target;
  if (dragged.parentNode.className == 'box') {
    var index = Array.from(dragged.parentNode.children).indexOf(dragged) - 2; //for selected icons
    storeTile = m.getItems(dragged)[index];
    console.log(storeTile);
  } else {
    storeTile = dragged.id;
  }
  delesectTile();
}

function overDrag(event) {
  event.preventDefault();
}

function enterDrag(event) {
  // console.log('enterDrag');
  if (event.target.className == 'box') {
    event.target.style.border = '2px solid #ccc';
  }
}

function leaveDrag(event) {
  // console.log('leaveDrag');
  if (event.target.className == 'box') {
    event.target.style.border = '';
  }
}

function drop(event) {
  console.log('drop');
  event.preventDefault();
  console.log(storeTile);
  var tile;
  if (event.target.className == 'box' || event.target.nodeName == 'IMG') { //we are going to drop sucessfully
    if (dragged.parentNode.className == 'box') { //we can delete tile
      curTile = dragged;
      console.log('node to delete/clone ' + curTile);
      console.log('parent: ' + curTile.parentNode);
      deleteTile();
    }
    if (event.target.className == 'box') { //dragging into empty square
      event.target.style.border = '';
      tile = m.getTile(dragged);
      tile.addEventListener('click', selectTile);
      event.target.appendChild(tile);
      storage.setItem(event.target.id, storeTile);
      console.log(event.target.id + ',' + storeTile);
    } else if (event.target.nodeName == 'IMG') { //dragging on top of image
      var targetType = event.target.className;
      var dropType = dragged.className;
      var parent = event.target.parentNode;
      var count = parent.childElementCount;
      tile = m.getTile(dragged);
      tile.addEventListener('click', selectTile);
      if (dropType == 'replace' && targetType == 'replace') { //replace tile
        parent.appendChild(tile);
        parent.removeChild(event.target);
        storage.setItem(parent.id, storeTile);
      } else if (dropType == 'replace') { //targetType = layer
        var noReplace = true;
        var store = '';
        var items = storage.getItem(parent.id);
        items = items.split(',');
        for (var i = 0; i < parent.children.length; i++) { //check if replace tile exists and replace it
          if (parent.children[i].className == 'replace') {
            tile.style.top = parent.children[i].style.top;
            parent.replaceChild(tile, parent.children[i]);
            noReplace = false;
            if (i == 0) {
              store = storeTile;
            } else {
              store += ',' + storeTile;
            }
          } else {
            if (i == 0) {
              store = items[i];
            } else {
              store += ',' + items[i];
            }
          }
        }
        if (noReplace) { //if not append tile
          tile.style.top = (-100 * count) + 'px';
          parent.appendChild(tile);
          store += ',' + storeTile;
        }
        storage.setItem(parent.id, store);
      } else { //dropType = layer we don't care whats already there
        tile.style.top = (-100 * count) + 'px';
        parent.appendChild(tile);
        // console.log(storeTile);
        m.appendStore(parent.id, ',', storeTile);
        // storage.setItem(parent.id, storage.getItem(parent.id) + ',' + storeTile);
      }
      console.log('Storing: ' + parent.id + ',' + storage.getItem(parent.id));
    }
  }
}

//select tile interactions
function selectTile() {
  if (curTile !== event.target) {
    delesectTile();
    curTile = event.target;
    parent = event.target.parentNode;
    curTile.setAttribute('draggable', true);
    var index = Array.from(curTile.parentNode.children).indexOf(curTile);
    var item = m.getItems(curTile)[index].split(';');
    if (rotateAmt = item[1]) {} else {
      rotateAmt = 0;
    }
    //add delete icon
    var xIcon = document.createElement('i');
    xIcon.className = 'fas fa-times';
    xIcon.style.top = (parent.offsetTop) + 'px';
    xIcon.style.left = (parent.offsetLeft + 100) + 'px';

    parent.insertAdjacentElement('afterbegin', xIcon);
    xIcon.addEventListener('click', deleteTile);
    //add rotate icon
    var rIcon = document.createElement('i');
    rIcon.className = 'fas fa-undo fa-rotate-270 fa-sm';
    rIcon.style.top = (parent.offsetTop + xIcon.offsetHeight) + 'px';
    rIcon.style.left = (parent.offsetLeft + 100) + 'px';
    parent.insertAdjacentElement('afterbegin', rIcon);
    rIcon.addEventListener('click', function(event) {
      rotateAmt = m.rotate(rotateAmt, curTile);
      event.stopPropagation();
    });
  }
  event.stopPropagation(); //prevent calling cancel event
}

function delesectTile() {
  // console.log('deselecting');
  if (curTile !== '' && curTile !== event.target) {
    curTile.parentNode.removeChild(curTile.parentNode.children[0]); //remove rotate
    curTile.parentNode.removeChild(curTile.parentNode.children[0]); //remove delete
    curTile.setAttribute('draggable', false);
    //save rotate
    var index = Array.from(curTile.parentNode.children).indexOf(curTile);
    var store = '';
    var items = m.getItems(curTile);
    items.splice(index, 1, curTile.id + ';' + rotateAmt); //replace with rotate
    store = items[0];
    for (var i = 1; i < items.length; i++) {
      store += ',' + items[i];
    }
    storage.setItem(parent.id, store);

    curTile = '';
    rotateAmt = 0; //reset for next rotate
  }
}

function deleteTile() {
  var parent = curTile.parentNode;
  parent.removeChild(parent.children[0]); //remove rotate
  parent.removeChild(parent.children[0]); //remove delete
  var index = Array.from(parent.children).indexOf(curTile);
  console.log('node to delete/clone ' + curTile);
  console.log('parent: ' + curTile.parentNode);
  var items = m.getItems(curTile);
  parent.removeChild(curTile);
  rotateAmt = 0;
  curTile = '';

  if (parent.children.length != 0) { //if still children update position and storage
    for (var i = 0; i < parent.children.length; i++) {
      parent.children[i].style.top = (-100 * i) + 'px';
    } //fix offset
    var store = removeItem(items, index);
    storage.setItem(parent.id, store);
  } else { //no children remove storage
    storage.removeItem(parent.id);
  }
}

function removeItem(items, index) {
  var store = '';
  items.splice(index, 1); //remove item to delete
  store = items[0];
  for (var i = 1; i < items.length; i++) {
    store += ',' + items[i];
  }
  console.log(store);
  return store;
}