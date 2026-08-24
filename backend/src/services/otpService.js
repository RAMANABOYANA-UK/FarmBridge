const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('./emailService');
const { sendOtpWhatsApp } = require('./whatsappService');

const EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
const MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS) || 5;
const RATE_LIMIT_MINUTES = parseInt(process.env.OTP_RATE_LIMIT_MINUTES) || 15;
const RATE_LIMIT_COUNT = parseInt(process.env.OTP_RATE_LIMIT_COUNT) || 3;

/**
 * Generate 6-digit OTP
 */
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Send OTP
 */
const sendOtp = async ({ userId, email, phone, purpose = 'general', channel = 'email' }) => {
  // Rate limiting
  const recentCount = await Otp.countDocuments({
    user: userId,
    createdAt: { $gte: new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000) }
  });

  if (recentCount >= RATE_LIMIT_COUNT) {
    const err = new Error(`Too many OTP requests. Please try again after ${RATE_LIMIT_MINUTES} minutes.`);
    err.statusCode = 429;
    throw err;
  }

  // Invalidate previous unused OTPs for same purpose
  await Otp.updateMany(
    { user: userId, purpose, isUsed: false },
    { $set: { isUsed: true } }
  );

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  await Otp.create({
    user: userId,
    email,
    phone,
    otpHash,
    purpose,
    expiresAt
  });

  // Send via preferred channel
  let result;
  if (channel === 'whatsapp' && phone) {
    result = await sendOtpWhatsApp(phone, otp);
  } else if (email) {
    result = await sendOtpEmail(email, otp, purpose);
  } else {
    throw new Error('No valid channel (email or phone) provided');
  }

  // Never return the OTP in production response
  return {
    success: true,
    message: `OTP sent via ${channel}`,
    expiresInMinutes: EXPIRY_MINUTES,
    // only for development – remove in production
    ...(process.env.NODE_ENV === 'development' && { debugOtp: otp })
  };
};

/**
 * Verify OTP
 */
const verifyOtp = async ({ userId, otp, purpose = 'general' }) => {
  const record = await Otp.findOne({
    user: userId,
    purpose,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });

  if (!record) {
    const err = new Error('OTP expired or not found');
    err.statusCode = 400;
    throw err;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.isUsed = true;
    await record.save();
    const err = new Error('Maximum attempts exceeded. Please request a new OTP.');
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(otp, record.otpHash);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    const err = new Error('Invalid OTP');
    err.statusCode = 400;
    throw err;
  }

  // Mark as used
  record.isUsed = true;
  await record.save();

  return { success: true, message: 'OTP verified successfully' };
};

module.exports = { sendOtp, verifyOtp };
