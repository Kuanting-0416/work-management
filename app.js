// 請將這裡的 "你的 Notion 資料庫 ID" 替換成你自己的資料庫 ID
const NOTION_DATABASE_ID = "裝機狀態";

let workData = [];
// 提交工作資料的函數
async function submitWork() {
  // 取得表單欄位的值
  const storeName = document.getElementById("storeName").value.trim();
  const installTime = document.getElementById("installTime").value.trim();
  const remoteID = document.getElementById("remoteID").value.trim();

  // 驗證輸入是否完整
  if (!storeName || !installTime) {
    alert("請完整填寫店家名稱和裝機時間！");
    return;
  }
  // 將資料存入 workData 陣列
  const newWork = { storeName, installTime, remoteID };
  workData.length = 0; // 清空 workData 陣列
  workData.push(newWork);

  // 更新資料列表
  updateWorkList(newWork);
  // 準備要傳送到後端的資料，這裡的 key 必須與後端程式碼中的 `JSON.parse(event.body)` 對應
  const dataToSend = {
    databaseId: NOTION_DATABASE_ID,
    storeName: storeName,
    installDate: installTime,
    remoteID: remoteID,
  };

  // 執行非同步請求，發送資料到你的 Netlify Function
  try {
    const response = await fetch("/.netlify/functions/submit-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json();

    if (response.ok) {
      alert("資料已成功送出到 Notion！");
      console.log(result.message);

      // 清空輸入欄位
      document.getElementById("storeName").value = "";
      document.getElementById("installTime").value = "";
      document.getElementById("remoteID").value = "";
    } else {
      alert("資料送出失敗：" + result.message);
      console.error(result.message);
    }
  } catch (error) {
    console.error("請求失敗:", error);
    alert("資料送出失敗，請檢查網路或稍後再試。");
  }
}

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
  updateWorkList;
});
