import { Component, OnInit, Input } from '@angular/core';
import { Grade } from '../../../models/student'
import {TestItemService} from '../../../services/test-item.service' 
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tr[app-grade-row]',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {

  @Input() grade: Grade;
  @Input() studentId: string;
  @Input() group: string;
  editMode: boolean = false;
  constructor(private testService: TestItemService, private datePipe: DatePipe) { }

  ngOnInit() {
  }


  editGrade(){
    this.grade.date = this.datePipe.transform(this.grade.date, 'yyyy-MM-dd');
    this.testService.updateGrade(this.group, this.studentId, this.grade.id, this.grade);
  }
}
