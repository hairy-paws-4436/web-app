import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyASh4x9dpEl3wuNeNxai9NCtOQsbJXb5xc",
  authDomain: "hairy-paws-c47d9.firebaseapp.com",
  projectId: "hairy-paws-c47d9",
  storageBucket: "hairy-paws-c47d9.firebasestorage.app",
  messagingSenderId: "609288473983",
  appId: "1:609288473983:web:49c98d0debf6b233415e4a",
  measurementId: "G-511E9KVTP8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
