const Order = require('../models/Order');
const Product = require('../models/Product');

const getFarmerDashboardStats = async (farmerId) => {
  const [pendingOrders, totalProducts, recentOrders] = await Promise.all([
    Order.countDocuments({ farmer: farmerId, status: { $in: ['pending', 'confirmed'] } }),
    Product.countDocuments({ farmer: farmerId, isActive: true }),
    Order.find({ farmer: farmerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('buyer', 'name phone')
  ]);

  const delivered = await Order.find({ farmer: farmerId, status: 'delivered' });
  const monthlyEarnings = delivered.reduce((sum, o) => sum + o.farmerAmount, 0);

  return {
    pendingOrders,
    totalProducts,
    monthlyEarnings,
    averageRating: 0, // later from reviews
    recentOrders
  };
};

module.exports = { getFarmerDashboardStats };