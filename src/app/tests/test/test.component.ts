import { Component, OnInit } from '@angular/core';
import { TestItemService } from '../../services/test-item.service';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../models/student'
import { FormBuilder, FormGroup } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {

  // Id from link
  doc_id: any;
  singleTest: any;
  questions: any[];
  correctAnswers: any[] = [];
  

  // Search group Form
  groupForm: FormGroup;
  groups: any[] = [];
  showDropDown: boolean = false;

  // Show add question form:
  makePDF: boolean = false;
  show: boolean = false;

  students : Student[] = [];
  
  constructor(private testService: TestItemService, 
      private _Activatedroute:ActivatedRoute, 
      private fb: FormBuilder) {

      //Read test id from router
      this.doc_id = this._Activatedroute.snapshot.paramMap.get("id");
      this.initForm();    
   }

  ngOnInit() {
    // Get single tast data from firestore
    this.testService.getSingleTest(this.doc_id).subscribe(el => {
      this.singleTest =  el;
    });   

    // Subscribe to event that emits if form should be displayed
    this.testService.show.subscribe(el => {
      this.show = el;
    })

    //Get questions from test
    this.testService.getQuestions(this.doc_id).subscribe (arr => {
      this.questions = arr.map(q => {
        return {
          id: q.payload.doc.id,
          ...q.payload.doc.data()
        }
      })
      // Add question number and push correct answer to array
      this.questions.forEach((el,index) => {
        this.questions[index].question = `${index + 1}. ${el.question}`;
        this.correctAnswers[index] = this.questions[index].correct;
      })
    })

    // Get group names
    this.testService.getGroups().subscribe(gr => {
      this.groups = gr.map(test => {
        return {
          id: test.payload.doc.id,
        } 
      })
    })
  }

  toggleForm() {
    this.show == true ? this.show = false : this.show = true;
    this.testService.show.emit(this.show);
  }

  togglePdf(){
    this.makePDF = !this.makePDF;
  }

  generatePdf() {
    if(this.groups.some(el => el.id == this.getSearchValue())) {
      this.togglePdf()
      this.testService.getStudents(this.getSearchValue()).subscribe(arr => {
        this.students = arr.map(q => {
          return {
            index: q.payload.doc.id,
            ...q.payload.doc.data(),
          } as Student
        })
        this.students.forEach((el,index) => {
          this.students[index].qr = this.makeQR(el);
        })
      })
    }
    else {
      this.makePDF = false;
    }
  }

  makeAnswersKey(): String {
    let correctStr = '';
    let temp = ''
    this.correctAnswers.forEach(el => {
      temp = el.slice(0,1);
      correctStr += temp;
    }) 
    return correctStr;
  }

  encryptTheKey(key) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(key), 'karakan123').toString();
    } catch (e) {
      console.log(e);
    }
  }

  makeQR(stud) {
    let answerKey = this.makeAnswersKey();
    return this.encryptTheKey(`${answerKey},${stud.index},${this.getSearchValue()},${stud.name},${stud.surname},${this.doc_id}`);
  }

  // Removes the last two page breaks - after the last student
  removeBreak(){
    let elem = document.querySelectorAll('.page-break');
    if(elem.length > 2){
      elem[elem.length - 1 ].remove();
      elem[elem.length - 2 ].remove();
    }
  }
  

  // Search bar 
  initForm(): FormGroup {
    return this.groupForm = this.fb.group({
      search: [null]
    })
  }

  openDropDown() {
    this.showDropDown ? this.showDropDown = false : this.showDropDown = true; 
  }

  closeDropDown(){
    this.showDropDown = false;
  }

  getSearchValue(){
    return this.groupForm.value.search;
  }

  selectValue(value) {
    this.groupForm.patchValue({"search": value});
    this.showDropDown = false;
  }
}
