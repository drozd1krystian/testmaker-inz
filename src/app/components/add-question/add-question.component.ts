import { Component, OnInit, Input } from '@angular/core';
import { TestItemService } from '../../services/test-item.service';
import { Question } from '../../models/question';
import {FormBuilder, FormGroup, FormArray, FormControl} from '@angular/forms';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  @Input() testId;

  answerTags = ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. ', 'H. '];

  questionForm: FormGroup;
  emptyAnswer: boolean = false;
  noAnswers: boolean = false;
  emptyQuestion: boolean = false;
  wrongCorrect: boolean = false;

  constructor(private testService: TestItemService, private fb: FormBuilder) { }

  ngOnInit() {

    /* Initiate the form structure */
    this.questionForm = this.fb.group({
      question: '',
      answers: this.fb.array([this.fb.group({answer:''})]),
      correct: ''
    })
  }

  get answers() {
    return this.questionForm.get('answers') as FormArray;
  }

  get correct() {
    return this.questionForm.get('correct');
  }

  get question() {
    return this.questionForm.get('question');
  }

  addAnswer() {
    this.answers.push(this.fb.group({answer:''}));
  }

  deleteAnswer(index) {
    this.answers.removeAt(index);
  }
  
  onSubmit() {

    // Reset errors
    this.showEmptyAnswerError();
    this.showEmptyQuestionError();
    this.showNoAnswersError();
    this.showWrongCorrectKeyError();
    
    // Hold answers from form
    let answersArray = [];

    // Add tags to answers
    this.answers.controls.forEach( (el,index) => {
      if(el.value.answer.trim() == ''){
        this.emptyAnswer = true;
        return;
      } answersArray.push(`${this.answerTags[index]} ${el.value.answer}`)
    }) 
    if(answersArray.length == 0) {
      this.noAnswers = true;
      return;
    } else if (this.question.value.trim() == '') {
      this.emptyQuestion = true;
      return;
    } else if(!this.emptyAnswer) {
      let trimArray = this.answerTags.slice(0, this.answers.length)

      // Check if correct answer is like in a required formatL A. , B. ...
      let goodCorrect = trimArray.some(el => el.includes(this.correct.value));

      if(goodCorrect) {
        const question = {
          question: this.question.value,
          answers: answersArray,
          correct: this.correct.value,
          date: new Date()
        }
        this.testService.addItem(this.testId, question);
        // Hide Form
        this.hideForm(); 
      }
      else {
        this.wrongCorrect = true;
      }
    }
  }

  hideForm() {
    this.testService.show.emit(false);
  }

  showEmptyAnswerError() {
    this.emptyAnswer = false;
  }
  showNoAnswersError() {
    this.noAnswers = false;
  }
  showEmptyQuestionError() {
    this.emptyQuestion = false;
  }  
  showWrongCorrectKeyError() {
    this.wrongCorrect = false;
  }  
}
