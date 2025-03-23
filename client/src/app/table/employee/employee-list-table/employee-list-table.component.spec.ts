import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListTableComponent } from './employee-list-table.component';

describe('EmployeeListTableComponent', () => {
  let component: EmployeeListTableComponent;
  let fixture: ComponentFixture<EmployeeListTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeListTableComponent]
    });
    fixture = TestBed.createComponent(EmployeeListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
