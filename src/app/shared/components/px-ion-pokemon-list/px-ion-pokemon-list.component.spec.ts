import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PxIonPokemonListComponent } from './px-ion-pokemon-list.component';

describe('PxIonPokemonListComponent', () => {
  let component: PxIonPokemonListComponent;
  let fixture: ComponentFixture<PxIonPokemonListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PxIonPokemonListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PxIonPokemonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
