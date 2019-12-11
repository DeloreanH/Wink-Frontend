import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtwooAuthFormComponent } from './virtwoo-auth-form.component';

describe('VirtwooAuthFormComponent', () => {
  let component: VirtwooAuthFormComponent;
  let fixture: ComponentFixture<VirtwooAuthFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtwooAuthFormComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtwooAuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
