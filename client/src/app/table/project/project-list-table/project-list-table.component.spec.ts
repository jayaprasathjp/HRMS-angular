import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListTableComponent } from './project-list-table.component';

describe('ProjectListTableComponent', () => {
  let component: ProjectListTableComponent;
  let fixture: ComponentFixture<ProjectListTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectListTableComponent]
    });
    fixture = TestBed.createComponent(ProjectListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
