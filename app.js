// app.js

const PRICE_PER_MONTH = 550;

const startMonthInput = document.getElementById("startMonth");
const monthsSelect = document.getElementById("months");
const priceEl = document.getElementById("price");
const priceDetail = document.getElementById("priceDetail");
const exampleText = document.getElementById("exampleText");
const endDateText = document.getElementById("endDateText");

function calcStartMonth(){

  const now = new Date();

  const y = now.getFullYear();
  const m = now.getMonth();

  const deadline = new Date(y,m,9,20,0,0);

  let start;

  if(now <= deadline){
    start = new Date(y,m+1,1);
  }else{
    start = new Date(y,m+2,1);
  }

  return start;
}

function formatMonth(d){

  return `${d.getFullYear()}年${d.getMonth()+1}月1日から開始`;

}

function updateStartMonth(){

  const start = calcStartMonth();

  startMonthInput.value = formatMonth(start);

  const now = new Date();

  const currentMonth = now.getMonth() + 1;

  let nextMonth = currentMonth + 1;

  if(nextMonth > 12){
    nextMonth = 1;
  }

  exampleText.innerHTML =
  `例）${currentMonth}月9日20:00までの送信 → ${nextMonth}月1日からの開始です。`;
}

function updatePrice(){

  const months = Number(monthsSelect.value);

  const total = months * PRICE_PER_MONTH;

  priceEl.textContent =
  total.toLocaleString() + "円";

  priceDetail.textContent =
  `${months}か月 × 550円（税込）`;

  const start = calcStartMonth();

  const end = new Date(
    start.getFullYear(),
    start.getMonth() + months,
    0
  );

  if(endDateText){
    endDateText.innerHTML =
    `休会最終日 / END DATE<br>${end.getFullYear()}年${end.getMonth()+1}月${end.getDate()}日`;
  }

}

monthsSelect.addEventListener("change",updatePrice);

updateStartMonth();
updatePrice();

document
.getElementById("submitBtn")
.addEventListener("click",()=>{

  const memberNo =
  document.getElementById("memberNo").value.trim();

  const name =
  document.getElementById("name").value.trim();

  const email =
  document.getElementById("email").value.trim();

  const agree =
  document.getElementById("agree").checked;

  if(!memberNo || !name || !email){

    alert("必須項目を入力してください");
    return;
  }

  if(!/^\d{6}$/.test(memberNo)){

    alert("会員番号は6桁の数字で入力してください");
    return;
  }

  if(!email.includes("@")){

    alert("メールアドレスを正しく入力してください");
    return;
  }

  if(!agree){

    alert("同意チェックをしてください");
    return;
  }

 fetch("https://script.google.com/macros/s/AKfycbwC5rNeeaWud79fT8nNbiG2gKNG2PHwc8dJ_fc8TfOBZht0ECW1p_iGa74s3ZrlT2-7/exec",{

  method:"POST",

  headers:{
    "Content-Type":"application/json"
  },

  body:JSON.stringify({

    memberNo,
    name,
    email,

    startMonth:
    startMonthInput.value,

    months:
    monthsSelect.value,

    endDate:
    endDateText.innerText,

    price:
    priceEl.innerText.replace("円","")

  })

})
.then(r=>r.json())
.then(data=>{

  if(data.success){

    alert("休会届を受付しました");

    location.reload();

  }else{

    alert("送信失敗");

    console.log(data);

  }

})
.catch(err=>{

  alert("通信エラー");

  console.log(err);

});

});
