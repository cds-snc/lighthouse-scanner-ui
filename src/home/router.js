import express from "express";
import { view } from "./view";
export const router = express.Router();
router.get("/", function(req, res) {
  res.send(view);
});
