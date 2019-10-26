import { Component, OnInit, Input } from '@angular/core';
import { TestItemService } from '../../services/test-item.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  @Input() testId;

  question = {
    question: '',
    answerA: '',
    answerB: '',
    answerC: '',
    answerD: '',
    correct: ''
  }
  constructor(private testService: TestItemService) { }

  ngOnInit() {}

  onSubmit() {
    if(this.question.question != '' && 
      (this.question.answerA != '' || 
      this.question.answerB != '' || 
      this.question.answerC != '' || 
      this.question.answerD != '') && this.question.correct.includes('.')) {
        const question = {
          question: this.question.question,
          answers: [
            `A. ${this.question.answerA}`, 
            `B. ${this.question.answerB}`, 
            `C. ${this.question.answerC}`, 
            `D. ${this.question.answerD}` 
          ],
          correct: this.question.correct

      }
      this.testService.addItem(this.testId, question);

      // Clear fields
      this.question.question = '';
      this.question.answerA = '';
      this.question.answerB = '';
      this.question.answerC = '';
      this.question.answerD = '';
      this.question.correct = '';
      
      // Hide Form
      this.hideForm();
    }
  }

  hideForm() {
    this.testService.show.emit(false);
  }
}
