import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsComponent } from './tests.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SearchFilterPipe } from '../shared/filter-pipe';
import { TestItemService } from '../services/test-item.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('TestsComponent', () => {
  let component: TestsComponent;
  let fixture: ComponentFixture<TestsComponent>;
  let fakeTestService: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestsComponent, SearchFilterPipe ],
      imports: [
        FormsModule, 
        ReactiveFormsModule, 
        RouterTestingModule, 
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireDatabaseModule,
      ],
      providers: [
        TestItemService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsComponent);
    component = fixture.componentInstance;
    component.tests = [
      {id: "KOLOKWIUM 1", Category:"Aplikacje Internetowe"},
      {id: "KOLOKWIUM 2", Category:"Jezyk skryptowy"}
    ];
    fixture.detectChanges();

    fakeTestService =  {
      getTests: () => {
        return of([{
          payload: {
            doc: {
              id: '1',
              data: () => ({id: "KOLOKWIUM 1", Category:"Aplikacje Internetowe"})
            }
          }
        }],);
      }
    }
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the tests property when initialized', () => {
    let fb: FormBuilder = new FormBuilder();
    component = new TestsComponent(fakeTestService, fb);
    component.ngOnInit();
    expect(component.tests[0].id).toBe('KOLOKWIUM 1');
  });

  it('should show drop down', () => {
    let fb: FormBuilder = new FormBuilder();
    component = new TestsComponent(fakeTestService, fb);
    component.ngOnInit();
    component.testForm.setValue({search: 'something'});
    expect(component.showDropDown).toBe(true);
  });

  it('#openDropDown() should toggle #showDropDown', () => {
    let component = fixture.componentInstance;
    expect(component.showDropDown).toBe(false, 'Dont show dropdown at start');
    component.openDropDown();
    expect(component.showDropDown).toBe(true, 'Show dropdown after clicking on it');
    component.openDropDown();
    expect(component.showDropDown).toBe(false, 'Hide after second click on dropdown');
  });
  

  // Integration tests 
  it('should have 2 tests', () => {
    const tests = fixture.debugElement.queryAll(By.css('.collection'));
    expect(tests.length).toEqual(2);
  });

  it('should have id in the list', () => {
    const tests = fixture.debugElement.queryAll(By.css('.collection'));
    const title = tests[0].queryAll(By.css('.id-label'));
    expect(title[0].nativeElement.textContent).toEqual('KOLOKWIUM 1');
  });

});
