import { Component, OnInit } from '@angular/core';
import { TestItemService } from '../../services/test-item.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  // Id from link
  doc_id: any;
  singleTest: any;
  questions: any[];

  group: string;
  // Show add question form:
  makePDF: boolean = false;
  show: boolean = false;

  wojtusie = [
    {id: '100441', imie: 'Krystian', nazwisko: 'Drozd'},
    {id: '100440', imie: 'Adrian', nazwisko: 'Bury'}
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
    })
  }

  toggleForm() {
    this.show == true ? this.show = false : this.show = true;
    this.testService.show.emit(this.show);
  }

  // Make PDF
  generatePdf() {
    this.makePDF = !this.makePDF;

    

  }
}
