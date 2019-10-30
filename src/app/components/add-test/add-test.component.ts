import { Component, OnInit } from '@angular/core';
import {Question} from '../../models/question';
import {TestItemService} from '../../services/test-item.service';

@Component({
  selector: 'app-add-test',
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.css']
})
export class AddTestComponent implements OnInit {

  testName: string = '';
  testCategory: string = '';

  questions: Question[] = [];
  question: Question;
  answersTags: String[] = ['A.', 'B.', 'C.', 'D.', 'E.', 'F', 'G', 'H'];

  showTemplate: boolean = true;
  testExist: boolean = false;
  constructor(private testService: TestItemService ) { }

  ngOnInit() {
    this.testService.testExist.subscribe(el => {
      this.testExist = el;
    })
  }

  changeListener($event) : void {
    this.loadQuestions($event.target);
  }
  loadQuestions(inputValue: any) : void {
    let file:File = inputValue.files[0]; 
    let myReader:FileReader = new FileReader();

 
    myReader.onloadend = () => {
      // Remove template img
      this.showTemplate = false;
      //Get content from file
      let content = myReader.result.toString();

      // Split content by questions
      let arrayContent = content.split('#');

      // Split question to Question and Answers
      let arrayQuestions = [];
      arrayContent.forEach(el => {
        arrayQuestions.push(el.split('---'));
      });

      // First field is test name and category
      let testInfo = '';
      testInfo = arrayQuestions.shift()[0];
      let testInfoArray = testInfo.split(',');
      
      // Get category (test file have name and date)
      let name = testInfoArray[1].split('\n')[0];
      name = name.trim();
      // Replace HTML tags in test name
      testInfoArray[0] = testInfoArray[0].replace(/<b>/g, '');
      testInfoArray[0] = testInfoArray[0].replace(/<\/b>/g,'');
      
      this.testName = name.replace(/[\n\r]/g, '');;
      this.testCategory = testInfoArray[0];

      arrayQuestions.forEach(el => {
       // Replace tags in question for HTML <code>
       el[0] = el[0].replace(/<cs>/g, '<br><code>');
       el[0] = el[0].replace(/[\n\r]/g, '');
       el[0] = el[0].replace(/<\/cs>/g, '</code><br>');
       el[0] = el[0].replace(/<c>/g, '<code>');
       el[0] = el[0].replace(/<\/c>/g, '</code>');
       el[0] = el[0].replace("`", "&nbsp;");

       // Array for answers
       let tempArray = [];

       // Split answers
        tempArray = el[1].split('\n');

        // Remove first empty element
        tempArray.shift();

        //Remove last empty element
        tempArray = tempArray.filter(el => el !='');

        // Add answer tags 'A.' etc
        tempArray.forEach((el, index) => {
          tempArray[index] = `${this.answersTags[index]} ${el}`;

          // Replace with <code>
          tempArray[index] = tempArray[index].replace(/<c>/g, '<code>');
          tempArray[index] = tempArray[index].replace(/<\/c>/g, '</code>');
        })

        // Find correct answer
        let correct = tempArray.findIndex(el => el.includes('+'));
        tempArray[correct] = tempArray[correct].replace('+', '');

        // Put to object
         this.question = {
           question: el[0],
           answers: tempArray,
           correct: this.answersTags[correct].toString(),
           date: new Date()
         }
         this.questions.push(this.question);
      });
    }
    myReader.readAsText(file, 'Windows-1250');
  }

  // Track id of answers items
  indexTracker(index: number, value: any) {
    return index;
  }

  onSubmit() {
    if(this.testName != '' && this.testCategory != '') {
      this.testService.addTest(this.testName.toUpperCase(), this.testCategory.toUpperCase(), this.questions)
    } 
  }
}
