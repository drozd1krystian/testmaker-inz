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

  constructor(private testService: TestItemService) { }

  ngOnInit() {
    this.question = this.question.replace(/[.*+?^${}()|[\]\\]n/g, '\n'); 
    this.answers.forEach(el => el.replace(/[.*+?^${}()|[\]\\]n/g, '\n'))
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
  }

  // Submit change in question
  onSubmit() {

    this.checkAnswers();
    
    if(this.goodAnswers) {
      let question = {
        question: this.question,
        correct: this.correct,
        answers: this.answers
      }
      this.testService.updateItem(this.testId, this.questionId, question);
      this.toggleEditState();
    }
    else {
      this.showError = true;
      this.goodAnswers = true;
    }
  }

  showErrorBox() {
    this.showError = !this.showError;
  }

  checkAnswers() {
    this.answers.forEach(el => {
      if(this.answersSubstring.some(substring => el.includes(substring))) {
      }
      else {
        this.goodAnswers = false;
      }
    })
  }
}
