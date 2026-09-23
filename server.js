require("dotenv").config();
const express = require("express");
const path = require("path");
const compression = require("compression");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

const { helmetConfig, limiter } = require("./middleware/security");
const site = require("./config/site");

const pageRoutes = require("./routes/pages");
const futureRoutes = require("./routes/future");
const adminRoutes = require("./routes/admin");
const pageController = require("./controllers/pageController");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// ---------- Core Middleware ----------
app.use(helmetConfig);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", limiter);

// ---------- Static Assets ----------
app.use(express.static(path.join(__dirname, "public"), { maxAge: "7d" }));

// ---------- Globals available in every view ----------
app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.currentPath = req.path;
  next();
});

// ---------- Routes ----------
app.use("/", pageRoutes);
app.use("/future", futureRoutes); // reserved for modules listed in the brief's "Future Scalability" section
app.use("/admin", adminRoutes); // notice board management — protected by Basic Auth, see middleware/adminAuth.js

// ---------- 404 ----------
app.use(pageController.notFound);

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/500", {
    meta: { title: "Server Error | OWPL", description: "", keywords: "", canonical: "", path: "" },
    active: ""
  });
});

// Only bind a real port when run directly (e.g. `node server.js`, or on a
// normal host like Render/Railway/a VPS). On Vercel, the platform imports
// this file as a serverless function and calls the exported `app` itself —
// it does NOT run app.listen(). Without this guard, and without the
// module.exports line + vercel.json below, Vercel has no way to route
// requests like /admin/notices to this Express app at all, which is why
// pages "worked" inconsistently — only routes Vercel happened to expose
// were reachable.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`OWPL website running at http://localhost:${PORT}`);
  });
}

module.exports = app;
