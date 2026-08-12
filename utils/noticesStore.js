const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "notices.json");

function readAll() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read notices.json:", err.message);
    return [];
  }
}

function writeAll(notices) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notices, null, 2), "utf-8");
}

function getAll() {
  return readAll().sort((a, b) => {
    if (a.pinned !== b.pinned) return b.pinned - a.pinned;
    return new Date(b.date) - new Date(a.date);
  });
}

function add(notice) {
  const notices = readAll();
  const nextId = notices.length ? Math.max(...notices.map((n) => n.id)) + 1 : 1;
  const newNotice = {
    id: nextId,
    title: notice.title,
    date: notice.date,
    time: notice.time || "00:00",
    category: notice.category || "General",
    description: notice.description || "",
    pdf: notice.pdf || "",
    pinned: !!notice.pinned,
    isNew: true
  };
  notices.push(newNotice);
  writeAll(notices);
  return newNotice;
}

function remove(id) {
  const notices = readAll().filter((n) => n.id !== Number(id));
  writeAll(notices);
}

function togglePin(id) {
  const notices = readAll();
  const notice = notices.find((n) => n.id === Number(id));
  if (notice) {
    notice.pinned = !notice.pinned;
    writeAll(notices);
  }
  return notice;
}

module.exports = { getAll, add, remove, togglePin };
