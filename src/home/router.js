import express from "express";
import { view } from "./view";
export const router = express.Router();

router.get("/favicon.ico", (req, res) => res.status(204));

router.get("/:currentPage?", async (req, res) => {
  let currentPage = req.params.currentPage;

  if (!currentPage) {
    currentPage = 1;
  }

  res.send(await view({ currentPage: currentPage }));
});
