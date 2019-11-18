import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeComponent } from './grade.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { QRCodeModule } from 'angular2-qrcode';
import { TestItemService } from 'src/app/services/test-item.service';
import { DatePipe } from '@angular/common';
import { Grade } from 'src/app/models/student';

// Needed to set time for DatePipe
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/Pl';
import {LOCALE_ID } from '@angular/core';
registerLocaleData(localePl);

describe('GradeComponent', () => {
  let component: GradeComponent;
  let fixture: ComponentFixture<GradeComponent>;
  let grade: Grade = {
    id: '1',
    grade: '4',
    name: 'Kolokwium 1',
    points: '27/40',
    date: new Date('2019-11-07').toString()
  }
  let fakeTestService: any;
  let datepipe: DatePipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeComponent],
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
       TestItemService, DatePipe, 
       { provide: LOCALE_ID, useValue: 'pl-PL'},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeComponent);
    component = fixture.componentInstance;
    component.grade = grade;
    fixture.detectChanges();

    fakeTestService =  {
      updateGrade(group, student, grade_id, grade) {}
    }
    datepipe = new DatePipe('pl-PL')
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change date format', () => {
    component = new GradeComponent(fakeTestService, datepipe)
    component.grade = grade;
    component.grade.date = '2019-05-14:12:12:12';
    component.editGrade();
    expect(grade.date).toBe('2019-05-14');
  });
});

