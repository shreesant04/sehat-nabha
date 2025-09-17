const express = require('express');
const { db } = require('../config/firebase');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Register/Update user profile
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { name, phone, aadhaar, role } = req.body;
    const uid = req.user.uid;

    // Validate Aadhaar format (mockup for hackathon)
    if (aadhaar && !/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({ error: 'Invalid Aadhaar format' });
    }

    // Validate phone format
    if (!/^\+?[1-9]\d{9,14}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }

    const userData = {
      name,
      phone,
      role: role || 'patient',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (aadhaar) {
      userData.aadhaar = aadhaar;
    }

    await db.collection('users').doc(uid).set(userData, { merge: true });

    res.json({ message: 'User registered successfully', user: userData });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    delete userData.aadhaar; // Don't expose Aadhaar in API response

    res.json({ user: userData });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctorsSnapshot = await db.collection('users')
      .where('role', '==', 'doctor')
      .get();

    const doctors = [];
    doctorsSnapshot.forEach(doc => {
      const data = doc.data();
      delete data.aadhaar; // Don't expose Aadhaar
      doctors.push({ id: doc.id, ...data });
    });

    res.json({ doctors });
  } catch (error) {
    console.error('Doctors fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

module.exports = router;