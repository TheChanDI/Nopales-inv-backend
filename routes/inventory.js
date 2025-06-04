import express from "express";
import createXlsFile from "../controllers/inventoryController.js";

const router = express.Router();

//Posting JSON data from the mobile app
router.post("/", (req, res) => {
  console.log("Received JSON data:", req.body);
  const jsonData = req.body;
  const isSuccess = createXlsFile(jsonData);
  if (isSuccess) {
    res.status(200).json({ message: "Email sent successfully" });
  } else {
    res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;
