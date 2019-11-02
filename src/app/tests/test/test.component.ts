import { Component, OnInit } from '@angular/core';
import { TestItemService } from '../../services/test-item.service';
import { ActivatedRoute } from '@angular/router';

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

  yearbook: string;
  group: string;

  // Show add question form:
  makePDF: boolean = false;
  show: boolean = false;

  wojtusie = [
    {id: '100441', imie: 'Krystian', nazwisko: 'Drozd', grupa: '2019/AI/1', qr: ''},
    {id: '100440', imie: 'Adrian', nazwisko: 'Bury', grupa: '2019/AI/2', qr: ''}
  ]
  
  constructor(private testService: TestItemService, private _Activatedroute:ActivatedRoute) {
      //Read test id from router
      this.doc_id = this._Activatedroute.snapshot.paramMap.get("id");    
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
      this.questions.forEach((el,index) => {
        this.questions[index].question = `${index + 1}. ${el.question}`;
        this.correctAnswers[index] = this.questions[index].correct;
      })
    })
  }

  toggleForm() {
    this.show == true ? this.show = false : this.show = true;
    this.testService.show.emit(this.show);
  }

  generatePdf() {
    this.makePDF = !this.makePDF;
    this.wojtusie.forEach((el,index) => {
      this.wojtusie[index].qr = this.makeQR(el);
    })
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
    return this.encryptTheKey(`${answerKey},${stud.id},${stud.grupa},${stud.imie},${stud.nazwisko}`);
  }

  removeBreak(){
    let elem = document.querySelectorAll('.page-break');
    if(elem.length > 2){
      elem[elem.length - 1 ].remove();
      elem[elem.length - 2 ].remove();
    }
  }
  
}
