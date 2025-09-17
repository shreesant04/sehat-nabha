const express = require('express');
const router = express.Router();

// Simple symptom checker responses in English and Punjabi
const symptomResponses = {
  en: {
    fever: {
      message: "You have reported fever. This could be due to various reasons including infection, flu, or other conditions.",
      advice: "Please monitor your temperature, stay hydrated, and rest. If fever persists or goes above 101°F, consult a doctor immediately.",
      urgency: "medium",
      shouldConsultDoctor: true
    },
    cough: {
      message: "Cough can be due to cold, flu, allergies, or respiratory infections.",
      advice: "Stay hydrated, avoid cold drinks, and consider warm water with honey. If cough persists for more than a week or has blood, see a doctor.",
      urgency: "low",
      shouldConsultDoctor: false
    },
    headache: {
      message: "Headaches can be caused by stress, dehydration, lack of sleep, or underlying conditions.",
      advice: "Rest in a quiet, dark room, stay hydrated, and try gentle head massage. If severe or recurring, consult a doctor.",
      urgency: "low",
      shouldConsultDoctor: false
    },
    "chest pain": {
      message: "Chest pain can be serious and may indicate heart, lung, or muscle problems.",
      advice: "Seek immediate medical attention, especially if accompanied by shortness of breath, sweating, or nausea.",
      urgency: "high",
      shouldConsultDoctor: true
    },
    "stomach pain": {
      message: "Stomach pain can be due to indigestion, gas, food poisoning, or more serious conditions.",
      advice: "Avoid solid foods, drink clear fluids, and rest. If severe or persistent, consult a doctor.",
      urgency: "medium",
      shouldConsultDoctor: false
    },
    "cold": {
      message: "Common cold is usually caused by viral infections and resolves on its own.",
      advice: "Rest, drink warm fluids, use steam inhalation, and maintain good hygiene. Recovery usually takes 7-10 days.",
      urgency: "low",
      shouldConsultDoctor: false
    },
    "high blood pressure": {
      message: "High blood pressure requires regular monitoring and medical management.",
      advice: "Reduce salt intake, exercise regularly, avoid stress, and take prescribed medications. Monitor regularly.",
      urgency: "medium",
      shouldConsultDoctor: true
    }
  },
  pa: {
    fever: {
      message: "ਤੁਹਾਨੂੰ ਬੁਖਾਰ ਹੈ। ਇਹ ਕਈ ਕਾਰਨਾਂ ਕਰਕੇ ਹੋ ਸਕਦਾ ਹੈ ਜਿਵੇਂ ਇਨਫੈਕਸ਼ਨ, ਫਲੂ, ਜਾਂ ਹੋਰ ਬਿਮਾਰੀਆਂ।",
      advice: "ਆਪਣਾ ਤਾਪਮਾਨ ਚੈੱਕ ਕਰਦੇ ਰਹੋ, ਪਾਣੀ ਪੀਂਦੇ ਰਹੋ, ਅਤੇ ਆਰਾਮ ਕਰੋ। ਜੇ ਬੁਖਾਰ 101°F ਤੋਂ ਵੱਧ ਹੋਵੇ ਤਾਂ ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।",
      urgency: "medium",
      shouldConsultDoctor: true
    },
    cough: {
      message: "ਖੰਘ ਸਰਦੀ, ਫਲੂ, ਐਲਰਜੀ, ਜਾਂ ਸਾਹ ਦੀ ਇਨਫੈਕਸ਼ਨ ਕਾਰਨ ਹੋ ਸਕਦੀ ਹੈ।",
      advice: "ਪਾਣੀ ਪੀਂਦੇ ਰਹੋ, ਠੰਡੇ ਪੇਅ ਤੋਂ ਬਚੋ, ਸ਼ਹਿਦ ਵਾਲਾ ਗਰਮ ਪਾਣੀ ਪੀਓ। ਜੇ ਇੱਕ ਹਫ਼ਤੇ ਬਾਅਦ ਵੀ ਖੰਘ ਹੈ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।",
      urgency: "low",
      shouldConsultDoctor: false
    },
    headache: {
      message: "ਸਿਰ ਦਰਦ ਤਣਾਅ, ਪਾਣੀ ਦੀ ਕਮੀ, ਨੀਂਦ ਦੀ ਕਮੀ, ਜਾਂ ਹੋਰ ਕਾਰਨਾਂ ਤੋਂ ਹੋ ਸਕਦਾ ਹੈ।",
      advice: "ਸ਼ਾਂਤ ਥਾਂ ਤੇ ਆਰਾਮ ਕਰੋ, ਪਾਣੀ ਪੀਓ, ਸਿਰ ਦੀ ਹਲਕੀ ਮਾਲਿਸ਼ ਕਰੋ। ਜੇ ਬਹੁਤ ਤੇਜ਼ ਹੈ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।",
      urgency: "low",
      shouldConsultDoctor: false
    },
    "chest pain": {
      message: "ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਗੰਭੀਰ ਹੋ ਸਕਦਾ ਹੈ ਅਤੇ ਦਿਲ, ਫੇਫੜੇ, ਜਾਂ ਮਾਸਪੇਸ਼ੀਆਂ ਦੀ ਸਮੱਸਿਆ ਹੋ ਸਕਦੀ ਹੈ।",
      advice: "ਤੁਰੰਤ ਮੈਡੀਕਲ ਸਹਾਇਤਾ ਲਓ, ਖਾਸ ਕਰਕੇ ਜੇ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ, ਪਸੀਨਾ, ਜਾਂ ਉਲਟੀ ਆਵੇ।",
      urgency: "high",
      shouldConsultDoctor: true
    },
    "stomach pain": {
      message: "ਪੇਟ ਦਰਦ ਬਦਹਜ਼ਮੀ, ਗੈਸ, ਫੂਡ ਪਾਇਜ਼ਨਿੰਗ, ਜਾਂ ਹੋਰ ਗੰਭੀਰ ਕਾਰਨਾਂ ਤੋਂ ਹੋ ਸਕਦਾ ਹੈ।",
      advice: "ਠੋਸ ਭੋਜਨ ਨਾ ਖਾਓ, ਤਰਲ ਪਦਾਰਥ ਪੀਓ, ਅਤੇ ਆਰਾਮ ਕਰੋ। ਜੇ ਬਹੁਤ ਤੇਜ਼ ਹੈ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।",
      urgency: "medium",
      shouldConsultDoctor: false
    }
  }
};

// AI Chatbot for symptom checking
router.post('/check-symptoms', async (req, res) => {
  try {
    const { symptoms, language = 'en' } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms array is required' });
    }

    const lang = language === 'pa' ? 'pa' : 'en';
    const responses = symptomResponses[lang];
    
    let analysis = {
      language: lang,
      symptoms: symptoms,
      responses: [],
      overallUrgency: 'low',
      shouldConsultDoctor: false,
      recommendations: []
    };

    // Check each symptom
    for (const symptom of symptoms) {
      const normalizedSymptom = symptom.toLowerCase().trim();
      let response = null;

      // Find matching symptom
      for (const [key, value] of Object.entries(responses)) {
        if (normalizedSymptom.includes(key) || key.includes(normalizedSymptom)) {
          response = { symptom: key, ...value };
          break;
        }
      }

      if (!response) {
        // Generic response for unknown symptoms
        response = {
          symptom: normalizedSymptom,
          message: lang === 'pa' 
            ? "ਤੁਹਾਡੇ ਦੱਸੇ ਲੱਛਣਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।"
            : "Information about this symptom is not available in our database.",
          advice: lang === 'pa'
            ? "ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਵਿਸਤਾਰ ਵਿੱਚ ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ।"
            : "Please consult with a doctor for detailed evaluation of your symptoms.",
          urgency: "medium",
          shouldConsultDoctor: true
        };
      }

      analysis.responses.push(response);

      // Update overall urgency
      if (response.urgency === 'high') {
        analysis.overallUrgency = 'high';
      } else if (response.urgency === 'medium' && analysis.overallUrgency === 'low') {
        analysis.overallUrgency = 'medium';
      }

      // Update consultation recommendation
      if (response.shouldConsultDoctor) {
        analysis.shouldConsultDoctor = true;
      }
    }

    // Generate overall recommendations
    if (analysis.overallUrgency === 'high') {
      analysis.recommendations.push(
        lang === 'pa' 
          ? "ਤੁਰੰਤ ਮੈਡੀਕਲ ਸਹਾਇਤਾ ਲਓ। ਸਥਿਤੀ ਗੰਭੀਰ ਹੋ ਸਕਦੀ ਹੈ।"
          : "Seek immediate medical attention. This could be a serious condition."
      );
    } else if (analysis.shouldConsultDoctor) {
      analysis.recommendations.push(
        lang === 'pa'
          ? "ਜਲਦੀ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ। ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ।"
          : "Consult with a doctor soon. Consider booking an appointment."
      );
    }

    // Add general health tips
    analysis.recommendations.push(
      lang === 'pa'
        ? "ਭਰਪੂਰ ਆਰਾਮ ਕਰੋ ਅਤੇ ਪਾਣੀ ਪੀਂਦੇ ਰਹੋ।"
        : "Get plenty of rest and stay hydrated."
    );

    // Disclaimer
    analysis.disclaimer = lang === 'pa'
      ? "ਇਹ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਦੇ ਲਈ ਹੈ। ਮੈਡੀਕਲ ਸਲਾਹ ਦੇ ਲਈ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।"
      : "This is for informational purposes only. Consult a doctor for professional medical advice.";

    res.json(analysis);

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to analyze symptoms' });
  }
});

// Get available chatbot languages
router.get('/languages', (req, res) => {
  res.json({
    languages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
    ]
  });
});

// Get common symptoms list
router.get('/symptoms', (req, res) => {
  const { language = 'en' } = req.query;
  const lang = language === 'pa' ? 'pa' : 'en';

  const commonSymptoms = {
    en: [
      'fever', 'cough', 'headache', 'chest pain', 'stomach pain', 
      'cold', 'sore throat', 'body ache', 'nausea', 'dizziness',
      'high blood pressure', 'diabetes symptoms', 'breathing difficulty'
    ],
    pa: [
      'ਬੁਖਾਰ', 'ਖੰਘ', 'ਸਿਰ ਦਰਦ', 'ਛਾਤੀ ਦਰਦ', 'ਪੇਟ ਦਰਦ',
      'ਸਰਦੀ', 'ਗਲੇ ਦਰਦ', 'ਸਰੀਰ ਦਰਦ', 'ਉਲਟੀ', 'ਚੱਕਰ ਆਉਣਾ',
      'ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ', 'ਸ਼ੂਗਰ ਦੇ ਲੱਛਣ', 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ'
    ]
  };

  res.json({ symptoms: commonSymptoms[lang] });
});

module.exports = router;