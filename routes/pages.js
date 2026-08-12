const express = require("express");
const router = express.Router();
const page = require("../controllers/pageController");

router.get("/", page.home);
router.get("/about-us", page.about);
router.get("/services", page.services);
router.get("/why-choose-us", page.whyChooseUs);
router.get("/infrastructure", page.infrastructure);
router.get("/rail-connectivity", page.railConnectivity);
router.get("/road-connectivity", page.roadConnectivity);
router.get("/gallery", page.gallery);
router.get("/tariff", page.tariff);
router.get("/notices", page.notices);
router.get("/contact-us", page.contact);
router.get("/privacy-policy", page.privacy);
router.get("/terms-and-conditions", page.terms);
router.get("/sitemap", page.sitemap);

module.exports = router;
