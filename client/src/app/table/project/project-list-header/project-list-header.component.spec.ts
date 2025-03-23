import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListHeaderComponent } from './project-list-header.component';

describe('ProjectListHeaderComponent', () => {
  let component: ProjectListHeaderComponent;
  let fixture: ComponentFixture<ProjectListHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectListHeaderComponent]
    });
    fixture = TestBed.createComponent(ProjectListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
