import { db, storage } from './config';
import { 
  collection, addDoc, updateDoc, doc, onSnapshot, 
  query, orderBy, limit, serverTimestamp, arrayUnion, increment, getDoc, setDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const REPORTS_COLLECTION = "reports";

export const subscribeToReports = (callback) => {
  const q = query(
    collection(db, REPORTS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  
  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert timestamp to friendly string for UI compatibility
        createdAtStr: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toLocaleString() : new Date().toLocaleString()
      }
    });
    callback(reports);
  });
};

export const uploadMedia = async (file) => {
  if (!file) return null;
  
  // Option B: Mock Upload to bypass Firebase Storage Billing
  // Simulates network delay safely
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Returns a high-quality placeholder image representing civic issues
  return "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80";
};

export const addReport = async (reportData, file = null) => {
  let mediaUrls = [];
  
  if (file) {
    const url = await uploadMedia(file);
    if (url) mediaUrls.push(url);
  }

  const user = auth.currentUser;
  const contact = user ? (user.email || user.phoneNumber || "Guest") : "Anonymous";

  const newReport = {
    title: reportData.title || `Issue regarding ${reportData.category}`,
    description: reportData.description,
    category: reportData.category,
    location: reportData.location || { lat: 12.9716, lng: 77.5946, address: "Unknown coordinates" },
    status: "Received",
    priority: reportData.priority || "Medium", 
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    reporterPhone: contact,
    mediaUrls,
    auditTrail: [{
      status: "Received",
      updatedBy: "Citizen",
      notes: "Report submitted via PWA.",
      timestamp: new Date().toISOString()
    }],
    upvotes: 0 
  };

  // Offline support strategy:
  if (!navigator.onLine) {
    const offlineReports = JSON.parse(localStorage.getItem('offlineReports') || '[]');
    newReport.isOffline = true;
    newReport.uid = Date.now().toString(); 
    offlineReports.push({ ...newReport }); 
    localStorage.setItem('offlineReports', JSON.stringify(offlineReports));
    return newReport;
  }

  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore timeout: Database connection hanging.")), 10000));
  return await Promise.race([addDoc(collection(db, REPORTS_COLLECTION), newReport), timeout]);
};

export const syncOfflineReports = async () => {
    const offlineReports = JSON.parse(localStorage.getItem('offlineReports') || '[]');
    if (offlineReports.length === 0) return;
    
    for (const report of offlineReports) {
        delete report.isOffline;
        delete report.uid;
        await addDoc(collection(db, REPORTS_COLLECTION), report);
    }
    localStorage.removeItem('offlineReports');
};

export const updateReportStatus = async (id, newStatus, verificationData = null) => {
  const docRef = doc(db, REPORTS_COLLECTION, id);
  
  const auditEntry = {
    status: newStatus,
    updatedBy: verificationData?.updatedBy || "System Admin",
    notes: verificationData?.notes || `Status updated to ${newStatus}`,
    timestamp: new Date().toISOString()
  };

  const updatePayload = {
    status: newStatus,
    updatedAt: serverTimestamp(),
    auditTrail: arrayUnion(auditEntry)
  };

  if (verificationData?.mediaUrl) {
    updatePayload.mediaUrls = arrayUnion(verificationData.mediaUrl);
  }

  return await updateDoc(docRef, updatePayload);
};

export const upvoteReport = async (id) => {
  const docRef = doc(db, REPORTS_COLLECTION, id);
  return await updateDoc(docRef, { upvotes: increment(1) });
};

export const saveUserRole = async (uid, contactInfo, role = "citizen") => {
   const userRef = doc(db, 'users', uid);
   const userDoc = await getDoc(userRef);
   if (!userDoc.exists()) {
      await setDoc(userRef, { contact: contactInfo || "Guest", role, createdAt: serverTimestamp() });
   }
};

export const checkAdminRole = async (uid) => {
   const userRef = doc(db, 'users', uid);
   const userDoc = await getDoc(userRef);
   return userDoc.exists() && userDoc.data().role === 'admin';
};
