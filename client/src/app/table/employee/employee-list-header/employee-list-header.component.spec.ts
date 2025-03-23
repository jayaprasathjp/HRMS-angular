import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListHeaderComponent } from './employee-list-header.component';

describe('EmployeeListHeaderComponent', () => {
  let component: EmployeeListHeaderComponent;
  let fixture: ComponentFixture<EmployeeListHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeListHeaderComponent]
    });
    fixture = TestBed.createComponent(EmployeeListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
