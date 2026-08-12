/**
 * Minimal HTTP Basic Auth for /admin routes.
 * No extra dependency needed — the browser handles the login prompt natively.
 *
 * Set ADMIN_USER and ADMIN_PASSWORD in .env before deploying. This is
 * intentionally simple (fine for a single-operator internal tool); if you
 * need multiple admin accounts, audit logs, or password resets, swap this
 * for a real auth/session module in future/admin/.
 */
module.exports = function adminAuth(req, res, next) {
  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASSWORD;

  if (!pass) {
    return res
      .status(500)
      .send("Admin panel is not configured. Set ADMIN_PASSWORD in your .env file.");
  }

  const header = req.headers.authorization || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme === "Basic" && encoded) {
    const [reqUser, reqPass] = Buffer.from(encoded, "base64").toString().split(":");
    if (reqUser === user && reqPass === pass) {
      return next();
    }
  }

  res.set("WWW-Authenticate", 'Basic realm="OWPL Admin"');
  return res.status(401).send("Authentication required.");
};
