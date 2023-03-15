const express = require("express");
const cors = require("cors"); // เปิดการ Block Cors
const { sendRequestGetJson } = require("./function/service.js");

const http = require("http");

const fetch = require("node-fetch");
const app = express(); // ไว้ Config ค่าต่างๆ
const PORT = process.env.PORT || 8080;

app.use(express.json()); //รับ parameter Json
app.use(express.urlencoded({ extended: true })); //รับ parameter URL Encode

app.use(cors()); // เปิดการ Block Cors

app.get("/getsolr/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  try {
    const data = await sendRequestGetJson(
      `http://127.0.0.1:8983/solr/test/select?q=_text_:` +
        keyword +
        `&q.op=OR&indent=true&facet=true&facet.field=author&facet.field=publisher&facet.mincount=1&wt=json`
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      content: "",
    });
  }
});

//กรณีไม่พบ Method เปิดแจ้งเตือน
app.use((req, res, next) => {
  res.status(404).json({ error: "Page not found" });
});

//ให้ run ที่ port ตาม Config
app.listen(PORT, () => {
  console.log("run on : " + PORT);
});
