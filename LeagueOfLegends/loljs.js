let data = '';
    let dataRow = document.querySelector('.dataRow');
    var alink =[];
    var msg = document.getElementById('showMsg');
    $.ajax({
      type: "GET",
      url: "https://spreadsheets.google.com/feeds/list/1gDbnJS_p6YEHMLrzmjiDxxUhnK8Hjdm0f_CJXKf0LTc/od6/public/values?alt=json",
      success: function (response) {
        data = response;
        CreateCard(data["feed"]["entry"]);
        // debugger; .link .pic .main-pic
        alink = document.querySelectorAll('.card');
        alink.forEach((element) => {
          element.addEventListener('click',ShowInfor);
        })
      }
    });

    
    
    function CreateCard(input) {
      let templateCard = document.querySelector('#templateCard'); //抓到模版
      input.forEach((item) => {
        let cloneContent = templateCard.content.cloneNode(true); //copy
        let img = cloneContent.querySelector('.main-pic');
        let roleName = cloneContent.querySelector('#RoleName');
        let priceP = cloneContent.querySelector('.price-p');
        let priceM = cloneContent.querySelector('.price-m');
        img.setAttribute('src',item.gsx$img.$t);
        img.setAttribute('title',item.gsx$name.$t);
        roleName.innerText = item.gsx$name.$t;
        priceP.innerText = item.gsx$price.$t;
        priceM.innerText = item.gsx$price.$t / 50;
        dataRow.appendChild(cloneContent);
      })
    }

    function ShowInfor(){
      let target = this.querySelector('.main-pic');
      console.log(target.title);
      data["feed"]["entry"].forEach((el) => {
        if (el.gsx$name.$t == target.title){
          msg.innerHTML = el["gsx$information"]["$t"]
        } 
      })
      $('#show').modal('show');
    }