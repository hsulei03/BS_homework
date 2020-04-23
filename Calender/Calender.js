const monthName = ["January", "Febrary", "March", "April", "May", "June", "July", "Auguest", "September", "October", "November", "December"];
let printMonth = document.getElementById('month');
let printYear = document.getElementById('year');
let celender = new Date();
let curMonth = celender.getMonth();
let curYear = celender.getFullYear();
let dayBlock = document.querySelectorAll('table tbody tr td');

CelendarYearMonth(curYear, curMonth); //起始畫面年&月

//新增事件
dayBlock.forEach((el) => {
  el.addEventListener('click', (e) => { 
    ShowAllSchedule(el);
    e.stopPropagation();
  });
});

function CelendarYearMonth(year, month) {
  curMonth = month;
  curYear = year;
  printMonth.innerText = monthName[month];
  printYear.innerText = year;
}

function ChangeMonth(input) {
  console.log(input);
  curMonth = eval(`${curMonth}${input}`);
  if (curMonth < 0) {
    curMonth = 11;
    printMonth.innerText = monthName[curMonth];
    curYear = curYear - 1;
    printYear.innerText = curYear;
    ClearBlock();
    SetEveryDays(curYear, curMonth);
    AddBlockList();
  }
  if (curMonth > 11) {
    curMonth = 0;
    printMonth.innerText = monthName[curMonth];
    curYear = curYear + 1;
    printYear.innerText = curYear;
    ClearBlock();
    SetEveryDays(curYear, curMonth);
    AddBlockList();
  }
  printMonth.innerText = monthName[curMonth];
  ClearBlock();
  SetEveryDays(curYear, curMonth);
  AddBlockList();
}


function FirstDayOfWeekOnMonth(year, month) {
  var tmpDate = new Date(year, month, 1);
  console.log(tmpDate);
  return (tmpDate.getDay());
}


function SetEveryDays(year, month) {
  let startIndex = FirstDayOfWeekOnMonth(year, month);
  let thisMonthDays = new Date(year, month + 1, 0).getDate();
  let lastMonthDays = new Date(year, month, 0).getDate();

  //長當月份的日子
  for (let i = 0; i < thisMonthDays; i++) {
    dayBlock[startIndex + i].setAttribute('style', 'color : #343a40');
    dayBlock[startIndex + i].setAttribute('targetDate', `${year},${month},${i + 1}`);
    dayBlock[startIndex + i].innerText = i + 1;
  }
  //上個月最後幾天
  for (let j = 0; j < startIndex; j++) {
    dayBlock[j].setAttribute('style', 'color : #1d6ab7');
    dayBlock[j].innerText = lastMonthDays - (startIndex - 1) + j;
  }
  //下個月前幾天
  for (let k = 0; k < (dayBlock.length - thisMonthDays - startIndex); k++) {
    dayBlock[startIndex + thisMonthDays + k].setAttribute('style', 'color : #1d6ab7');
    dayBlock[startIndex + thisMonthDays + k].innerText = k + 1;
  }
  AddBlockList();
}



function ClearBlock() {
  dayBlock.forEach((item) => {
    item.innerHTML = '';
  })
}

function ShowAllSchedule9888(){
  let titleDay = (el.getAttributeNode('targetDate').value);//把變數拿出來
  let centerTitle = $('#ModalCenterTitle')[0];
  centerTitle.innerText = `${monthName[titleDay.split(',')[1]]} ${titleDay.split(',')[2]}`
  centerTitle.setAttribute('targetDate', titleDay)//把變數藏到這裡
  $('#scheduleForm').modal('show');
}

//顯示行程
function ShowAllSchedule(el) {
  let titleDay = (el.getAttributeNode('targetDate').value);//把變數拿出來
  let centerTitle = $('#staticBackdropLabel')[0];
  centerTitle.innerText = `${monthName[titleDay.split(',')[1]]} ${titleDay.split(',')[2]}`
  centerTitle.setAttribute('targetDate', titleDay)//把變數藏到這裡

  if (localStorage.getItem(titleDay) == null) {
    $('#schduleDetail').modal('show');
    return
  } else {
    let schduleObj = JSON.parse(localStorage.getItem(titleDay));
    let ulList = document.getElementById('schduleDetailWrap');
    ulList.innerHTML='';
    schduleObj.forEach((item) => {
      let li = document.createElement('li');
      let div = document.createElement('div');
      let spanTitle = document.createElement('span');
      let spanDT =  document.createElement('span');
      let spanContent = document.createElement('span');
      let lable = document.createElement('lable');
      let spanTxt =  document.createElement('span');
      div.classList.add('d-flex','flex-column');

      spanTitle.innerText = item.title;
      spanDT.innerText = `時間：${item.startDT}~${item.endDT}`;
      lable.innerText = '內容：';
      spanTxt.innerText = item.remarkTxt;

      spanContent.appendChild(lable);
      spanContent.appendChild(spanTxt);
      div.appendChild(spanTitle);
      div.appendChild(spanDT);
      div.appendChild(spanContent);
      li.appendChild(div);
      ulList.appendChild(li);
    })
  }
  $('#schduleDetail').modal('show');
}

function SaveSchedule() {
  let primaryKey = $('#staticBackdropLabel')[0].attributes.targetdate.value;
  let scheduleValue =
  {
    title: `${$('#schedule')[0].value}`,
    startDT: `${$('#startDT')[0].value}`,
    endDT: `${$('#endDT')[0].value}`,
    remark: `${$('#selectEvent')[0].value}`,
    color: `${$('#remarkColor')[0].value}`,
    remarkTxt: `${$('#remarkTxt')[0].value}`
  }
    ;
  if (localStorage.getItem(primaryKey) == null) {
    let schduleObj = [];
    schduleObj.push(scheduleValue);
    SaveToStorage(primaryKey, JSON.stringify(schduleObj));
  } else {
    let schduleObj = JSON.parse(localStorage.getItem(primaryKey));
    schduleObj.push(scheduleValue);
    SaveToStorage(primaryKey, JSON.stringify(schduleObj))
  }
  $('#scheduleForm').modal('hide');
  ClearBlock();
  SetEveryDays(curYear, curMonth);
}

function SaveToStorage(key, value) {
  localStorage.setItem(key, value);
}

function AddBlockList() {
  dayBlock.forEach((element) => {
    let keyName = element.getAttribute('targetdate');
    let stroageData = localStorage.getItem(keyName);
    let ul = document.createElement('ul');
    console.log(stroageData);
    if (stroageData != null) {
      let stroageArray = JSON.parse(stroageData)
      for(let index in stroageArray){
        let subItem = document.createElement('li');
        if(index < 4){
          subItem.innerHTML = `<span>${stroageArray[index].title}</span>`;
          ul.appendChild(subItem)
          element.appendChild(ul);
        }else{
          subItem.innerHTML = `<span>...</span>`;
          ul.appendChild(subItem)
          element.appendChild(ul);
          break;
        }
      }
    }
  })
}

function SwitchModal(){
  $('#schduleDetail').modal('hide');
  let titleDay = $('#staticBackdropLabel')[0].attributes.targetdate.value;//把變數拿出來
  let centerTitle = $('#ModalCenterTitle')[0];
  centerTitle.innerText = `${monthName[titleDay.split(',')[1]]} ${titleDay.split(',')[2]}`
  centerTitle.setAttribute('targetDate', titleDay)//把變數藏到這裡
  $('#scheduleForm').modal('show');
}



window.onload = SetEveryDays(curYear, curMonth);