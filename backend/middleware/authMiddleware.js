import jwt from "jsonwebtoken";


// =========================
// PROTECT (JWT AUTH CHECK)
// =========================
export const protect = (req, res, next) => {
  let token = req.headers.authorization;

  // 1. Check token exists
  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    // 2. Remove "Bearer " prefix if exists
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};



// =========================
// ROLE BASED ACCESS
// =========================
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied (role)" });
    }
    next();
  };
};


// OPTIONAL SHORTCUTS (YOUR ROUTES USE THESE)
export const isAdvisor = (req, res, next) => {
  if (req.user.role !== "advisor") {
    return res.status(403).json({ message: "Only advisors allowed" });
  }
  next();
};

export const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Only students allowed" });
  }
  next();
};