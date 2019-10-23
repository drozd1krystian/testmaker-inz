import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Test } from '../models/test';

@Injectable({
  providedIn: 'root'
})
export class TestItemService {

  testsCollection: AngularFirestoreCollection<Test>;
  tests: Observable<any>;

  constructor( private firestore: AngularFirestore) {
    this.tests = this.firestore.collection('Tests').snapshotChanges();
   }

  getTests(){
    return this.tests;
  }
}
