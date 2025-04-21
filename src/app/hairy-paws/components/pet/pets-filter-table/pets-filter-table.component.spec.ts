import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsFilterTableComponent } from './pets-filter-table.component';

describe('PetsFilterTableComponent', () => {
  let component: PetsFilterTableComponent;
  let fixture: ComponentFixture<PetsFilterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsFilterTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetsFilterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
