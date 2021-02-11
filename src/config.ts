export const auth0Config = {
  client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
};
// export const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
// };
let config;
if (process.env.NODE_ENV === 'production') {
  config = {
    apiKey: 'AIzaSyAN3ZEgRRYilncaahYcAkNkfvZc6SDaEi0',
    authDomain: 'quickstart-1555372559429.firebaseapp.com',
    databaseURL: 'https://quickstart-1555372559429.firebaseio.com',
    projectId: 'quickstart-1555372559429',
    storageBucket: 'quickstart-1555372559429.appspot.com',
    messagingSenderId: '521556099226',
    appId: '1:521556099226:web:1eae4fc8dfbb61a45b5f23',
    measurementId: 'G-YW1EFVKDWC',
  };
} else {
  // This is staging
  config = {
    apiKey: 'AIzaSyCHU1jZgzVfp_kM5AO0Yyzq49Z2sL0oGwQ',
    authDomain: 'jebwa-apps-staging.firebaseapp.com',
    databaseURL: 'https://jebwa-apps-staging.firebaseio.com',
    projectId: 'jebwa-apps-staging',
    storageBucket: 'jebwa-apps-staging.appspot.com',
    messagingSenderId: '18467115427',
    appId: '1:18467115427:web:598c82eab83c759d11ca16',
    measurementId: 'G-NBTKH92FSP',
  };
}

//  This is  production config for firestore

// let config;

//   config = {
//     apiKey: 'AIzaSyDysFEsJDDPgejg4hWRaa-7eAnNRDuy_sg',
//     authDomain: 'dev.hoptub.com',
//     databaseURL: 'https://jebwa-apps-staging.firebaseio.com',
//     projectId: 'jebwa-apps-staging',
//     storageBucket: 'jebwa-apps-staging.appspot.com',
//     messagingSenderId: '18467115427',
//     appId: '1:18467115427:web:598c82eab83c759d11ca16',
//     measurementId: 'G-NBTKH92FSP',
//   };
export const firebaseConfig = config;
