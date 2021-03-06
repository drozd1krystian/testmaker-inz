import { Component, OnInit } from '@angular/core';
import { Student } from '../models/student'
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
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

  // Add Form
  showAddF: boolean = false;
  addStudentsForm: FormGroup
  indexExist: string = '';
  smthWrong: string = '';
  addedStudents: boolean = false;
  idLengthError: boolean = false;
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
    });

    // Check if doc exist. If yes then remove all students before it from form
    this.testService.indexExist.subscribe(el => {
      this.indexExist = el;
      if(this.indexExist != '' && this.indexExist != 'true'){
        // Hold the values from form
        let tempStudArr = []; let tempIdArr = [];
        tempStudArr = this.students.split(',');
        tempIdArr = this.indexes.split(',');

        // Find id of student that exists in database
        let id = tempStudArr.indexOf(this.indexExist);
        let howMuchRemove = 0;
        // Remove all values from form before this one student
        if(tempStudArr.length < 3) {howMuchRemove = id} else { howMuchRemove = id - 1}  
        this.addStudentsForm.get('students').setValue( tempStudArr.slice(howMuchRemove, tempStudArr.length).join(','));
        this.addStudentsForm.get('indexes').setValue( tempIdArr.slice(howMuchRemove, tempIdArr.length).join(','));
      } else if(this.indexExist == 'true'){
        this.showAddF = false;
        this.addedStudents = true;
      }
    });
  }

  // Search bar 
  initForm(): FormGroup {
    return this.groupForm = this.fb.group({
      search: [null]
    })
  }

  initAddForm(): FormGroup {
    return this.addStudentsForm = this.fb.group({
      students: '',
      indexes: '',
      groupName: ''
    });
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

  showAddForm() {
    this.showAddF = true;
    this.initAddForm();
  }

  showSearchForm() {
    this.showAddF = false;
    this.studentArr = [];
    this.initForm();
  }

  // Add Form
  get students() {
    return this.addStudentsForm.get('students').value;
  }
  get indexes() {
    return this.addStudentsForm.get('indexes').value;
  }
  get groupName() {
    return this.addStudentsForm.get('groupName').value;
  }

   addStudents(){
    if(this.students.length > 0 && this.indexes.length > 0) {
      let studFormArr = this.students.split(',');
      let indexesArr = this.indexes.split(',');
      let groupName = this.groupName;
      let splitNames: any[] = [];
      let checker = true;
      let tempStudArr :  any[] = [];

      // Remove the empty spaces before the names and indexes
      indexesArr.forEach((el,index) => indexesArr[index] = el.trim());
      studFormArr.forEach((el,index) => studFormArr[index] = el.trim());

      if(indexesArr.length != studFormArr.length && (indexesArr.length > 0 && studFormArr.length > 1)) { this.idLengthError = true; return;}
      if((studFormArr.length > 0 && indexesArr.length > 0 && groupName != '') 
        && studFormArr.length == indexesArr.length){
          studFormArr.forEach((el,index) => {
            splitNames = el.split(' ');
            if(splitNames[0] == ''){
              splitNames.shift();
            }
            if(splitNames.length < 2) { checker = false; this.smthWrong = splitNames[0]; return; }
            tempStudArr[index] = {
              name: splitNames[0],
              surname: splitNames[1],
            }
          })
        if(!checker){ return;}
        this.testService.addStudents(tempStudArr, indexesArr, groupName);
        }
    }
  }

  indexExistError(){
    this.indexExist = '';
  }

  closeError(){
    this.smthWrong = '';
  }
  closeIdError(){
    this.idLengthError = false;
  }
  closeAlertGood() {
    this.addedStudents = false;
  }
}
