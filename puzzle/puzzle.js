let puzzleSpec = document.getElementById('puzzleSpec').value;
let puzzleCanvases = document.querySelectorAll('.puzzleArea canvas');
let puzzleArea = document.getElementsByClassName('puzzleArea')[0];
let answer = [];
let record = [];
let puzzleArray = [];
let canvasWidth = '';
let canvasHeight = '';
let puzzleTarget = new Image();


puzzleTarget.src = 'https://picsum.photos/480/480/?random=15';
puzzleTarget.classList.add('d-block', 'w-100');
$('.pic').append(puzzleTarget);

$('#changePic').click(function(){

});

$('#puzzleSpec').change(function () {
  puzzleSpec = document.getElementById('puzzleSpec').value;
})

$('#create').click(function () {
  canvasWidth = puzzleTarget.naturalWidth / puzzleSpec;
  canvasHeight = puzzleTarget.naturalHeight / puzzleSpec;
  puzzleArea.innerHTML = '';
  CreatePuzzle(canvasWidth, canvasHeight);
  record.splice(0, record.length);
  answer.splice(0, record.answer);
});

$('#start').click(function () {
  GoBack();
  while(record.length != 50){
    let random = Math.floor(Math.random() * puzzleArray.length);
    ChangePosition(puzzleArray[random]);
  };

});

function GoBack() {
  let copyRecord = record.slice();
  while (copyRecord.length > 0) {
    let auto = copyRecord.pop();
    ChangePosition(puzzleArray[auto]);
  }
  record.splice(0, record.length);
}



function CreatePuzzle(canvasWidth, canvasHeight) {
  //檢查切幾片
  let blockWidth = canvasWidth;
  let blockHeight = canvasHeight;
  //開切
  for (let r = 0; r < puzzleSpec; r++) {
    let rowCanvas = document.createElement('div');
    rowCanvas.classList.add('rowCanvas');
    $('.puzzleArea').append(rowCanvas);
    for (let c = 0; c < puzzleSpec; c++) {
      let canvas = document.createElement('canvas'); //建立一個canvas
      canvas.setAttribute('style', `top : ${r * blockHeight}px; left :${c * blockWidth}px`);
      canvas.width = blockWidth;
      canvas.height = blockHeight;
      let pieceOfcanvas = canvas.getContext('2d');
      pieceOfcanvas.drawImage(puzzleTarget, c * blockWidth, r * blockHeight, blockWidth, blockHeight, 0, 0, blockWidth, blockHeight);
      rowCanvas.append(canvas);
      answer.push({ top: `${r * blockHeight}px`, left: `${c * blockWidth}px` });
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
    element.addEventListener('click', function () {
      ChangePosition(this);
      setTimeout(function () {
        Checker(puzzleArray)
      }, 15);
    });
  });
}


function ChangePosition(oneBlock) {
  let asIsIndex = puzzleArray.indexOf(oneBlock);
  let toBeIndex = puzzleArray.findIndex((item) => { return item.className == 'white'; })
  let top = oneBlock.offsetTop;
  let left = oneBlock.offsetLeft;
  console.log('top:'+top + "," +"left:"+left)
  let targetTop = puzzleArray[toBeIndex].offsetTop;
  let targetLeft = puzzleArray[toBeIndex].offsetLeft;
  let moveing = IsMoveable(top, left, targetTop, targetLeft);

  if (moveing) {
    record.push(asIsIndex);
    let tempX = oneBlock.style.left;
    let tempY = oneBlock.style.top;
    puzzleArray[asIsIndex].style.left = puzzleArray[toBeIndex].style.left;
    puzzleArray[asIsIndex].style.top = puzzleArray[toBeIndex].style.top;
    puzzleArray[toBeIndex].style.left = tempX;
    puzzleArray[toBeIndex].style.top = tempY;
    // if (targetTop - top != 0) {
    //   //動畫分解動在這...
    //   let move = (targetTop - top) / 10;
    //   let times = 0;
    //   let nTop = top;

    //   walk();
      
    //   function walk()
    //   {
    //     if(times >= 10) return;
    //     times++;
    //     puzzleArray[asIsIndex].style.top = `${nTop + move}px`;
    //     nTop = nTop + move;
    //     setTimeout(walk, 10);
    //   }
    // }
    // else {
    //   //動畫分解動在這...
    //   let move = (targetLeft - left) / 10;
    //   let times = 0;
    //   let nLeft = left;

    //   walk();
      
    //   function walk()
    //   {
    //     if(times >= 10) return;
    //     times++;
    //     puzzleArray[asIsIndex].style.left = `${nLeft + move}px`;
    //     nLeft = nLeft + move;
    //     setTimeout(walk, 10);
    //   }
    // }

  }
}

function IsMoveable(top, left, targetTop, targetLeft) {

  let result = false;
  //上
  if (top > 0) {
    let newtop = top - canvasHeight;
    if (newtop == targetTop && left == targetLeft) {
      result = true;
    }
  }

  //下
  if (top < (puzzleSpec * canvasHeight)) {
    let newtop = top + canvasHeight;
    if (newtop == targetTop && left == targetLeft) {
      result = true;
    }
  }

  //左
  if (left > 0) {
    let newLeft = left - canvasWidth;
    if (top == targetTop && newLeft == targetLeft) {
      result = true;
    }
  }

  //右
  if (left < (puzzleSpec * canvasWidth)) {
    let newLeft = left + canvasWidth;
    if (top == targetTop && newLeft == targetLeft) {
      result = true;
    }
  }
  return result;
}

function Checker(TargetArray) {
  let result = 0;
  for (let i = 0; i < TargetArray.length; i++) {
    if (TargetArray[i].style.top == answer[i].top && TargetArray[i].style.left == answer[i].left) {
      result++;
    }
  }
  if (result == TargetArray.length) {
    alert("水哦，水哦，你贏了！");
    record.splice(0, record.length);
    answer.splice(0, record.answer);
  }
}
