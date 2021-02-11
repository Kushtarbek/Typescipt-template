import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// export const getCurrentUser = functions.https.onRequest((req, res) => {
//   admin
//     .firestore()
//     .doc('seller/1ENPZ4b79bsXcZ98Ms94/users/Ow4eNSPTPgqm3pFyXWLw')
//     .get()

//     .then((snapshot) => {
//       const data = snapshot.data();
//       res.send(data);
//     })

//     .catch((error) => {
//       // console.log(error);
//       res.status(500).send(error);
//     });
// });

export const deleteUser = functions.https.onRequest(async (req, res) => {
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST,GET,OPTIONS, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  }

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST,GET,OPTIONS, PUT, DELETE');
  res.set(
    'Access-Control-Allow-Headers',
    'Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization',
  );

  const uid = req.body.uid;

  admin
    .auth()
    .getUser(uid)
    .then((userRecord) => {
      const UserID = userRecord.uid;

      return admin
        .auth()
        .deleteUser(UserID)
        .then(() => {
          // console.log("Successfully delete user.");
          res.status(200).send('Deleted User');
          return;
        });
    })
    .catch((err) => {
      // console.log("Error fetching user data :", err);
      res.status(500).send('Failed');
    });
});

export const getInventory = functions.https.onRequest((request, response) => {
  const promise = admin.firestore().doc('inventory/02hNw5sR24epbTT51qlz').get();
  const p2 = promise.then((snapshot) => {
    const data = snapshot.data();
    response.send(data);
  });

  p2.catch((error) => {
    // console.log(error);
    response.status(500).send(error);
  });
});
