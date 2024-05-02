import firebase from "firebase/compat/app";
//auth
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsmeo7WmecACtE4VPrzlx5ltj72M9Am70",
  authDomain: "clone-1231.firebaseapp.com",
  projectId: "clone-1231",
  storageBucket: "clone-1231.appspot.com",
  messagingSenderId: "1020335397463",
  appId: "1:1020335397463:web:fef54a35abca1f8dc46112"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = app.firestore();

