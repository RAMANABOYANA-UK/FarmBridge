const tenantMiddleware = (req, res, next) => {
  // For now we take tenant from header or default
  // Later this can come from subdomain or JWT
  req.tenantId = req.headers['x-tenant-id'] || null;
  next();
};

module.exports = tenantMiddleware;