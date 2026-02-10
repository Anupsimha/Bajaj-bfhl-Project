import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { bfhlController } from "./controller/bfhlController.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: "m.n.0561.be23@chitkara.edu.in"
  });
});

app.post("/bfhl", bfhlController);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
