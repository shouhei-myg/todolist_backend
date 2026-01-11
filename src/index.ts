import express from "express";
import cors from "cors";
import { pool } from "./db";

const app = express();

// CORS対応 & JSONリクエストをパース
app.use(cors());
app.use(express.json());

// ---------------------------
// Todo一覧取得
// ---------------------------
app.get("/todos", async (_req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      input_value AS inputValue,
      created_at AS createdAt,
      status
    FROM todos
    ORDER BY created_at DESC;
    `
  );

  res.json(rows);
});

// ---------------------------
// 新規Todo作成
// ---------------------------
app.post("/todos", async (req, res) => {
  const { inputValue, status, createdAt } = req.body;
  await pool.query(
    "INSERT INTO todos (input_value, status, created_at) VALUES (?, ?, ?)",
    [inputValue, status, createdAt]
  );
  res.status(201).json({ success: true });
});

// ---------------------------
// Todo内容更新
// ---------------------------
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { inputValue } = req.body;
  await pool.query(
    "UPDATE todos SET input_value = ? WHERE id = ?",
    [inputValue, id]
  );
  res.json({ success: true });
});

// ---------------------------
// Todoを完了にする
// ---------------------------
app.put("/todos/:id/done", async (req, res) => {
  const { id } = req.params;
  await pool.query(
    "UPDATE todos SET status = 'done' WHERE id = ?",
    [id]
  );
  res.json({ success: true });
});

// ---------------------------
// Todoの編集用チェック（ステータス切替）
// ---------------------------
app.put("/todos/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "todo" または "done"
  await pool.query(
    "UPDATE todos SET status = ? WHERE id = ?",
    [status, id]
  );
  res.json({ success: true });
});

// ---------------------------
// Todo削除
// ---------------------------
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query(
    "DELETE FROM todos WHERE id = ?",
    [id]
  );
  res.json({ success: true });
});

// サーバー起動
app.listen(3001, () => {
  console.log("API server running on http://localhost:3001");
});
