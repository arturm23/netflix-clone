import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAGmkASdyNGzOv53mlbA2Q1KvQ2-TtZYzk",
    authDomain: "netflix-clone-c40c3.firebaseapp.com",
    projectId: "netflix-clone-c40c3",
    storageBucket: "netflix-clone-c40c3.appspot.com",
    messagingSenderId: "296896251012",
    appId: "1:296896251012:web:5055727fbf00089973aed1",
    measurementId: "G-0RTBG7Z6DF"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

export {auth}
export default db;