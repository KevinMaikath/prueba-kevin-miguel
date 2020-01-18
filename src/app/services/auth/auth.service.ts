import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth,
              private firestore: AngularFirestore) {
  }

  loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  registerUser(email: string, password: string) {
    return this.fireAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((newUserCredential: firebase.auth.UserCredential) => {
        const data = {
          userID: newUserCredential.user.uid,
          email
        };
        this.firestore.collection('users')
          .add(data)
          .then(() => {
            console.log('Successfully registered');
          });
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  logoutUser(): Promise<void> {
    return this.fireAuth.auth.signOut();
  }
}
