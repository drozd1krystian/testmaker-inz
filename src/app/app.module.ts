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

@NgModule({
  declarations: [
    AppComponent,
    TestsComponent,
    HeaderComponent,
    ClickOutsideDirective,
    SearchFilterPipe,
  ],
  imports: [
    BrowserModule,
    // Firestore
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,

    FormsModule,
    ReactiveFormsModule
  ],
  providers: [TestItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
