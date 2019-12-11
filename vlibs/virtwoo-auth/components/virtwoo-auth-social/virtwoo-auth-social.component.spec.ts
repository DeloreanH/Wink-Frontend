import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtwooAuthSocialComponent } from './virtwoo-auth-social.component';

describe('VirtwooAuthSocialComponent', () => {
  let component: VirtwooAuthSocialComponent;
  let fixture: ComponentFixture<VirtwooAuthSocialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtwooAuthSocialComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtwooAuthSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
