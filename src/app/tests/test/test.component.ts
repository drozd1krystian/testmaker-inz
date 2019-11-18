import { Component, OnInit } from '@angular/core';
import { TestItemService } from '../../services/test-item.service';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../models/student'
import { FormBuilder, FormGroup } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Question }from '../../models/question';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {

  // Id from link
  doc_id: any;
  singleTest: any;
  questions: Question[];
  
  // Search group Form
  groupForm: FormGroup;
  groups: any[] = [];
  showDropDown: boolean = false;

  // Show add question form:
  makeTest: boolean = false;
  show: boolean = false;

  students : Student[] = [];

  answersTags: string[] = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.'];

  constructor(private testService: TestItemService, 
      private Activatedroute:ActivatedRoute, 
      private fb: FormBuilder) {

      //Read test id from router
      this.getIdFromRouter();

      this.initForm();    
   }

  ngOnInit() {
    // Get single tast data from firestore
    this.getSignleTestData();

    // Subscribe to event that emits if form should be displayed
    this.testService.show.subscribe(el => {
      this.show = el;
    })

    //Get questions from test
    this.getQuestions();

    // Get group names
    this.getGroups();

    window.addEventListener("popstate", function(e) {
        window.location.reload();
    });
  }

  //  Get Data From Service
  getIdFromRouter(){
    this.doc_id = this.Activatedroute.snapshot.paramMap.get("id");
  }
  getSignleTestData(){
    this.testService.getSingleTest(this.doc_id).subscribe(el => {
      this.singleTest =  el;
    });   
  }
  getGroups() {
    this.testService.getGroups().subscribe(gr => {
      this.groups = gr.map(test => {
        return {
          id: test.payload.doc.id,
        } 
      })
    })
  }
  getQuestions() {
    this.testService.getQuestions(this.doc_id).subscribe (arr => {
      this.questions = arr.map(q => {
        return {
          id: q.payload.doc.id,
          ...q.payload.doc.data()
        } as Question;
      })
    });
  }

  // Toggle Forms
  toggleForm() {
    this.show == true ? this.show = false : this.show = true;
    this.testService.show.emit(this.show);
  }

  toggleTest(){
    this.makeTest = !this.makeTest;
  }

  generateTest() {
    if(this.groups.some(el => el.id == this.getSearchValue())) {
      this.toggleTest();
      this.testService.getStudents(this.getSearchValue()).subscribe(arr => {
        this.students = arr.map(q => {
          return {
            index: q.payload.doc.id,
            ...q.payload.doc.data(),
          } as Student
        });
        // Deep copy and shuffle the questions Array then make QR for student
        this.students.forEach((el,index) => {
          let shuffledQuestions: Question[] = [];
          // 1. Deep copy questions
          let questionsCopy: Question[] = this.copyQuestions();
          // 2. Shuffle questions
          shuffledQuestions = this.shuffleArray(questionsCopy);
          // 3. Shuffle answers
          shuffledQuestions.forEach(el => el.answers = this.shuffleArray(el.answers));
          // 4. Change correct answer and tangs in answers
          this.changeAnswerTags(shuffledQuestions);
          // 5. Add shuffled questions to student
          this.students[index].questions = shuffledQuestions;
          // 5. Make QR code 
          this.students[index].qr = this.makeQR(el, shuffledQuestions);
        })
      })
      // Remove header, testname and form from DOM
       document.querySelector('header').remove();
       document.querySelector('.header').remove();
       document.querySelector('.card').remove();
    }
    else {
      this.makeTest = false;
    }
  }

  copyQuestions() {
    let questionsCopy:Question[] = [];
    // Deep copy questions array
    this.questions.forEach((el,index) => {
      questionsCopy[index]= Object.assign({}, el , JSON.parse(JSON.stringify(el)));
    });
    return questionsCopy;
  }

  changeAnswerTags(array: Question[]){
    array = array.map((el,index) => {
      // Find correct answer
      let correctId = el.answers.findIndex(ans => ans.includes(el.correct));
      el.answers = el.answers.map((ans,index) => {
        ans = ans.slice(2,ans.length)
        return `${this.answersTags[index]} ${ans}`;
      })
      el.correct = this.answersTags[correctId];
      el.question = `${index+1}. ${el.question}`
      return el;
    })
  }

  shuffleArray(array){
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  makeAnswersKey(questions: Question[]): String {
    return questions.map(el => el.correct.slice(0,1)).join('');
  }

  encryptTheKey(key) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(key), 'testmaker-inz').toString();
    } catch (e) {
      console.log(e);
    }
  }

  makeQR(stud, questions: Question[]) {
    let answerKey = this.makeAnswersKey(questions);
    return this.encryptTheKey(`${answerKey},${stud.index},${this.getSearchValue()},${stud.name},${stud.surname},${this.doc_id}`);
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
