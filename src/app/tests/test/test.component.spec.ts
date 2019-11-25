import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestComponent } from './test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { TestItemService } from 'src/app/services/test-item.service';
import { SearchFilterPipe } from 'src/app/shared/filter-pipe';
import { QRCodeModule } from 'angular2-qrcode';
import { Question } from 'src/app/models/question';
import * as CryptoJS from 'crypto-js';
import { Student } from 'src/app/models/student';
import { QuestionComponent } from './question/question.component';
import { AddQuestionComponent } from 'src/app/components/add-question/add-question.component';


describe('TestComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let questions: Question[] = [];
  let student: Student;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        TestComponent,
         QuestionComponent,
         AddQuestionComponent, 
         SearchFilterPipe
        ],
      imports: [
        FormsModule, 
        ReactiveFormsModule, 
        RouterTestingModule, 
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireDatabaseModule,
        QRCodeModule
      ],
      providers: [
       TestItemService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    questions = [
      {
        question: 'Ile to 2+2',
        answers: [
          'A. 2', 'B. 4', 'C. 3'
        ],
        correct: 'B.',
        date: new Date()
      },
      {
        question: 'Ile to 2+3',
        answers: [
          'A. 2', 'B. 4', 'C. 5'
        ],
        correct: 'C.',
        date: new Date()
      }
    ];
    student = {
      index: '100',
      name: 'Jan',
      surname: 'Kowalski' 
    }
  });


  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component, 'getGroups');
    component.getGroups();
    expect(component.getGroups).toHaveBeenCalled();

    spyOn(component, 'getSignleTestData');
    component.getSignleTestData();
    expect(component.getSignleTestData).toHaveBeenCalled();

    spyOn(component, 'getQuestions');
    component.getQuestions();
    expect(component.getQuestions).toHaveBeenCalled();
  });

  it('#openDropDown() should toggle #showDropDown', () => {
    let component = fixture.componentInstance;
    expect(component.showDropDown).toBe(false, 'Dont show dropdown at start');
    component.openDropDown();
    expect(component.showDropDown).toBe(true, 'Show dropdown after clicking on it');
    component.openDropDown();
    expect(component.showDropDown).toBe(false, 'Hide after second click on dropdown');
  });

  it('#closeDropDown() should set to false #showDropDown', () => {
    let component = fixture.componentInstance;
    expect(component.showDropDown).toBe(false, 'Dont show dropdown at start');
    component.openDropDown();
    expect(component.showDropDown).toBe(true, 'Show dropdown after clicking on it');
    component.closeDropDown();
    expect(component.showDropDown).toBe(false, 'Hide after clicking outside of it');
  });

  it('#changeAnswerTags() should change tag in answer', () => {
    let component = fixture.componentInstance;
    let array: Question[] = [
      {
        question: 'Ile to 2+2',
        answers: [
          'C.2', 'C.4', 'B.3'
        ],
        correct: 'B.',
        date: new Date()
      }
    ];

    let correctArr: Question[] = [{
      question: 'Ile to 2+2',
      answers: [
        'A. 2', 'B. 4', 'C. 3'
      ],
      correct: 'B.',
      date: new Date()
    }];

    component.changeAnswerTags(array);
    expect(array[0].answers.join('')).toBe(correctArr[0].answers.join(''), 
      'Change tags in answers to match A., B. etc.');
  });
 
  it('#makeQR(stud, question[]: Question) should encrypt the string that contains: answerKey, group name, student name, surname, test name ', () => {
    let component = fixture.componentInstance;
    let groupName = '2019-js-lab3'
    let testName = 'KOLOKWIUM 1'

    component.doc_id = testName;
    component.groupForm.value.search = groupName;
    let encryptedString = component.makeQR(student, questions);
    const cryptkey = 'testmaker-inz'
    let decrypted = CryptoJS.AES.decrypt(encryptedString, cryptkey).toString(CryptoJS.enc.Utf8);

    expect(decrypted).toBe(`"BC,100,${groupName},${student.name},${student.surname},${testName}"`, 
      'Check if encryption works correct');
  });

  it('#makeAnswerKey() should make key from questions array eg. AABDC', () => {
    let component = fixture.componentInstance;
    let key = component.makeAnswersKey(questions);
    expect(key).toBe('BC', 'Should match BC');
  });

  it('#getSearchValue() should get value from form', () => {
    let component = fixture.componentInstance;
    let searchValue = 'Test1'

    component.groupForm.value.search = searchValue;
    let getValue = component.getSearchValue();

    expect(getValue).toBe(searchValue, 
      'Match the value ');
  });
});
