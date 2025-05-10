const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fetch = require("node-fetch");

router.get("/cart/download-pdf", async (req, res) => {
  try {
    if (!req.query.items) {
      return res.status(400).json({ error: "Items parameter is required" });
    }

    const items = JSON.parse(decodeURIComponent(req.query.items));
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Items must be an array" });
    }

    // this will validate the items by checking if they have a name, qty, and price
    items.forEach((item) => {
      if (!item.name) throw new Error("Each item must have a name");
      if (!item.qty) throw new Error("Each item must have a qty");
      if (!item.price) throw new Error("Each item must have a price");

      // we will remove the IQD from the price and convert it to a float because the price is a string and we need to make sure it's a number
      item.price = parseFloat(item.price.toString().replace(/[^0-9.]/g, ""));
    });

    const doc = new PDFDocument({ margin: 50 });
    // this will set the content type to pdf so the browser knows how to handle the file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=\"retailxplore-cart.pdf\"; filename*=UTF-8''retailxplore-cart.pdf"
    );
    // this will enable caching so the browser can cache the file and serve it from the cache if the user requests the same file again
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
    res.setHeader("ETag", `"${Date.now()}"`); // ETag is a unique identifier for the file

    // this will check if the browser has a cached version of the file by comparing the ETag with the if-none-match header
    const ifNoneMatch = req.headers["if-none-match"];
    if (ifNoneMatch && ifNoneMatch === res.getHeader("ETag")) {
      return res.status(304).end(); // not modified
    }
    doc.pipe(res); // pipe means that the PDF will be sent to the response
    doc.fontSize(25).text("RetailXplore Shopping List", { align: "center" });
    doc.moveDown();
    const timestamp = new Date().toISOString();
    const qrCodeData = await QRCode.toDataURL(timestamp);
    doc.image(qrCodeData, 50, 50, { width: 50 });

    // y is the y-coordinate of the first row of the table and we will use it to position the table
    // total is the total price of the items
    let y = 150;
    let total = 0;

    // these are the headers of the table
    doc.fontSize(12);
    doc.text("Product", 50, y);
    doc.text("Quantity", 250, y);
    doc.text("Price (IQD)", 350, y);
    doc.text("Subtotal", 450, y);
    y += 20; // this will add 20 pixels to the y-coordinate of the first row of the table

    // this will loop through the items and add them to the table
    for (const item of items) {
      const price = item.isDiscounted
        ? item.price * (1 - item.discountRate / 100)
        : item.price;
      const subtotal = price * item.qty;
      total += subtotal;

      try {
        if (item.image) {
          const response = await fetch(item.image);
          const imageBuffer = await response.buffer();
          doc.image(imageBuffer, 50, y, { width: 30, height: 30 }); // add the product image to the PDF
          doc.text(item.name, 90, y + 10);
        } else {
          doc.text(item.name, 50, y + 10);
        }
      } catch (error) {
        console.error("Failed to load image:", error);
        doc.text(item.name, 50, y + 10);
      }

      doc.text(item.qty.toString(), 250, y + 10);

      // for discounted items we will show the original price and the discounted price
      if (item.isDiscounted) {
        doc
          .fontSize(10)
          .text(`${item.price.toFixed(2)} IQD`, 350, y + 5, { strike: true })
          .text(`${price.toFixed(2)} IQD`, 350, y + 15, { color: "red" })
          .fontSize(12);
      } else {
        doc.text(`${price.toFixed(2)} IQD`, 350, y + 10);
      }

      doc.text(`${subtotal.toFixed(2)} IQD`, 450, y + 10);

      y += 40;

      // if we're running out of space we will add a new page
      if (y > doc.page.height - 150) {
        doc.addPage();
        y = 50;
      }
    }
    doc.moveDown();
    doc.fontSize(14).text(`Total: ${total.toFixed(2)} IQD`, { align: "right" });
    doc
      .fontSize(10)
      .text("RetailXplore Store", 50, doc.page.height - 100)
      .text("Contact: support@retailxplore.com", 50, doc.page.height - 60);

    doc.end();
  } catch (error) {
    if (!res.headersSent) {
      console.error("PDF generation error:", error);
      res.status(500).json({
        error: "Failed to generate PDF",
        details: error.message,
      });
    }
  }
});

module.exports = router;
