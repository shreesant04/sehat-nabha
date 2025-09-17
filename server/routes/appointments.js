const express = require('express');
const { db } = require('../config/firebase');
const { verifyToken, checkRole } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Book appointment (patients only)
router.post('/book', verifyToken, checkRole(['patient']), async (req, res) => {
  try {
    const { doctorId, scheduledAt, reason } = req.body;
    const patientId = req.user.uid;

    // Validate required fields
    if (!doctorId || !scheduledAt || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if doctor exists
    const doctorDoc = await db.collection('users').doc(doctorId).get();
    if (!doctorDoc.exists || doctorDoc.data().role !== 'doctor') {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const appointmentId = uuidv4();
    const jitsiRoom = `appointment-${appointmentId}`;

    const appointmentData = {
      patientId,
      doctorId,
      status: 'pending',
      scheduledAt: new Date(scheduledAt),
      reason,
      jitsiRoom,
      createdAt: new Date()
    };

    await db.collection('appointments').doc(appointmentId).set(appointmentData);

    res.json({ 
      message: 'Appointment booked successfully', 
      appointmentId,
      appointment: appointmentData 
    });
  } catch (error) {
    console.error('Appointment booking error:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Get appointments for user
router.get('/my', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    const userRole = userDoc.data().role;

    let query;
    if (userRole === 'doctor') {
      query = db.collection('appointments').where('doctorId', '==', userId);
    } else {
      query = db.collection('appointments').where('patientId', '==', userId);
    }

    const appointmentsSnapshot = await query.orderBy('scheduledAt', 'desc').get();
    const appointments = [];

    for (const doc of appointmentsSnapshot.docs) {
      const appointmentData = doc.data();
      
      // Get patient and doctor info
      const [patientDoc, doctorDoc] = await Promise.all([
        db.collection('users').doc(appointmentData.patientId).get(),
        db.collection('users').doc(appointmentData.doctorId).get()
      ]);

      appointments.push({
        id: doc.id,
        ...appointmentData,
        scheduledAt: appointmentData.scheduledAt.toDate(),
        createdAt: appointmentData.createdAt.toDate(),
        patient: patientDoc.exists ? { name: patientDoc.data().name } : null,
        doctor: doctorDoc.exists ? { name: doctorDoc.data().name } : null
      });
    }

    res.json({ appointments });
  } catch (error) {
    console.error('Appointments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Update appointment status (doctors only)
router.patch('/:id/status', verifyToken, checkRole(['doctor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const doctorId = req.user.uid;

    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const appointmentRef = db.collection('appointments').doc(id);
    const appointmentDoc = await appointmentRef.get();

    if (!appointmentDoc.exists) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointmentData = appointmentDoc.data();
    if (appointmentData.doctorId !== doctorId) {
      return res.status(403).json({ error: 'Not authorized to update this appointment' });
    }

    await appointmentRef.update({
      status,
      updatedAt: new Date()
    });

    res.json({ message: 'Appointment status updated successfully' });
  } catch (error) {
    console.error('Appointment update error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Get specific appointment
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const appointmentDoc = await db.collection('appointments').doc(id).get();
    
    if (!appointmentDoc.exists) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointmentData = appointmentDoc.data();
    
    // Check if user is involved in this appointment
    if (appointmentData.patientId !== userId && appointmentData.doctorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this appointment' });
    }

    // Get patient and doctor info
    const [patientDoc, doctorDoc] = await Promise.all([
      db.collection('users').doc(appointmentData.patientId).get(),
      db.collection('users').doc(appointmentData.doctorId).get()
    ]);

    res.json({
      id: appointmentDoc.id,
      ...appointmentData,
      scheduledAt: appointmentData.scheduledAt.toDate(),
      createdAt: appointmentData.createdAt.toDate(),
      patient: patientDoc.exists ? { name: patientDoc.data().name, phone: patientDoc.data().phone } : null,
      doctor: doctorDoc.exists ? { name: doctorDoc.data().name } : null
    });
  } catch (error) {
    console.error('Appointment fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

module.exports = router;