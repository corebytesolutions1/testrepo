const noticesStore = require("../utils/noticesStore");
const storage = require("../utils/storage");

const PAGE_SIZE = 10;

exports.list = (req, res) => {
  const all = noticesStore.getAll();
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = all.slice(start, start + PAGE_SIZE);

  res.render("admin/notices", {
    layout: false,
    notices: pageItems,
    totalCount: all.length,
    currentPage,
    totalPages,
    cloudEnabled: storage.isCloudEnabled(),
    flash: req.query.flash || null
  });
};

exports.create = async (req, res) => {
  try {
    const { title, date, time, category, description, pinned } = req.body;

    if (!title || !date) {
      return res.redirect("/admin/notices?flash=" + encodeURIComponent("Title and date are required."));
    }

    let pdfPath = "";
    if (req.file) {
      pdfPath = await storage.saveFile(req.file);
    }

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
  } catch (err) {
    console.error("Failed to publish notice:", err);
    res.redirect("/admin/notices?flash=" + encodeURIComponent("Upload failed: " + err.message));
  }
};

exports.remove = async (req, res) => {
  try {
    const notice = noticesStore.getAll().find((n) => n.id === Number(req.params.id));
    if (notice && notice.pdf) {
      await storage.deleteFile(notice.pdf);
    }
    noticesStore.remove(req.params.id);
    res.redirect("/admin/notices?page=" + (req.query.page || 1) + "&flash=" + encodeURIComponent("Notice deleted."));
  } catch (err) {
    console.error("Failed to delete notice:", err);
    res.redirect("/admin/notices?flash=" + encodeURIComponent("Delete failed: " + err.message));
  }
};

exports.togglePin = (req, res) => {
  noticesStore.togglePin(req.params.id);
  res.redirect("/admin/notices?page=" + (req.query.page || 1) + "&flash=" + encodeURIComponent("Notice updated."));
};
