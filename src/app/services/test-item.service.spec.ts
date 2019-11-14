import { TestBed } from '@angular/core/testing';

import { TestItemService } from './test-item.service';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { RouterTestingModule } from '@angular/router/testing';

describe('TestItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireDatabaseModule,
      RouterTestingModule, 
    ],
    providers: [],
  }));

  it('should be created', () => {
    const service: TestItemService = TestBed.get(TestItemService);
    expect(service).toBeTruthy();
  });

  it('#getObservableValue should return value from observable',
    (done: DoneFn) => {
      const service: TestItemService = TestBed.get(TestItemService);
    service.getGroups().subscribe(value => {
      if(value.length > 0) {
        expect(value[0].payload.doc.id).toBeDefined();
        done();
      }
    });
  });
});
