let workData = [];

// 提交工作資料的函數
function submitWork() {
  const storeName = document.getElementById("storeName").value.trim();
  const installTime = document.getElementById("installTime").value.trim();
  const remoteID = document.getElementById("remoteID").value.trim();

  // 驗證輸入是否完整
  if (!storeName || !installTime || !remoteID) {
    alert("請完整填寫所有欄位！");
    return;
  }

  // 將資料存入 workData 陣列
  const newWork = { storeName, installTime, remoteID };
  workData.length = 0; // 清空 workData 陣列
  workData.push(newWork);

  // 更新資料列表
  updateWorkList(newWork);

  console.log("目前的工作資料:", workData);
  // 清空輸入欄位
  document.getElementById("storeName").value = "";
  document.getElementById("installTime").value = "";
  document.getElementById("remoteID").value = "";
}

// 更新資料列表的函數
function updateWorkList(work) {
  const list = document.getElementById("list1");

  // 清空列表，重新渲染
  list.innerHTML = "";

  // 渲染所有資料
  workData.forEach((item, index) => {
    const li1 = document.createElement("li");
    li1.textContent = `店名：${item.storeName}`;
    list.appendChild(li1);

    const li2 = document.createElement("li");
    li2.textContent = `裝機時間：${item.installTime}`;
    list.appendChild(li2);

    const li3 = document.createElement("li");
    li3.textContent = `遠端ID：${item.remoteID}`;
    list.appendChild(li3);
  });
}

// 綁定按鈕事件
const myButton = document.getElementById("myButton");
myButton.addEventListener("click", function (event) {
  event.preventDefault(); // 阻止表單的預設提交行為
  submitWork();
  updateWorkList(workData);
});
