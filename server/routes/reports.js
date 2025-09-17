const express = require('express');
const multer = require('multer');
const { db } = require('../config/firebase');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
    }
  }
});

// Upload report
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { type } = req.body;
    const patientId = req.user.uid;

    // In a real app, you'd upload to cloud storage (Firebase Storage, AWS S3, etc.)
    // For this hackathon prototype, we'll simulate file storage
    const reportId = uuidv4();
    const fileName = `${reportId}-${req.file.originalname}`;
    const fileUrl = `https://storage.example.com/reports/${fileName}`;

    const reportData = {
      patientId,
      fileName: req.file.originalname,
      fileUrl,
      type: type || 'medical_report',
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date()
    };

    await db.collection('reports').doc(reportId).set(reportData);

    res.json({ 
      message: 'Report uploaded successfully', 
      reportId,
      report: reportData 
    });
  } catch (error) {
    console.error('Report upload error:', error);
    res.status(500).json({ error: 'Failed to upload report' });
  }
});

// Get reports for user
router.get('/my', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    const userRole = userDoc.data().role;

    let query;
    if (userRole === 'doctor') {
      // Doctors can see all reports (for consultation purposes)
      query = db.collection('reports');
    } else {
      // Patients can only see their own reports
      query = db.collection('reports').where('patientId', '==', userId);
    }

    const reportsSnapshot = await query.orderBy('uploadedAt', 'desc').get();
    const reports = [];

    for (const doc of reportsSnapshot.docs) {
      const reportData = doc.data();
      
      // Get patient info
      const patientDoc = await db.collection('users').doc(reportData.patientId).get();

      reports.push({
        id: doc.id,
        ...reportData,
        uploadedAt: reportData.uploadedAt.toDate(),
        patient: patientDoc.exists ? { name: patientDoc.data().name } : null
      });
    }

    res.json({ reports });
  } catch (error) {
    console.error('Reports fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get specific report
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const reportDoc = await db.collection('reports').doc(id).get();
    
    if (!reportDoc.exists) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const reportData = reportDoc.data();
    
    // Check if user can access this report
    const userDoc = await db.collection('users').doc(userId).get();
    const userRole = userDoc.data().role;
    
    if (userRole !== 'doctor' && reportData.patientId !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this report' });
    }

    // Get patient info
    const patientDoc = await db.collection('users').doc(reportData.patientId).get();

    res.json({
      id: reportDoc.id,
      ...reportData,
      uploadedAt: reportData.uploadedAt.toDate(),
      patient: patientDoc.exists ? { name: patientDoc.data().name, phone: patientDoc.data().phone } : null
    });
  } catch (error) {
    console.error('Report fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Delete report (patients only, their own reports)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const reportDoc = await db.collection('reports').doc(id).get();
    
    if (!reportDoc.exists) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const reportData = reportDoc.data();
    
    if (reportData.patientId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this report' });
    }

    await db.collection('reports').doc(id).delete();

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Report deletion error:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router;