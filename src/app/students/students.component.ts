import { Component, OnInit } from '@angular/core';
import { Student } from '../models/student'
import { FormBuilder, FormGroup } from '@angular/forms';
import { TestItemService } from '../services/test-item.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  groupForm: FormGroup;
  groups: any[] = [];
  showDropDown: boolean = false;

  // Students
  studentArr : Student[] = [];

  constructor(private testService: TestItemService, private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm(); 

    this.testService.getGroups().subscribe(arr => {
      this.groups = arr.map(el => {
        return {
          id: el.payload.doc.id
        }
      })
    })
  }

  // Search bar 
  initForm(): FormGroup {
    return this.groupForm = this.fb.group({
      search: [null]
    })
  }

  openDropDown() {
    this.showDropDown ? this.showDropDown = false : this.showDropDown = true; 
  }

  closeDropDown(){
    this.showDropDown = false;
  }

  getSearchValue(){
    return this.groupForm.value.search;
  }

  selectValue(value) {
    this.groupForm.patchValue({"search": value});
    this.showDropDown = false;
  }

  getStudents() {
    if(this.groups.some(el => el.id == this.getSearchValue())) {
      this.testService.getStudents(this.getSearchValue()).subscribe(arr => {
        this.studentArr = arr.map( el => {
          return {
            index: el.payload.doc.id,
            ...el.payload.doc.data()
          } as Student
        })
      })
    } 
  }
}
