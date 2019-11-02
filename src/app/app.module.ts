import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Firestore imports
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { TestsComponent } from './tests/tests.component';
//Test service
import { TestItemService } from './services/test-item.service';
import { HeaderComponent } from './header/header.component';

// Listener to close dropdown menu if clicked outside of dropdown - directive
import { ClickOutsideDirective } from './shared/dropdown.directive';

// Scroll to element directive
import {ScrollToDirective} from './shared/scroll.directive';

// Filter for list of test to search by 'search value'
import { SearchFilterPipe } from './shared/filter-pipe';
import { TestComponent } from './tests/test/test.component';
import { QuestionComponent } from './tests/test/question/question.component';

//Routring
import { RouterModule, Routes, Scroll } from '@angular/router';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { AddTestComponent } from './components/add-test/add-test.component';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



const appRoutes: Routes = [
  {path: 'test/:id', component: TestComponent},
  {path: '', component: TestsComponent},
  {path: 'newtest', component: AddTestComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    TestsComponent,
    HeaderComponent,
    ClickOutsideDirective,
    ScrollToDirective,
    SearchFilterPipe,
    TestComponent,
    QuestionComponent,
    AddQuestionComponent,
    AddTestComponent,
  ],
  imports: [
    BrowserModule,
    // Firestore
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,

    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    PDFExportModule,
    BrowserAnimationsModule,
    BrowserModule
  ],
  providers: [TestItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
