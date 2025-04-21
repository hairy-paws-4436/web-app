import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngEditComponent } from './ong-edit.component';

describe('OngEditComponent', () => {
  let component: OngEditComponent;
  let fixture: ComponentFixture<OngEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
