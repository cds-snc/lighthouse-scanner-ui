import express from "express";
export const router = express.Router();

router.get("/", function(req, res) {
  res.send(`hello from home !!`);
});
