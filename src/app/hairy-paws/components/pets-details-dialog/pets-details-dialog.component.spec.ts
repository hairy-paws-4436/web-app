import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsDetailsDialogComponent } from './pets-details-dialog.component';

describe('PetsDetailsDialogComponent', () => {
  let component: PetsDetailsDialogComponent;
  let fixture: ComponentFixture<PetsDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetsDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
