const { Client } = require("@notionhq/client");

// 初始化 Notion 客戶端，它會自動從 Netlify 環境變數中讀取密碼
const notion = new Client({ auth: process.env.NOTION_SECRET });

exports.handler = async (event, context) => {
  // 檢查請求方法是否為 POST，並確保有傳送資料
  if (event.httpMethod !== "POST" || !event.body) {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed or Missing Body" }),
    };
  }

  try {
    // 解析前端傳來的 JSON 資料
    const { databaseId, storeName, installDate, remoteID } = JSON.parse(
      event.body
    );

    if (!databaseId || !storeName || !installDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required data" }),
      };
    }

    // 建立要傳入 Notion 的頁面內容
    // 這裡的 properties key 必須完全對應你的 Notion 資料庫欄位名稱
    const newPage = {
      parent: { database_id: databaseId },
      properties: {
        // "店家名稱" 欄位，類型為 title
        店家名稱: { title: [{ text: { content: storeName } }] },

        // "裝機時間" 欄位，類型為 date
        裝機時間: { date: { start: installDate } },

        // "遠端ID" 欄位，類型為 rich_text。將遠端ID寫入備註。
        遠端ID: { rich_text: [{ text: { content: `遠端ID: ${remoteID}` } }] },
      },
    };

    // 使用 Notion API 建立新頁面 (也就是新增一筆資料)
    await notion.pages.create(newPage);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data submitted successfully!" }),
    };
  } catch (error) {
    console.error("Notion API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to submit data.",
        error: error.message,
      }),
    };
  }
};
