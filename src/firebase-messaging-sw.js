importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);

var firebaseConfigDev = {
  apiKey: "AIzaSyBST3d1ioyZ973Bt7JMNPdaTJPBdZHa2AI",
  authDomain: "speedyy-vendor-dev.firebaseapp.com",
  projectId: "speedyy-vendor-dev",
  storageBucket: "speedyy-vendor-dev.appspot.com",
  messagingSenderId: "960284905767",
  appId: "1:960284905767:web:c15aa8018a1d37eafdd902",
  measurementId: "G-ME73PCS3CS"
};
var firebaseConfigStaging = {
  apiKey: "AIzaSyAIiQqzmXTeeWQfE-caSMcTRz5aNwSGKDY",
  authDomain: "speedyy-vendor-staging.firebaseapp.com",
  projectId: "speedyy-vendor-staging",
  storageBucket: "speedyy-vendor-staging.appspot.com",
  messagingSenderId: "383920072911",
  appId: "1:383920072911:web:4fd0766803475f98ba6fba",
  measurementId: "G-355NSLVYTQ"
};
var firebaseConfigProd = {
  apiKey: "AIzaSyCDQOdZVoIpbY0-OBOWMW4fwIErb6DXqtI",
  authDomain: "speedyy-vendor-prod.firebaseapp.com",
  projectId: "speedyy-vendor-prod",
  storageBucket: "speedyy-vendor-prod.appspot.com",
  messagingSenderId: "1079682450491",
  appId: "1:1079682450491:web:098fe7db740e158240881e",
  measurementId: "G-RSF9DCNDTE"
};

const isProd = location.hostname.includes("vendor.speedyy.com");
const isStaging = location.hostname.includes("vendor.staging.speedyy.com");

// Initialize Firebase

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
if(isProd){
  firebase.initializeApp(firebaseConfigProd);
}
else if(isStaging){
  firebase.initializeApp(firebaseConfigStaging);
}
else{
  firebase.initializeApp(firebaseConfigDev);
}
// firebase.initializeApp(isProd ? firebaseConfigProd : firebaseConfigDev);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Customize notification here
  console.log('Received bg notification', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(
    clients.matchAll({ includeUncontrolled: true }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (const client of windowClients) {
        // If so, just focus it.
        if (client.url.includes(location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(location.origin);
      }
    })
  );
});

