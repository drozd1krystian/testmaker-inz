import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsComponent } from './students.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { SearchFilterPipe } from '../shared/filter-pipe';
import { StudentComponent } from './student/student.component';
import { GradeComponent } from './student/grade/grade.component';
import { TestItemService } from '../services/test-item.service';

describe('StudentsComponent', () => {
  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentsComponent, SearchFilterPipe, StudentComponent, GradeComponent ],
      imports: [
        FormsModule, 
        ReactiveFormsModule, 
        RouterTestingModule, 
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireDatabaseModule,
      ],
      providers: [
        TestItemService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#indexExistError() should set indexExist to empty string ', () => {
    component.indexExist = 'something';
    component.indexExistError()
    expect(component.indexExist).toBe('');
  });

  
});
