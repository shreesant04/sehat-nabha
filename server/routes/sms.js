const express = require('express');
const twilio = require('twilio');
const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Mock Twilio client for development
const client = process.env.NODE_ENV === 'development' || !process.env.TWILIO_ACCOUNT_SID?.startsWith('AC')
  ? {
      messages: {
        create: (params) => {
          console.log('📱 Mock SMS:', params);
          return Promise.resolve({ sid: 'mock-sms-id' });
        }
      }
    }
  : twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Twilio webhook for SMS booking
router.post('/webhook', async (req, res) => {
  try {
    const { Body, From } = req.body;
    
    if (!Body || !From) {
      return res.status(400).send('Invalid request');
    }

    const message = Body.trim().toUpperCase();
    const phoneNumber = From;

    // Parse booking message: "BOOK DD/MM/YYYY HH:MM REASON"
    const bookingMatch = message.match(/^BOOK\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2})\s+(.+)$/);
    
    if (!bookingMatch) {
      const response = `Invalid format. Please use: BOOK DD/MM/YYYY HH:MM REASON
Example: BOOK 25/12/2023 10:30 Fever and cough`;
      
      await client.messages.create({
        body: response,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      
      return res.status(200).send('Invalid format response sent');
    }

    const [, dateStr, timeStr, reason] = bookingMatch;
    
    try {
      // Parse date and time
      const [day, month, year] = dateStr.split('/').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      const scheduledAt = new Date(year, month - 1, day, hours, minutes);
      
      // Check if date is in the future
      if (scheduledAt <= new Date()) {
        throw new Error('Date must be in the future');
      }

      // Find user by phone number
      const usersSnapshot = await db.collection('users')
        .where('phone', '==', phoneNumber)
        .limit(1)
        .get();

      let patientId;
      if (usersSnapshot.empty) {
        // Create new user
        patientId = uuidv4();
        await db.collection('users').doc(patientId).set({
          phone: phoneNumber,
          name: `SMS User ${phoneNumber.slice(-4)}`,
          role: 'patient',
          registeredVia: 'sms',
          createdAt: new Date()
        });
      } else {
        patientId = usersSnapshot.docs[0].id;
      }

      // Find an available doctor (simple round-robin for hackathon)
      const doctorsSnapshot = await db.collection('users')
        .where('role', '==', 'doctor')
        .limit(1)
        .get();

      if (doctorsSnapshot.empty) {
        const response = `Sorry, no doctors are available at this time. Please try again later or visit our website.`;
        
        await client.messages.create({
          body: response,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber
        });
        
        return res.status(200).send('No doctors available response sent');
      }

      const doctorId = doctorsSnapshot.docs[0].id;
      const appointmentId = uuidv4();
      const jitsiRoom = `appointment-${appointmentId}`;

      // Create appointment
      const appointmentData = {
        patientId,
        doctorId,
        status: 'pending',
        scheduledAt,
        reason,
        jitsiRoom,
        bookedVia: 'sms',
        createdAt: new Date()
      };

      await db.collection('appointments').doc(appointmentId).set(appointmentData);

      const response = `✅ Appointment booked successfully!
📅 Date: ${dateStr} at ${timeStr}
🩺 Reason: ${reason}
📋 ID: ${appointmentId.slice(0, 8)}

You will receive updates via SMS. For video consultation, please visit our website.`;

      await client.messages.create({
        body: response,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      res.status(200).send('Appointment booked successfully');

    } catch (dateError) {
      const response = `Invalid date/time format. Please use DD/MM/YYYY HH:MM format.
Example: BOOK 25/12/2023 10:30 Fever and cough`;
      
      await client.messages.create({
        body: response,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      
      res.status(200).send('Invalid date format response sent');
    }

  } catch (error) {
    console.error('SMS webhook error:', error);
    
    try {
      await client.messages.create({
        body: 'Sorry, there was an error processing your request. Please try again later.',
        from: process.env.TWILIO_PHONE_NUMBER,
        to: req.body.From
      });
    } catch (smsError) {
      console.error('Error sending error SMS:', smsError);
    }
    
    res.status(500).send('Error processing SMS');
  }
});

// Send SMS notification (internal use)
router.post('/notify', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    res.json({ 
      message: 'SMS sent successfully', 
      messageId: result.sid 
    });
  } catch (error) {
    console.error('SMS send error:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

module.exports = router;