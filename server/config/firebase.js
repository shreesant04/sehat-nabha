const admin = require('firebase-admin');

// Mock Firebase Admin SDK for development
if (!admin.apps.length) {
  try {
    // Try to load real service account for production
    const serviceAccount = require('./serviceAccountKey.json');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`
    });
  } catch (error) {
    console.log('⚠️  Using mock Firebase Admin for development');
    // Use application default credentials or mock for development
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project'
    });
  }
}

// Mock Firestore for development
const db = process.env.NODE_ENV === 'development' 
  ? {
      collection: () => ({
        doc: () => ({
          set: () => Promise.resolve(),
          get: () => Promise.resolve({ exists: false, data: () => ({}) }),
          update: () => Promise.resolve(),
          delete: () => Promise.resolve()
        }),
        where: () => ({
          get: () => Promise.resolve({ empty: true, docs: [] }),
          orderBy: () => ({
            get: () => Promise.resolve({ empty: true, docs: [] }),
            limit: () => ({
              get: () => Promise.resolve({ empty: true, docs: [] })
            })
          }),
          limit: () => ({
            get: () => Promise.resolve({ empty: true, docs: [] })
          })
        }),
        orderBy: () => ({
          get: () => Promise.resolve({ empty: true, docs: [] })
        }),
        add: () => Promise.resolve({ id: 'mock-id' })
      })
    }
  : admin.firestore();

// Mock Auth for development
const auth = process.env.NODE_ENV === 'development'
  ? {
      verifyIdToken: () => Promise.resolve({ uid: 'mock-user', email: 'mock@example.com' })
    }
  : admin.auth();

module.exports = { admin, db, auth };