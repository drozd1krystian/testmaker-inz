import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  // Question inputs 
  @Input() testId;
  @Input() questionId;
  @Input() correct: string;
  @Input() question: string;
  @Input() answers: String[];
  @Input() qNr;

  // Variables
  edit = true;

  constructor() { }

  ngOnInit() {
    this.question = this.question.replace(/[.*+?^${}()|[\]\\]n/g, '\n'); 
    this.answers.forEach(el => el.replace(/[.*+?^${}()|[\]\\]n/g, '\n'))
  }

  checkIfCorrect(answer) {
    return this.correct.includes(answer);
  }
}
