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

// Listener to close dropdown menu if clicked outside of dropdown
import { ClickOutsideDirective } from './shared/dropdown.directive';
// Filter for list of test to search by 'search value'
import { SearchFilterPipe } from './shared/filter-pipe';
import { TestComponent } from './tests/test/test.component';
import { QuestionComponent } from './tests/test/question/question.component';

//Routring
import { RouterModule, Routes } from '@angular/router';
import { AddQuestionComponent } from './components/add-question/add-question.component';

const appRoutes: Routes = [
  {path: 'test/:id', component: TestComponent},
  {path: '', component: TestsComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    TestsComponent,
    HeaderComponent,
    ClickOutsideDirective,
    SearchFilterPipe,
    TestComponent,
    QuestionComponent,
    AddQuestionComponent,
  ],
  imports: [
    BrowserModule,
    // Firestore
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,

    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [TestItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
