import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { AddTestComponent } from './add-test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { TestItemService } from 'src/app/services/test-item.service';

//Mock the HTMLInputElement so that we can send a mock file during testing, here it goes.
class MockHTMLInput {  
  files: Array<File>;  
  constructor() {  
    this.files = new Array<File>();  
    let content = "Hello World";  
    let data = new Blob([content], { type: 'text/plain' });  
    let arrayOfBlob = new Array<Blob>();  
    arrayOfBlob.push(data);  
    let file = new File(arrayOfBlob, "Mock.txt");  
    this.files.push(file);  
  }  
}  

describe('AddTestComponent', () => {
  let component: AddTestComponent;
  let fixture: ComponentFixture<AddTestComponent>;  
  let mockFileInput: HTMLInputElement;  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTestComponent ],
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
        {provide: HTMLInputElement, useClass: MockHTMLInput}
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject([  
    HTMLInputElement  
  ],  
     (mockHtmlInputElement:HTMLInputElement) => {
    fixture = TestBed.createComponent(AddTestComponent);
    component = fixture.componentInstance;

    mockFileInput=mockHtmlInputElement  
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the loadQuestions successfully', () => {
    component.loadQuestions(mockFileInput);
    expect(component.errorReadingFile).toBe(false);
  });

  
});
