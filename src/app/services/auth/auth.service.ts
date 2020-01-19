import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

/**
 *  Provides authentication with Firebase Auth.
 */
export class AuthService {

  constructor(private fireAuth: AngularFireAuth,
              private firestore: AngularFirestore) {
  }

  /**
   *  Login with Firebase Auth.
   */
  loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  /**
   *  Create user in Firebase Auth.
   */
  registerUser(email: string, password: string) {
    return this.fireAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((newUserCredential: firebase.auth.UserCredential) => {
        const data = {
          userID: newUserCredential.user.uid,
          email
        };
        this.firestore.collection('users').add(data);
      });
  }

  /**
   *  Logout from Firebase Auth.
   */
  logoutUser(): Promise<void> {
    return this.fireAuth.auth.signOut();
  }
}
