const noticesStore = require("../utils/noticesStore");

exports.list = (req, res) => {
  res.render("admin/notices", {
    layout: false,
    notices: noticesStore.getAll(),
    flash: req.query.flash || null
  });
};

exports.create = (req, res) => {
  const { title, date, time, category, description, pinned } = req.body;

  if (!title || !date) {
    return res.redirect("/admin/notices?flash=" + encodeURIComponent("Title and date are required."));
  }

  const pdfPath = req.file ? `/pdf/${req.file.filename}` : "";

  noticesStore.add({
    title,
    date,
    time,
    category,
    description,
    pdf: pdfPath,
    pinned: pinned === "on"
  });

  res.redirect("/admin/notices?flash=" + encodeURIComponent("Notice published."));
};

exports.remove = (req, res) => {
  noticesStore.remove(req.params.id);
  res.redirect("/admin/notices?flash=" + encodeURIComponent("Notice deleted."));
};

exports.togglePin = (req, res) => {
  noticesStore.togglePin(req.params.id);
  res.redirect("/admin/notices?flash=" + encodeURIComponent("Notice updated."));
};
