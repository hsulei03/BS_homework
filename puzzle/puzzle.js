let puzzleTarget = new Image(600,600);//
let puzzleSpec = document.getElementById('puzzleSpec').value;
let puzzleCanvases = document.querySelectorAll('.puzzleArea canvas');
let puzzleArea = document.getElementsByClassName('puzzleArea')[0];
let answer = [];
let record =[];
let puzzleArray = [];
let canvasWidth = '';
let canvasHeight = '';

$('#puzzleSpec').change(function () {
  puzzleSpec = document.getElementById('puzzleSpec').value;
})

puzzleTarget.src = 'https://picsum.photos/480/480/?random=15';
puzzleTarget.classList.add('d-block', 'w-100');
$('.pic').append(puzzleTarget);



$('#create').click(function () { 
  canvasWidth = puzzleTarget.naturalWidth / puzzleSpec;
  canvasHeight = puzzleTarget.naturalHeight / puzzleSpec;
  puzzleArea.innerHTML = '';
  CreatePuzzle(canvasWidth,canvasHeight);
});

$('#start').click(function () {
  while ( record.length < 20 ){
    let random = Math.floor(Math.random() * puzzleArray.length);
    ChangePosition(puzzleArray[random]);
  };
})

$('#automation').click(function () {
  let copyRecord = record.slice()
  while( copyRecord.length > 0){
    let auto = copyRecord.pop();
    ChangePosition(puzzleArray[auto]);
  }
})



function CreatePuzzle(canvasWidth,canvasWidth) {
  //檢查切幾片
  let blockWidth = canvasWidth;
  let blockHeight = canvasWidth;
  //開切
  for (let r = 0; r < puzzleSpec; r++) {
    let rowCanvas = document.createElement('div');
    rowCanvas.classList.add('rowCanvas');
    $('.puzzleArea').append(rowCanvas);
    for (let c = 0; c < puzzleSpec; c++) {
      let canvas = document.createElement('canvas'); //建立一個canvas
      canvas.setAttribute('row', r);
      canvas.setAttribute('col', c);
      canvas.setAttribute('style',`top : ${r*blockHeight}px; left :${c*blockWidth}px`)
      canvas.width = blockWidth;
      canvas.height = blockHeight;
      let pieceOfcanvas = canvas.getContext('2d');
      pieceOfcanvas.drawImage(puzzleTarget, c * blockWidth, r * blockHeight, blockWidth, blockHeight, 0, 0, blockWidth, blockHeight);
      rowCanvas.append(canvas);
    }
  }
  RemoveOnePiece();
}

function RemoveOnePiece() {
  puzzleArray = Array.from(document.querySelectorAll('.puzzleArea canvas'));
  let luckyNumber = Math.floor(Math.random() * puzzleArray.length);
  puzzleArray.forEach((element, index) => {
    if (index == luckyNumber) {
      element.getContext("2d").clearRect(0, 0, puzzleArray[luckyNumber].width, puzzleArray[luckyNumber].height);
      element.setAttribute('class', 'white');      
    } else {
      element.setAttribute('class', 'picture'); 
    };
    element.addEventListener('click', function (){
      ChangePosition(this);
    });
  });
}


function ChangePosition(oneBlock){
  let asIsIndex = puzzleArray.indexOf(oneBlock);
  let toBeIndex = puzzleArray.findIndex((item) => {return item.className == 'white';})
  let top = oneBlock.offsetTop;
  let left = oneBlock.offsetLeft;
  let targetTop = puzzleArray[toBeIndex].offsetTop;
  let targetLeft = puzzleArray[toBeIndex].offsetLeft;
  let moveing = IsMoveable(top,left,targetTop,targetLeft);
  if(moveing){
    record.push(asIsIndex);
    let tempX = oneBlock.style.left;
    let tempY = oneBlock.style.top;

    puzzleArray[asIsIndex].style.left = puzzleArray[toBeIndex].style.left;
    puzzleArray[asIsIndex].style.top = puzzleArray[toBeIndex].style.top;

    puzzleArray[toBeIndex].style.left = tempX;    
    puzzleArray[toBeIndex].style.top = tempY;
    
  }

}
function Check(arr){
  let curArray = [];
  arr.forEach((e) => {
    curArray.push(e.attributes.record.value);
  })
  return curArray;
}


function IsMoveable(top,left,targetTop,targetLeft) {

  let result = false;
  //上
  if( top > 0){
    let newtop = top - canvasHeight;
    if( newtop == targetTop && left == targetLeft){
      result = true;
    }
  }

  //下
  if ( top < (puzzleSpec * canvasHeight)){
    let newtop = top + canvasHeight;
    if( newtop == targetTop && left == targetLeft){
      result = true;
    }
  }

  //左
  if ( left > 0){
    let newLeft = left - canvasWidth;
    if( top == targetTop && newLeft == targetLeft){
      result = true;
    }
  }

  //右
  if ( left < (puzzleSpec * canvasWidth)){
    let newLeft = left + canvasWidth;
    if( top == targetTop && newLeft == targetLeft){
      result = true;
    }
  }
  return result;
}
