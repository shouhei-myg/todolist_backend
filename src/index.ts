import express from "express";
import cors from "cors";
import { pool } from "./db";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/todos", async (_req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      input_value AS inputValue,
      checked,
      created_at AS createdAt
    FROM todos
    ORDER BY created_at DESC
    `
  );

  res.json(rows);
});

app.post("/todos", async (req, res) => {
  const { inputValue, checked, createdAt } = req.body;

  await pool.query(
    "INSERT INTO todos (input_value, checked, created_at) VALUES (?, ?, ?)",
    [inputValue, checked, createdAt]
  );

  res.status(201).json({ success: true });
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { inputValue } = req.body;

  await pool.query(
    "UPDATE todos SET input_value = ? WHERE id = ?",
    [inputValue, id]
  );

  res.json({ success: true });
});

app.put("/todos/:id/check", async (req, res) => {
  console.log("CHECK API REGISTERED");

  const { id } = req.params;
  const { checked } = req.body;

  await pool.query(
    "UPDATE todos SET checked = ? WHERE id = ?",
    [checked, id]
  );

  res.json({ success: true });
});


app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM todos WHERE id = ?",
    [id]
  );

  res.json({ success: true });
});

app.listen(3001, () => {
  console.log("API server running on http://localhost:3001");
});
