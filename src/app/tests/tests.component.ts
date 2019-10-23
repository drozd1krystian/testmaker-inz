import { Component, OnInit, Input } from '@angular/core';
import { TestItemService } from '../services/test-item.service';
import { Test } from '../models/test';
import { FormBuilder, FormGroup } from '@angular/forms';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {

  tests: Test[];
  testForm: FormGroup;
  showDropDown = false;
  search: string

  constructor(private testService: TestItemService, private fb: FormBuilder ) { 
    this.initForm();

    this.testForm.get('search').valueChanges.subscribe( x => {
      if(x.value !== '') {
        this.showDropDown = true;
      } else {
        this.showDropDown = false;
      }
    });
  }

  ngOnInit() {
    this.testService.getTests().subscribe(tests => {
      this.tests = tests.map(test => {
        return {
          id: test.payload.doc.id,
          ...test.payload.doc.data()
        } as Test;
      })
    })
  }

  
  initForm(): FormGroup {
    return this.testForm = this.fb.group({
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
    return this.testForm.value.search;
  }

  selectValue(value) {
    this.testForm.patchValue({"search": value});
    this.showDropDown = false;
  }

}
