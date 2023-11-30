import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometryComponent } from './biometry.component';

describe('BiometryComponent', () => {
  let component: BiometryComponent;
  let fixture: ComponentFixture<BiometryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiometryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiometryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
