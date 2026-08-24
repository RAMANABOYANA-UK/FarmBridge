// Generates a short, human-readable order ID
// Format: FB + last 8 digits of timestamp + 3 random digits
const generateOrderId = () => {
  return 'FB' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
};

module.exports = generateOrderId;