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

  // Return if added students
  @Output() addedStud: EventEmitter<any> = new EventEmitter();

  // Student index already exist
  @Output() indexExist: EventEmitter<any> = new EventEmitter();

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

  getStudents(gr: string) {
    return this.firestore.collection('Students').doc(gr).collection('students').snapshotChanges();
  }
  
  getStudentGrades(studId, gr) {
    return this.firestore.collection('Students').doc(gr).collection('students').doc(studId).collection('grades').snapshotChanges();
  }

  getGroups() {
    return this.firestore.collection('Students').snapshotChanges();
  }

  addItem(testId, question) {
    this.testsCollection.doc(testId).collection('Questions').add(question);
  }

  addTest(testId: string, testCategory:string, questionList) {
    testId = testId.toUpperCase();
    const testRef = this.firestore.collection('Tests').doc(testId);
    // Check if test exist
    testRef.get().subscribe(doc => {
      if(doc.exists) {
        this.testExist.emit(true);
      } else {
        this.firestore.collection('Tests').doc(testId).set({
          Category: testCategory.toUpperCase()
        });
        if(questionList.length > 1) {
          let batch = this.firestore.firestore.batch();
          questionList.forEach( (el,index) => {
            let id = this.firestore.createId();
            let questionsRef = this.firestore.collection('Tests').doc(testId).collection('Questions').doc(id).ref;
            batch.set(questionsRef, el);
          })
          batch.commit();
        }
        this.router.navigate(['/test', testId]);
      }
    })
  }
  async addStudents(studArr, indexesArr, groupName) {
    const docRef = this.firestore.collection('Students').doc(groupName);
    let checker = true;
    let count = 0;
    await docRef.get().toPromise().then( async doc => {
      if(doc.exists){  
         await studArr.forEach(async (el,index) => {  
          let StudDoc = docRef.collection('students').doc(indexesArr[index]);
          await StudDoc.get().toPromise().then(doc => {
            // Loop somehow gets skipped at first
            count += 1;
             if (doc.exists) {
               this.indexExist.emit(indexesArr[index]);
               checker = false;
               return;
             }
             else if (checker) {
               docRef.collection('students').doc(indexesArr[index]).set(el);
             }
           })
          if(!checker) {
            return;
          }
        })
        if(!checker){
          return;
        }
        else if (count > 0 && checker){
          this.indexExist.emit('true');
        }
      }
      else{
      docRef.set({name:groupName}).then(() => {
         // If at least one document exist return
      let checker = true;
      studArr.forEach(  (el,index) => {  
        let StudDoc = docRef.collection('students').doc(indexesArr[index]);
        StudDoc.get().subscribe(doc => {
          if(doc.exists){
            this.indexExist.emit(indexesArr[index]);
            checker = false;
            return;
          }
          else if(checker) {
            docRef.collection('students').doc(indexesArr[index]).set(el);
          }
        })
        if(!checker) {
          return;
        }
        else {
          this.indexExist.emit('true');
        }
      })
      })
    }
    })
  }

  updateItem(testId, questionId, question){
    this.testsCollection.doc(testId).collection('Questions').doc(questionId).update(question);
  }

  updateGrade(group, studId, gradeId, grade) {
    this.firestore.collection('Students').doc(group).collection('students').doc(studId).collection('grades').doc(gradeId).update(grade)
  }

  deleteItem(testId, questionId) {
    this.testsCollection.doc(testId).collection('Questions').doc(questionId).delete();
  }

}
