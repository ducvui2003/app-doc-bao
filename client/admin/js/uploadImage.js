// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCK0r62F9tSew-GFBq271thR7yOg8H1iLM",
    authDomain: "do-da-dung.firebaseapp.com",
    projectId: "do-da-dung",
    storageBucket: "do-da-dung.appspot.com",
    messagingSenderId: "10879990896",
    appId: "1:10879990896:web:ff696da2ec9162e58288b5",
    measurementId: "G-M7FXYKMM8D"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);
console.log(storage);

export default function uploadImage(file) {
 // Create a storage reference
    const storageRef = ref(storage, 'images/' + file.name);
console.log(storageRef);
    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Update progress bar
    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },
        (error) => {
            // Handle unsuccessful uploads
            console.error(error);
        },
        () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                // You can use this downloadURL to display the image or store it in your database
            });
        }
    );
}