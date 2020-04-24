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
  CalculatorMonthAndYear(input);
  printMonth.innerText = monthName[curMonth];
  printYear.innerText = curYear;
  ClearBlock();
  SetEveryDays(curYear, curMonth);
}

function CalculatorMonthAndYear(operator){
  curMonth = eval(`${curMonth}${operator}`); 
  if (curMonth < 0) {
    curMonth = 11;
    curYear = curYear - 1;
  }
  if (curMonth > 11) {
    curMonth = 0;
    curYear = curYear + 1;
  }

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

    if(month - 1 < 0){
      dayBlock[j].setAttribute('targetDate', `${year-1},${11},${lastMonthDays - (startIndex - 1) + j}`);
    }
    else {
    dayBlock[j].setAttribute('targetDate', `${year},${month-1},${lastMonthDays - (startIndex - 1) + j}`);
    }
    dayBlock[j].innerText = lastMonthDays - (startIndex - 1) + j;
  }
  //下個月前幾天
  for (let k = 0; k < (dayBlock.length - thisMonthDays - startIndex); k++) {
    dayBlock[startIndex + thisMonthDays + k].setAttribute('style', 'color : #1d6ab7');
    if(month + 1 > 11){
      dayBlock[startIndex + thisMonthDays + k].setAttribute('targetDate', `${year+1},${0},${k + 1}`);
    }
    else{
      dayBlock[startIndex + thisMonthDays + k].setAttribute('targetDate', `${year},${month+1},${k + 1}`);
    }
    dayBlock[startIndex + thisMonthDays + k].innerText = k + 1;
  }
  AddBlockList();
}

function ClearBlock() {
  dayBlock.forEach((item) => {
    item.innerHTML = '';
  })
}

//顯示行程
function ShowAllSchedule(el) {
  let titleDay = (el.getAttributeNode('targetDate').value);//把變數拿出來
  alert(titleDay);
  let centerTitle = $('#staticBackdropLabel')[0];
  centerTitle.innerText = `${monthName[titleDay.split(',')[1]]} ${titleDay.split(',')[2]}`
  centerTitle.setAttribute('targetDate', titleDay)//把變數藏到這裡

  let schduleDetailWrap = document.getElementById('schduleDetailWrap');
  schduleDetailWrap.innerHTML='';
  if (localStorage.getItem(titleDay) == null) {
    $('#schduleDetail').modal('show');
    return
  } else {
    $('#schduleDetail').modal('show');
    let schduleObj = JSON.parse(localStorage.getItem(titleDay));
    console.log(schduleObj);
    schduleObj.forEach((item,index) => {
      console.log(item);
      let items = document.createElement('div');
      let title = document.createElement('h5');
      let spanDT =  document.createElement('p');
      let lable = document.createElement('lable');
      let spanTxt = document.createElement('p');
      let edit = document.createElement('button');
      let del = document.createElement('button');

      items.classList.add('item','border');
      edit.classList.add('btn','btn-outline-info');
      del.classList.add('btn','btn-outline-danger');

      title.innerText = item.title;
      spanDT.innerText = `時間：${item.startDT}~${item.endDT}`;
      lable.innerText = item.remark;
      spanTxt.innerText = item.remarkTxt
      edit.innerText = 'Edit';
      del.innerText = 'Del';

      items.appendChild(title);
      items.appendChild(spanDT);
      items.appendChild(lable);
      items.appendChild(spanTxt);
      items.appendChild(del);
      items.appendChild(edit);
      schduleDetailWrap.appendChild(items);
    })
  }
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
    // console.log(stroageData);
    if (stroageData != null) {
      let stroageArray = JSON.parse(stroageData)
      for(let index in stroageArray){
        let subItem = document.createElement('li');
        subItem.setAttribute('style',`color:${stroageArray[index].color}`)
        if(index < 3){
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

//往前進一點比停在原地好...寫吧做吧~~我就爛！

window.onload = SetEveryDays(curYear, curMonth);