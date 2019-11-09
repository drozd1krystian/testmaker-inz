import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionComponent } from './add-question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';

describe('AddQuestionComponent', () => {
  let component: AddQuestionComponent;
  let fixture: ComponentFixture<AddQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddQuestionComponent ],
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
    fixture = TestBed.createComponent(AddQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#addAnswer() should add answer to form', () => {
    expect(component.answers.length).toBe(1, 'Should only have 1 answer at init');
    component.addAnswer();
    expect(component.answers.length).toBe(2,'Should add empty answer to form');
  });

  it('#deleteAnswer(index) should remove answer at index', () => {
    expect(component.answers.length).toBe(1, 'Should only have 1 answer at init');
    component.deleteAnswer(0);
    expect(component.answers.length).toBe(0, 'Should be empty array');
  });

  it('#onSubmit() should check if correct answer has good key', () => {
    expect(component.answers.length).toBe(1, 'Should only have 1 answer at init');
    component.addAnswer()
    component.addAnswer()
    component.addAnswer()

    component.answers.controls[0].get('answer').setValue('4')
    component.answers.controls[1].get('answer').setValue('3')
    component.answers.controls[2].get('answer').setValue('2')
    component.answers.controls[3].get('answer').setValue('1')

    component.question.setValue('How much is 2+2');
    component.correct.setValue('H');
    component.onSubmit();
    expect(component.wrongCorrect).toBe(true, 'Tag is wrong')
  });

  
  it('#onSubmit() should set #emptyAnswer to true if at least one is empty', () => {
    expect(component.answers.length).toBe(1, 'Should only have 1 answer at init');
    component.addAnswer()
    component.addAnswer()
    component.addAnswer()

    component.answers.controls[0].get('answer').setValue('4')
    component.answers.controls[1].get('answer').setValue('')
    component.answers.controls[2].get('answer').setValue('2')
    component.answers.controls[3].get('answer').setValue('1')

    component.question.setValue('How much is 2+2');
    component.correct.setValue('H');
    component.onSubmit();
    expect(component.emptyAnswer).toBe(true, 'At least one answer is empty')
  });

  it('#onSubmit() should check if there are no asnwers', () => {
    expect(component.answers.length).toBe(1, 'Should only have 1 answer at init');
    component.deleteAnswer(0);

    component.question.setValue('How much is 2+2');
    component.correct.setValue('H');
    component.onSubmit();
    expect(component.noAnswers).toBe(true, 'No answers')
  });

  it('#onSubmit() should check if question is empty', () => {
    expect(component.answers.length).toBe(1, 'Should only have 1 answer at init');
    component.deleteAnswer(0);

    component.question.setValue('');
    component.correct.setValue('H');
    component.onSubmit();
    expect(component.emptyQuestion).toBe(true, 'Empty question')
  });



});
