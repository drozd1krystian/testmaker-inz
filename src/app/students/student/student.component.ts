import { Component, OnInit, Input } from '@angular/core';
import { TestItemService } from '../../services/test-item.service'
import { Student, Grade } from '../../models/student'
 
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  @Input() student: Student;
  @Input() group: string;
  showDetails: boolean = false;
  constructor(private testService: TestItemService) { }

  ngOnInit() {
  }

  showStudentDetails(){
    if(!this.showDetails) {
      this.testService.getStudentGrades(this.student.index,this.group ).subscribe(arr => {
        this.student.grades = arr.map( el => {
          return {
            id: el.payload.doc.id,
            ...el.payload.doc.data()
          } as Grade
        }) 
      this.showDetails = true;
      })
    } else {
      this.showDetails = false;
    } 
  }

}
