import express from "express";

import build from "./build/index.js";

const app = express();

app.use(express.static("public"));

app.use((req, res) => {
  build(res);
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
