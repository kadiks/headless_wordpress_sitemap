const express = require("express");

const getSitemap = require("./getSitemap");

// Variables that should be in a .env file, but here for simplicity sake
// Make sure to replace their values accordingly to your need
const port = 3000;
const destHost = "<YOUR SITE>";
const sourceHost = "<YOUR OTHER SITE>";
// END - Variables that should be in a .env file

// Setup server
const app = express();

// Routes set up

// I hate having a process running without knowing what it is.
// So if there's no index, I still display a basic text
app.get("/", (req, res) => {
  res.send("Welcome to Headless Wordpress Sitemap");
});

// The sitemap has to be at the root of the domain
app.get("/sitemap.xml", async (req, res) => {
  const sitemap = await getSitemap({ destHost, sourceHost });
  res.header("Content-Type", "application/xml");
  res.send(sitemap.toString());
});

// // BONUS: Caching
// const fs = require("fs-extra"); // should be at the top of the file
// const path = require("path"); // should be at the top of the file

// app.get("/sitemap.xml", async (req, res) => {
//   const localFilePath = "cache/sitemap.xml";
//   let sitemap = null;
//   // Check if the file exist in the cache
//   // If yes, use it
//   if ((await fs.exists(localFilePath)) === false) {
//     sitemap = await getSitemap({ destHost, sourceHost });
//     await fs.writeFile(localFilePath, sitemap.toString());
//   }

//   res.header("Content-Type", "application/xml");
//   res.sendFile(path.join(__dirname, localFilePath)); // We send the generated file
// });

// Start server
app.listen(port, () => {
  console.log(`Server started started on port ${port}`);
});
