/**
 * Placeholder routes for modules listed under "Future Scalability" in the project brief:
 * Container Tracking, Bill Tracking, Invoice Download, Customer Login, Employee Portal,
 * Online Payments, Booking Requests, Document Upload, Tender Notices, Career Portal,
 * Blog, GST Downloads, Circulars, News, Customer Dashboard, AI Chat Assistant,
 * ERP Integration, API Integrations.
 *
 * These are intentionally NOT built out yet. This router just reserves the URL space
 * and renders a "coming soon" page, so real implementations can be dropped into
 * /future/{module}/ later without touching routes.js, pageController.js, or the
 * public site's navigation structure.
 */
const express = require("express");
const router = express.Router();

const comingSoon = (label) => (req, res) => {
  res.render("pages/coming-soon", {
    meta: {
      title: `${label} | Coming Soon | OWPL`,
      description: `${label} module is under development.`,
      keywords: "",
      canonical: "",
      path: req.originalUrl
    },
    label,
    active: ""
  });
};

router.get("/tracking", comingSoon("Container & Bill Tracking"));
router.get("/customer", comingSoon("Customer Portal"));
router.get("/employee", comingSoon("Employee Portal"));
router.get("/careers", comingSoon("Career Portal"));
router.get("/blog", comingSoon("Blog"));
router.get("/news", comingSoon("News"));
router.get("/circulars", comingSoon("Circulars"));

module.exports = router;
