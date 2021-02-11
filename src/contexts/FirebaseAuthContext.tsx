import React, { createContext, useEffect, useReducer, useRef } from 'react';
import type { FC, ReactNode } from 'react';
import type { User } from 'src/types/user';
import SplashScreen from 'src/components/SplashScreen';
import firebase from 'src/lib/firebase';
import db from 'firebase';

interface AuthState {
  isInitialised: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextValue extends AuthState {
  method: 'FirebaseAuth';
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type AuthStateChangedAction = {
  type: 'AUTH_STATE_CHANGED';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

// const getSellerId = async () => {
//   const query = db.firestore().collectionGroup('users').where('uid', '==', db.auth().currentUser.uid);

//   const snapshot = await query.get();

//   const ref = snapshot.docs.map((doc) => ({ ref: doc.ref, ...doc.data() }));

//   const seller = ref.pop().ref.parent.parent.id;

//   return seller;
// };

type Action = AuthStateChangedAction;

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
};

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'AUTH_STATE_CHANGED': {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user,
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext<AuthContextValue>({
  ...initialAuthState,
  method: 'FirebaseAuth',
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});
export default AuthContext;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  /*
    useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.
  */
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const loggedInUser = useRef(null);

  const signInWithEmailAndPassword = (email: string, password: string): Promise<any> => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const signInWithGoogle = (): Promise<any> => {
    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithPopup(provider);
  };

  const getSellerId = async () => {
    const query = db.firestore().collectionGroup('users').where('uid', '==', db.auth().currentUser.uid);

    const snapshot = await query.get();

    if (snapshot.docs.length) {
      const ref = snapshot.docs.map((doc) => ({ ref: doc.ref, ...doc.data() }));
      const sellerID = await ref.pop().ref.parent.parent.id;
      return sellerID;
    } else {
      return '';
    }
  };

  const getUserCapabilities = async () => {
    const query = db.firestore().collectionGroup('users').where('uid', '==', db.auth().currentUser.uid);

    const snapshot = await query.get();

    if (snapshot.docs.length) {
      const ref = snapshot.docs.map((doc) => ({ ref: doc.ref, ...doc.data() }));
      const capabilities = (await ref.pop().ref.get()).data()['capabilities'];
      return capabilities;
    } else {
      return [];
    }
  };

  const createUserWithEmailAndPassword = async (email: string, password: string): Promise<any> => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const logout = (): Promise<void> => {
    return firebase.auth().signOut();
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        // Here you should extract the complete user profile to make it available in your entire app.
        // The auth state only provides basic information.
        const sellerID = await getSellerId();
        const capabilities = await getUserCapabilities();
        // Dirty hack to prevent issue; adding a new user changes the active user to the new user
        // Probobly the SDK replaces user cookied behind the scenes
        if (loggedInUser.current) {
          firebase.auth().updateCurrentUser(loggedInUser.current);
          return;
        } else {
          // This will work in the first login
          loggedInUser.current = user;
        }

        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            isAuthenticated: true,
            user: {
              id: user.uid,
              avatar: user.photoURL,
              email: user.email,
              name: user.displayName || user.email,
              tier: 'Premium',
              seller: sellerID,
              capabilities: capabilities,
            },
          },
        });
      } else {
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    });

    return unsubscribe;
  }, [dispatch]);

  if (!state.isInitialised) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'FirebaseAuth',
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
