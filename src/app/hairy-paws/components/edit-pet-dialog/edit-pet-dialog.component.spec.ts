import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPetDialogComponent } from './edit-pet-dialog.component';

describe('EditPetDialogComponent', () => {
  let component: EditPetDialogComponent;
  let fixture: ComponentFixture<EditPetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPetDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
