const express = require('express');
const { db } = require('../config/firebase');
const { verifyToken, checkRole } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Create prescription (doctors only)
router.post('/', verifyToken, checkRole(['doctor']), async (req, res) => {
  try {
    const { appointmentId, drugs, notes } = req.body;
    const doctorId = req.user.uid;

    // Validate appointment exists and belongs to doctor
    const appointmentDoc = await db.collection('appointments').doc(appointmentId).get();
    if (!appointmentDoc.exists) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointmentData = appointmentDoc.data();
    if (appointmentData.doctorId !== doctorId) {
      return res.status(403).json({ error: 'Not authorized for this appointment' });
    }

    const prescriptionId = uuidv4();
    const prescriptionData = {
      appointmentId,
      doctorId,
      patientId: appointmentData.patientId,
      drugs: drugs || [],
      notes: notes || '',
      createdAt: new Date()
    };

    await db.collection('prescriptions').doc(prescriptionId).set(prescriptionData);

    res.json({ 
      message: 'Prescription created successfully', 
      prescriptionId,
      prescription: prescriptionData 
    });
  } catch (error) {
    console.error('Prescription creation error:', error);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
});

// Get prescriptions for user
router.get('/my', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    const userRole = userDoc.data().role;

    let query;
    if (userRole === 'doctor') {
      query = db.collection('prescriptions').where('doctorId', '==', userId);
    } else {
      query = db.collection('prescriptions').where('patientId', '==', userId);
    }

    const prescriptionsSnapshot = await query.orderBy('createdAt', 'desc').get();
    const prescriptions = [];

    for (const doc of prescriptionsSnapshot.docs) {
      const prescriptionData = doc.data();
      
      // Get patient and doctor info
      const [patientDoc, doctorDoc] = await Promise.all([
        db.collection('users').doc(prescriptionData.patientId).get(),
        db.collection('users').doc(prescriptionData.doctorId).get()
      ]);

      prescriptions.push({
        id: doc.id,
        ...prescriptionData,
        createdAt: prescriptionData.createdAt.toDate(),
        patient: patientDoc.exists ? { name: patientDoc.data().name } : null,
        doctor: doctorDoc.exists ? { name: doctorDoc.data().name } : null
      });
    }

    res.json({ prescriptions });
  } catch (error) {
    console.error('Prescriptions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// Get specific prescription
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const prescriptionDoc = await db.collection('prescriptions').doc(id).get();
    
    if (!prescriptionDoc.exists) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    const prescriptionData = prescriptionDoc.data();
    
    // Check if user is involved in this prescription
    if (prescriptionData.patientId !== userId && prescriptionData.doctorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this prescription' });
    }

    // Get patient and doctor info
    const [patientDoc, doctorDoc] = await Promise.all([
      db.collection('users').doc(prescriptionData.patientId).get(),
      db.collection('users').doc(prescriptionData.doctorId).get()
    ]);

    res.json({
      id: prescriptionDoc.id,
      ...prescriptionData,
      createdAt: prescriptionData.createdAt.toDate(),
      patient: patientDoc.exists ? { name: patientDoc.data().name, phone: patientDoc.data().phone } : null,
      doctor: doctorDoc.exists ? { name: doctorDoc.data().name } : null
    });
  } catch (error) {
    console.error('Prescription fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch prescription' });
  }
});

module.exports = router;