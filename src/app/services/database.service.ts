import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) {
  }

  getImageListObservable(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('photos').snapshotChanges();
  }

}
