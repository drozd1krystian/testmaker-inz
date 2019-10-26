import { Injectable, EventEmitter, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Test } from '../models/test';

@Injectable({
  providedIn: 'root'
})
export class TestItemService {

  // Show Add Form
  @Output() show: EventEmitter<any> = new EventEmitter();

  testsCollection: AngularFirestoreCollection<Test>;
  tests: Observable<any>;

  constructor( private firestore: AngularFirestore) {
    this.testsCollection = this.firestore.collection('Tests');

    this.tests = this.testsCollection.snapshotChanges();
   }

  getTests(){
    return this.tests;
  }

  getSingleTest(doc_id){
    return this.firestore.collection('Tests').doc(doc_id).valueChanges();
  }

  getQuestions(doc_id) {
    return this.firestore.collection('Tests').doc(doc_id).collection('Questions').snapshotChanges();
  }

  addItem(testId, question) {
    console.log(testId, question)
    this.testsCollection.doc(testId).collection('Questions').add(question);
  }

  
}
