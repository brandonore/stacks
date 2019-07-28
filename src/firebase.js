import firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyAJqnMUF9b5eWRUWj-a4ics9BXtObzcaTo",
    authDomain: "marshmallow-744b1.firebaseapp.com",
    databaseURL: "https://marshmallow-744b1.firebaseio.com",
    projectId: "marshmallow-744b1",
    storageBucket: "marshmallow-744b1.appspot.com",
    messagingSenderId: "692683414250",
    appId: "1:692683414250:web:26d71c8fe5ee8e2d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
const storage = firebase.storageBucket

export default { db, storage }