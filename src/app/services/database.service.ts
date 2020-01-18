import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore,
              private storage: AngularFireStorage) {
  }

  /**
   * Return an observable for the "photos" collection changes
   */
  getImageListObservable(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('photos').snapshotChanges();
  }

  /**
   * Upload a base64 image to Firebase Storage
   */
  uploadImage(base64Image: string) {
    // TODO uploadImage
  }

}
