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
  return (tmpDate.getDay());
}


function SetEveryDays(year, month) {
  let startIndex = FirstDayOfWeekOnMonth(year, month);
  let thisMonthDays = new Date(year, month + 1, 0).getDate();
  let lastMonthDays = new Date(year, month, 0).getDate();  
  //長當月份的日子
  for (let i = 0; i < thisMonthDays; i++) {
    if ( celender.getMonth() == curMonth && celender.getFullYear() == curYear && i + 1 == celender.getDate()){ 
      dayBlock[startIndex + i].setAttribute('style', 'background-color: rgba(147, 175, 240, .5) ; color : #343a40');
    }else{
      dayBlock[startIndex + i].setAttribute('style', 'color : #343a40');
    }
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
  $('#schedule')[0].value ='';
  $('#startDT')[0].value ='';
  $('#endDT')[0].value = '';
  $('#selectEvent')[0].value = '';
  $('#remarkColor')[0].value ='#6610f2';
  $('#remarkTxt')[0].value = '';
}

//顯示行程
function ShowAllSchedule(el) {
  let titleDay = (el.getAttributeNode('targetDate').value);//把變數拿出來
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
      let btns = document.createElement('div');
      let edit = document.createElement('button');
      let del = document.createElement('button');

      items.classList.add('item', 'border', 'my-2', 'p-2');
      btns.classList.add('d-flex','p-1');
      edit.classList.add('btn','btn-outline-info', 'ml-auto', 'mr-2');
      del.classList.add('btn','btn-outline-danger');
      spanTxt.setAttribute('style','word-break: break-all');
      edit.setAttribute('pk',`${titleDay}`);
      edit.setAttribute('indexKey',`${index}`);
      del.setAttribute('pk',`${titleDay}`);
      del.setAttribute('indexKey',`${index}`);
      
      title.innerText = `#${index +1}: ${item.title}`;
      spanDT.innerText = `時間：${item.startDT}~${item.endDT}`;
      lable.innerText = item.remark;
      spanTxt.innerText = item.remarkTxt
      edit.innerText = 'Edit';
      del.innerText = 'Del';

      del.addEventListener('click',(e) => {
        DelSchedule(event);
        e.stopPropagation();
      });

      edit.addEventListener('click',(e) =>{
        EditSchedule(event);
        e.stopPropagation;
      })

      items.appendChild(title);
      items.appendChild(spanDT);
      items.appendChild(lable);
      items.appendChild(spanTxt);
      items.appendChild(btns);
      btns.appendChild(edit);
      btns.appendChild(del);
      schduleDetailWrap.appendChild(items);
    })
  }
}

function SaveSchedule() {
  let primaryKey = $('#staticBackdropLabel')[0].attributes.targetdate.value;
  let scheduleValue = {
    title: `${$('#schedule')[0].value}`,
    startDT: `${$('#startDT')[0].value}`,
    endDT: `${$('#endDT')[0].value}`,
    remark: `${$('#selectEvent')[0].value}`,
    color: `${$('#remarkColor')[0].value}`,
    remarkTxt: `${$('#remarkTxt')[0].value}`
  };

  if (localStorage.getItem(primaryKey) == null) {
    let schduleObj = [];
    schduleObj.push(scheduleValue);
    SaveToStorage(primaryKey, schduleObj);
  } else {
    let schduleObj = JSON.parse(localStorage.getItem(primaryKey));
    schduleObj.push(scheduleValue);
    SaveToStorage(primaryKey, schduleObj)
  }
  $('#scheduleForm').modal('hide');
  ClearBlock();
  SetEveryDays(curYear, curMonth);
}

function SaveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
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
          subItem.innerHTML = `<span>More...</span>`;
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

//往前進一點比停在原地好...寫吧

function EditSchedule(event){
  let PK = (event.target.getAttribute('pk'));
  let indexKey = (event.target.getAttribute('indexKey'));
  let schduleObj = JSON.parse(localStorage.getItem(PK));
  let centerTitle = $('#ModalCenterTitle')[0];
  centerTitle.innerText = `${monthName[PK.split(',')[1]]} ${PK.split(',')[2]}`;
  let editData = schduleObj[indexKey];
  $('#schedule')[0].value = editData.title;
  $('#startDT')[0].value = editData.startDT;
  $('#endDT')[0].value = editData.endDT;
  $('#selectEvent')[0].value = editData.remark;
  $('#remarkColor')[0].value = editData.color;
  $('#remarkTxt')[0].value = editData.remarkTxt;
  schduleObj.splice(indexKey,1);
  SaveToStorage(PK,schduleObj);
  $('#schduleDetail').modal('hide');
  $('#scheduleForm').modal('show');
}

function DelSchedule(event){
  let PK = (event.target.getAttribute('pk'));
  let indexKey = (event.target.getAttribute('indexKey'));
  let schduleObj = JSON.parse(localStorage.getItem(PK));
  schduleObj.splice(indexKey,1);
  SaveToStorage(PK,schduleObj);
  $('#schduleDetail').modal('hide');
  ClearBlock();
  SetEveryDays(curYear, curMonth);
}

window.onload = SetEveryDays(curYear, curMonth);