import { Injectable, EventEmitter, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Test } from '../models/test';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TestItemService {

  // Show Add Form
  @Output() show: EventEmitter<any> = new EventEmitter();

  // Show error if test exist
  @Output() testExist: EventEmitter<any> = new EventEmitter();

  testsCollection: AngularFirestoreCollection<Test>;
  tests: Observable<any>;

  constructor( private firestore: AngularFirestore, private router: Router) {
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
    return this.firestore.collection('Tests').doc(doc_id).collection('Questions', ref => ref.orderBy('date')).snapshotChanges();
  }

  addItem(testId, question) {
    this.testsCollection.doc(testId).collection('Questions').add(question);
  }

  updateItem(testId, questionId, question){
    this.testsCollection.doc(testId).collection('Questions').doc(questionId).update(question);
  }

  deleteItem(testId, questionId) {
    this.testsCollection.doc(testId).collection('Questions').doc(questionId).delete();
  }

  addTest(testId: string, testCategory:string, questionList) {
    const testRef = this.firestore.collection('Tests').doc(testId);
    // Check if test exist
    testRef.get().subscribe(doc => {
      if(doc.exists) {
        this.testExist.emit(true);
      } else {
        this.firestore.collection('Tests').doc(testId).set({
          Category: testCategory.toUpperCase()
        });
        if(questionList.length > 0) {
          let batch = this.firestore.firestore.batch();
          questionList.forEach( (el,index) => {
            let id = this.firestore.createId();
            let questionsRef = this.firestore.collection('Tests').doc(testId.toUpperCase()).collection('Questions').doc(id).ref;
            batch.set(questionsRef, el);
          })
          batch.commit();
        }
        this.router.navigate(['/test', testId]);
      }
    })
  }
}
