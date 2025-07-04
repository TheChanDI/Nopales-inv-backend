import * as xlsx from "xlsx";
import fs from "fs";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createXlsFile = async (data) => {
  console.log(__dirname, "dir name");

  const flatData = [];

  for (const [category, products] of Object.entries(data)) {
    for (const [productName, details] of Object.entries(products)) {
      flatData.push({
        Category: category,
        Product: productName,
        Count: details.count ?? "",
        "Box Count": details.boxCount ?? "",
      });
    }
  }

  const worksheet = xlsx.utils.json_to_sheet(flatData);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Inventory");

  const fileName = `nopales_inventory.xlsx`;
  const filePath = path.join(__dirname, fileName);

  try {
    // Check if directory exists and is writable
    if (!fs.existsSync(__dirname)) {
      fs.mkdirSync(__dirname, { recursive: true });
    }

    // Write Excel file
    xlsx.writeFile(workbook, filePath);

    console.log(`Excel file created successfully at: ${filePath}`);
    //sending email
    const isSent = await sendEmail(filePath);
    console.log(isSent, "---->");
    return isSent;
  } catch (error) {
    console.error("Error creating Excel file:", error);
    return false;
  }
};

const sendEmail = async (filePath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: "chandiprakash16@gmail.com",
      pass: process.env.APP_PASSWORD,
    },
  });

  // Mail options
  const mailOptions = {
    from: "chandiprakash16@gmail.com",
    to: "rcklsschandi@gmail.com",
    subject: "Inventory Count Excel File",
    text: "Attached is the inventory Excel file.",
    attachments: [
      {
        filename: "nopales_inventory.xlsx",
        path: filePath,
      },
    ],
  };
  //send mail
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    // Clean up: delete the file after sending
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🧹 Temp file deleted:", filePath);
    }

    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    return false;
  }
};

export default createXlsFile;
