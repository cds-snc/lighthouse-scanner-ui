import express from "express";
import { view } from "./view";
export const router = express.Router();
router.get("/", async (req, res) => {
  res.send(await view());
});
