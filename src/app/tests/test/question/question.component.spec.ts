import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionComponent } from './question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionComponent ],
      imports: [
        FormsModule, 
        ReactiveFormsModule, 
        RouterTestingModule, 
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireDatabaseModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#checkIfCorrect check if answer is correct', () => {
    component.correct = 'A.'
    let answer = 'B.'
    let check = component.checkIfCorrect(answer);
    expect(check).toBe(false, 'Answer should not be correct')
    answer = 'A.'
    check = component.checkIfCorrect(answer);
    expect(check).toBe(true, 'Answer should be true')
  });

  it('#toggleEditState should toggle question edit state and reset edit values', () => {
    component.question = 'How much is 2 + 2'
    component.correct = 'A.'
    component.answers = ['A.4', 'B.3', 'C.1']

    expect(component.editState).toBe(false,'Should be false at start')
    component.toggleEditState();
    expect(component.editState).toBe(true, 'Should open edit state')
    component.toggleEditState();
    expect(component.editState).toBe(false,'Should close edit state')
    expect(component.editCorrect).toBe(component.correct, 'Reset edit correct value')
    expect(component.editQuestion).toBe(component.question, 'Reset edit question value')
    expect(component.editAnswers[0]).toBe(component.answers[0], 'Reset edit answers value')
  });

  it('#checkAnswers should check if answers starts with A., B. etc.', () => {
    component.editAnswers = ['A.4', 'B.3', 'C.1'];

    component.checkAnswers();
    expect(component.goodAnswers).toBe(true, 'Answers have good tags')
    
    component.editAnswers = ['C.','B.','A.'];
    component.checkAnswers();
    expect(component.goodAnswers).toBe(false, 'Wrong tags order');
  });
  
  it('#checkAnswers should check if at least one answer got edited', () => {
    component.answers = ['A.4', 'B.3', 'C.1'];
    component.editAnswers = ['A.5', 'B.4','C.3']
    component.checkAnswers();
    expect(component.changed).toBe(true, 'At least one answer got edited')
  });

  it('#checkAnswers should check no answers got edited', () => {
    component.answers = ['A.4', 'B.3', 'C.1'];
    component.editAnswers = ['A.4', 'B.3', 'C.1'];
    component.checkAnswers();
    expect(component.changed).toBe(false, 'No answer has been changed')
  });

  it('#indexTracker should return index that got passed as parameter', () => {
    let index = 5;
    let returnedValue = component.indexTracker(index, '');
    expect(returnedValue).toBe(index);
  });
});
