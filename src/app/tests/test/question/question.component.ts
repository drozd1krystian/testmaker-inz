import { Component, OnInit, Input } from '@angular/core';
import { TestItemService } from 'src/app/services/test-item.service';

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
  // Edit question state
  editState = false;
  goodAnswers = true;
  answersSubstring = ['A.','B.','C.','D.'];
  showError = false;
  editQuestion: string;
  editAnswers: String[];
  editCorrect: string;

  // Something changed in question?
  changed = false;

  constructor(private testService: TestItemService) { }

  ngOnInit() {
    //this.question = this.question.replace(/[.*+?^${}()|[\]\\]n/g, '\n'); 
   // this.answers.forEach(el => el.replace(/[.*+?^${}()|[\]\\]n/g, '\n'))

    this.editQuestion = this.question;
    this.editCorrect = this.correct;
    this.editAnswers = [...this.answers];

  }

  checkIfCorrect(answer) {
    return this.correct.includes(answer);
  }

  // Track id of answers items
  indexTracker(index: number, value: any) {
    return index;
  }

  toggleEditState() {
    this.editState = !this.editState;
    this.showError = false;

    //Reset the values in editState
    this.editQuestion = this.question;
    this.editAnswers = [...this.answers];
    this.editCorrect = this.correct;
  }

  // Submit change in question
  onSubmit() {

    this.checkAnswers();
    
    if(this.goodAnswers && (this.changed || this.question != this.editQuestion)) {
      let question = {
        question: this.editQuestion,
        correct: this.editCorrect,
        answers: this.editAnswers
      }
      this.testService.updateItem(this.testId, this.questionId, question);
      this.toggleEditState();
    }
    else if(this.changed) {
      this.showError = true;
      this.goodAnswers = true;
    }
  }

  showErrorBox() {
    this.showError = !this.showError;
  }

  // Check if answers starts with A. B. C. D. 
  checkAnswers() {
    this.editAnswers.forEach((el, index) => {
      let temp = el.slice(0,2);
      if(temp == this.answersSubstring[index]) {
      }
      else {
        this.goodAnswers = false;
      }

      if(el == this.answers[index]) {}
      else {
        this.changed = true;
      }
    })
  }


  deleteItem() {
    this.testService.deleteItem(this.testId, this.questionId);
  }
}
