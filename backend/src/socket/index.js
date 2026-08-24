// Socket.io event wiring for FarmBridge real-time features
const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a role-specific room (farmer_<id> / buyer_<id>)
    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined user room ${userId}`);
    });

    // Join a specific order room to receive status updates
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`Socket ${socket.id} joined order room ${orderId}`);
    });

    // A farmer can join their incoming-order room
    socket.on('join_farmer', (farmerId) => {
      socket.join(`farmer_${farmerId}`);
      console.log(`Socket ${socket.id} joined farmer room ${farmerId}`);
    });

    // A buyer can join their own room for notifications
    socket.on('join_buyer', (buyerId) => {
      socket.join(`buyer_${buyerId}`);
      console.log(`Socket ${socket.id} joined buyer room ${buyerId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = registerSocketHandlers;