/**
 * Central site configuration.
 * Change company details here once — they propagate to every page,
 * the footer, structured data (JSON-LD), and meta tags.
 */
module.exports = {
  companyName: "Overseas Warehousing Pvt. Ltd.",
  shortName: "OWPL",
  cfsName: "CFS-OWPL",
  url: process.env.SITE_URL || "https://www.owpl-cfs.com",
  email: "info@owpl-cfs.com",
  phonePlaceholder: "+91-XXXXX-XXXXX",
  address: {
    line1: "Ramgarh, Chandigarh Road",
    city: "Ludhiana",
    state: "Punjab",
    country: "India",
    zip: "141XXX"
  },
  social: {
    linkedin: "#",
    facebook: "#",
    twitter: "#",
    youtube: "#"
  },
  established: 1998,
  yearsOfExcellence: new Date().getFullYear() - 1998,
  railheads: ["CONCOR", "Pristine", "GDL", "HTPL", "Adani", "PLIL"],
  ports: ["Mundra", "Pipavav", "Nhava Sheva (JNPT)", "Other Gateway Ports"],
  regionsServed: ["Punjab", "Himachal Pradesh", "Jammu"],
  colors: {
    navy: "#0B1E3A",
    steel: "#4A5A6A",
    orange: "#E6631E",
    white: "#FFFFFF"
  }
};
