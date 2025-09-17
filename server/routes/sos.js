const express = require('express');
const { db } = require('../config/firebase');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Emergency SOS
router.post('/emergency', verifyToken, async (req, res) => {
  try {
    const { latitude, longitude, emergencyType = 'general' } = req.body;
    const userId = req.user.uid;

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates are required' });
    }

    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const sosId = uuidv4();
    const sosData = {
      userId,
      latitude,
      longitude,
      emergencyType,
      status: 'active',
      createdAt: new Date()
    };

    await db.collection('sos_logs').doc(sosId).set(sosData);

    // Get user info for emergency response
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // In a real implementation, this would:
    // 1. Contact nearest hospital/ambulance service
    // 2. Send SMS/call to emergency contacts
    // 3. Notify emergency response team
    // 4. Integrate with local emergency services API

    // For this hackathon prototype, we'll simulate emergency response
    const emergencyResponse = {
      sosId,
      status: 'received',
      estimatedResponseTime: '10-15 minutes',
      nearestHospital: {
        name: 'Civil Hospital Nabha',
        phone: '+91-1765-222222',
        distance: '2.5 km'
      },
      ambulanceService: {
        phone: '108', // National Ambulance Service
        alternatePhone: '+91-1765-223344'
      },
      emergencyContacts: [
        { name: 'Police', phone: '100' },
        { name: 'Fire Brigade', phone: '101' },
        { name: 'Ambulance', phone: '108' }
      ]
    };

    // Log the emergency response
    await db.collection('sos_logs').doc(sosId).update({
      response: emergencyResponse,
      responseAt: new Date()
    });

    res.json({
      message: 'Emergency SOS activated successfully',
      sosId,
      response: emergencyResponse
    });

  } catch (error) {
    console.error('SOS error:', error);
    res.status(500).json({ error: 'Failed to activate emergency SOS' });
  }
});

// Get SOS history for user
router.get('/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const sosSnapshot = await db.collection('sos_logs')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const sosHistory = [];
    sosSnapshot.forEach(doc => {
      const data = doc.data();
      sosHistory.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        responseAt: data.responseAt ? data.responseAt.toDate() : null
      });
    });

    res.json({ sosHistory });
  } catch (error) {
    console.error('SOS history error:', error);
    res.status(500).json({ error: 'Failed to fetch SOS history' });
  }
});

// Update SOS status (for emergency responders - in real app would have separate auth)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responderNotes } = req.body;
    
    const validStatuses = ['active', 'responded', 'resolved', 'false_alarm'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const sosRef = db.collection('sos_logs').doc(id);
    const sosDoc = await sosRef.get();

    if (!sosDoc.exists) {
      return res.status(404).json({ error: 'SOS record not found' });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (responderNotes) {
      updateData.responderNotes = responderNotes;
    }

    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    }

    await sosRef.update(updateData);

    res.json({ message: 'SOS status updated successfully' });
  } catch (error) {
    console.error('SOS status update error:', error);
    res.status(500).json({ error: 'Failed to update SOS status' });
  }
});

// Get nearby hospitals/emergency services
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates are required' });
    }

    // In a real implementation, this would query a database of hospitals
    // and calculate distances based on coordinates
    // For this hackathon, we'll return mock data for Nabha area
    const nearbyServices = [
      {
        id: 'hospital_1',
        name: 'Civil Hospital Nabha',
        type: 'hospital',
        phone: '+91-1765-222222',
        address: 'Hospital Road, Nabha, Punjab 147201',
        distance: '2.5 km',
        services: ['Emergency', 'General Medicine', 'Pediatrics'],
        available24x7: true
      },
      {
        id: 'hospital_2',
        name: 'CHC Bhadson',
        type: 'health_center',
        phone: '+91-1765-233333',
        address: 'Bhadson, Patiala, Punjab',
        distance: '8.2 km',
        services: ['Primary Care', 'Emergency'],
        available24x7: false
      },
      {
        id: 'pharmacy_1',
        name: 'Apollo Pharmacy',
        type: 'pharmacy',
        phone: '+91-1765-244444',
        address: 'Main Market, Nabha, Punjab',
        distance: '1.8 km',
        services: ['Medicines', '24x7 Service'],
        available24x7: true
      }
    ];

    res.json({ nearbyServices });
  } catch (error) {
    console.error('Nearby services error:', error);
    res.status(500).json({ error: 'Failed to fetch nearby services' });
  }
});

module.exports = router;