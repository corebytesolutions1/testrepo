const site = require("../config/site");
const services = require("../data/services");
const noticesStore = require("../utils/noticesStore");

// Every page gets its own unique meta block — required for SEO per the brief.
function meta(overrides) {
  return {
    title: `${overrides.title} | ${site.shortName} - ${site.companyName}`,
    description: overrides.description,
    keywords: overrides.keywords,
    canonical: `${site.url}${overrides.path}`,
    path: overrides.path
  };
}

exports.home = (req, res) => {
  res.render("pages/home", {
    meta: meta({
      title: "North India's Leading Container Freight Station",
      description:
        "CFS-OWPL, operated by Overseas Warehousing Pvt. Ltd., is the first private Container Freight Station in Punjab, serving Punjab, Himachal Pradesh & Jammu since 1998.",
      keywords: "CFS Ludhiana, Container Freight Station Punjab, EXIM logistics Punjab, bonded warehouse Ludhiana",
      path: "/"
    }),
    services: services.slice(0, 6),
    notices: noticesStore.getAll().slice(0, 3),
    active: "home"
  });
};

exports.about = (req, res) => {
  res.render("pages/about", {
    meta: meta({
      title: "About Us",
      description:
        "Learn about Overseas Warehousing Pvt. Ltd.'s 25+ year history as Punjab's first private Container Freight Station.",
      keywords: "OWPL history, CFS Ludhiana about, container freight station Punjab company",
      path: "/about-us"
    }),
    active: "about"
  });
};

exports.services = (req, res) => {
  res.render("pages/services", {
    meta: meta({
      title: "Our Services",
      description:
        "Explore CFS-OWPL's full range of services: container freight station operations, bonded warehousing, cargo handling, stuffing/destuffing, rail & road logistics.",
      keywords: "CFS services, bonded warehouse, cargo handling Ludhiana, stuffing destuffing services",
      path: "/services"
    }),
    services,
    active: "services"
  });
};

exports.whyChooseUs = (req, res) => {
  res.render("pages/why-choose-us", {
    meta: meta({
      title: "Why Choose Us",
      description:
        "25+ years of experience, first private CFS in Punjab, multi-railhead connectivity and reliable EXIM logistics infrastructure.",
      keywords: "why choose OWPL, best CFS Punjab, reliable logistics partner Ludhiana",
      path: "/why-choose-us"
    }),
    active: "why-choose-us"
  });
};

exports.infrastructure = (req, res) => {
  res.render("pages/infrastructure", {
    meta: meta({
      title: "Infrastructure",
      description:
        "Explore CFS-OWPL's warehousing, container yard, cargo handling equipment, and customs area infrastructure.",
      keywords: "CFS infrastructure, container yard Ludhiana, warehouse infrastructure Punjab",
      path: "/infrastructure"
    }),
    active: "infrastructure"
  });
};

exports.railConnectivity = (req, res) => {
  res.render("pages/rail-connectivity", {
    meta: meta({
      title: "Rail Connectivity",
      description:
        "CFS-OWPL is connected to major ICDs and railheads including CONCOR, Pristine, GDL, HTPL, Adani, and PLIL.",
      keywords: "CFS rail connectivity, CONCOR Ludhiana, ICD connectivity Punjab",
      path: "/rail-connectivity"
    }),
    railheads: site.railheads,
    active: "rail-connectivity"
  });
};

exports.roadConnectivity = (req, res) => {
  res.render("pages/road-connectivity", {
    meta: meta({
      title: "Road Connectivity",
      description:
        "Road logistics connectivity from CFS-OWPL to Mundra, Pipavav, Nhava Sheva (JNPT), and other major Indian gateway ports.",
      keywords: "CFS road connectivity, Ludhiana to Mundra port, road transport JNPT",
      path: "/road-connectivity"
    }),
    ports: site.ports,
    active: "road-connectivity"
  });
};

exports.gallery = (req, res) => {
  res.render("pages/gallery", {
    meta: meta({
      title: "Image Gallery",
      description: "Browse photos of CFS-OWPL's warehouses, infrastructure, cargo operations, and container yard.",
      keywords: "CFS gallery, container yard photos, warehouse images Ludhiana",
      path: "/gallery"
    }),
    active: "gallery"
  });
};

exports.tariff = (req, res) => {
  res.render("pages/tariff", {
    meta: meta({
      title: "Tariff",
      description: "Download the latest CFS-OWPL tariff schedule for container freight station services.",
      keywords: "CFS tariff Ludhiana, container freight station charges Punjab",
      path: "/tariff"
    }),
    active: "tariff"
  });
};

exports.notices = (req, res) => {
  res.render("pages/notices", {
    meta: meta({
      title: "Notice Board",
      description: "Latest notices, circulars, and updates from CFS-OWPL.",
      keywords: "CFS notices, customs circulars Ludhiana, OWPL announcements",
      path: "/notices"
    }),
    notices: noticesStore.getAll(),
    active: "notices"
  });
};

exports.contact = (req, res) => {
  res.render("pages/contact", {
    meta: meta({
      title: "Contact Us",
      description: "Get in touch with CFS-OWPL in Ludhiana, Punjab for EXIM logistics, warehousing, and CFS services.",
      keywords: "contact OWPL, CFS Ludhiana address, EXIM logistics enquiry Punjab",
      path: "/contact-us"
    }),
    active: "contact"
  });
};

exports.privacy = (req, res) => {
  res.render("pages/privacy", {
    meta: meta({
      title: "Privacy Policy",
      description: "Privacy Policy of Overseas Warehousing Pvt. Ltd.",
      keywords: "OWPL privacy policy",
      path: "/privacy-policy"
    }),
    active: ""
  });
};

exports.terms = (req, res) => {
  res.render("pages/terms", {
    meta: meta({
      title: "Terms & Conditions",
      description: "Terms & Conditions for using the Overseas Warehousing Pvt. Ltd. website and services.",
      keywords: "OWPL terms and conditions",
      path: "/terms-and-conditions"
    }),
    active: ""
  });
};

exports.sitemap = (req, res) => {
  res.render("pages/sitemap", {
    meta: meta({
      title: "Sitemap",
      description: "Full sitemap of the Overseas Warehousing Pvt. Ltd. website.",
      keywords: "OWPL sitemap",
      path: "/sitemap"
    }),
    active: ""
  });
};

exports.notFound = (req, res) => {
  res.status(404).render("pages/404", {
    meta: meta({
      title: "Page Not Found",
      description: "The page you are looking for could not be found.",
      keywords: "",
      path: req.originalUrl
    }),
    active: ""
  });
};
