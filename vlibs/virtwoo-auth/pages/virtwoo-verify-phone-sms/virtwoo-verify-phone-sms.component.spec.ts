import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtwooVerifyPhoneSmsComponent } from './virtwoo-verify-phone-sms.component';

describe('VirtwooVerifyPhoneSmsComponent', () => {
  let component: VirtwooVerifyPhoneSmsComponent;
  let fixture: ComponentFixture<VirtwooVerifyPhoneSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtwooVerifyPhoneSmsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtwooVerifyPhoneSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
