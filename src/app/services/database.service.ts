import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  FIREBASE_STORAGE_VISION_ROOT_URL = 'gs://squaads-vision';

  constructor(private firestore: AngularFirestore,
              private fireStorage: AngularFireStorage) {
  }

  /**
   * Return an observable for the "photos" collection changes.
   */
  getImageListObservable(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('photos').snapshotChanges();
  }

  /**
   * Upload a base64 image to Firebase Storage with a random generated ID.
   */
  uploadImage(base64Image: string) {
    const newID = this.firestore.createId();
    this.fireStorage.storage.refFromURL(this.FIREBASE_STORAGE_VISION_ROOT_URL)
      .child(newID)
      .putString(base64Image, 'data_url');
  }

}
