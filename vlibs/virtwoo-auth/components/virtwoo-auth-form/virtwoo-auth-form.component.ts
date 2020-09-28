import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  FormControl,
  Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  Country,
  FindCountriesService
} from '@virtwoo/find-countries';

enum Field {
  Email = 'email',
  Password = 'password',
  Username = 'username',
  Phone = 'phone',
  Prefix = 'prefix',
  Code = 'code',
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'virtwoo-auth-form',
  templateUrl: './virtwoo-auth-form.component.html',
  styleUrls: ['./virtwoo-auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtwooAuthFormComponent
  implements OnInit, AfterViewInit {

  @Input()
  public fields: Field[] = [];

  @Input()
  public submitText = '';

  @Input()
  public submitIconUrl = null;

  @Input()
  public submitIcon = null;

  @Input()
  public disabled = false;

  @Output()
  public submitted = new EventEmitter<any>();

  public visibility = false;
  public country: Country;
  public form: FormGroup;
  public load = false;
  public field = Field;

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private findCountriesService: FindCountriesService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.createForm();

    this.load = true;
  }

  public ngAfterViewInit(): void {
    if (this.isControl(Field.Prefix)) {
      this.changePrefix('58', true);
    }
  }

  public changeVisibility(): void {
    this.visibility = !this.visibility;
  }

  public isFormControlStatus(formControl: string, status: string): boolean {
    return this.formControl(formControl).status === status;
  }

  public formControl(formControl: string): AbstractControl {
    return this.form.controls[formControl];
  }

  public getErrorMessage(formControl: string): string {
    const abstractControl = this.formControl(formControl);
    let tag = '';

    if (abstractControl.getError('required')) {
      tag = this.translateService.instant('VIRTWOO_AUTH.FORM.CONTROL.REQUIRED');
    } else if (abstractControl.getError('email')) {
      tag = this.translateService.instant('VIRTWOO_AUTH.FORM.CONTROL.EMAIL');
    } else if (abstractControl.getError('minlength')) {
      tag = this.translateService.instant('VIRTWOO_AUTH.FORM.CONTROL.MINLENGTH');
    } else if (abstractControl.getError('maxlength')) {
      tag = this.translateService.instant('VIRTWOO_AUTH.FORM.CONTROL.MAXLENGTH');
    }

    return tag;
  }

  public isControl(field: Field): boolean {
    return this.fields.indexOf(field) > -1;
  }

  public submit(): void {
    if (!this.disabled) {
      this.submitted.emit(this.form.value);
    }
  }

  public changePrefix(value: string, changeModel = false): void {
    if (value && value.trim() !== '') {
      value = value
        .trim()
        .toLowerCase();

      this.country =  FindCountriesService.SearchByPrefix(value);

      if (this.country && changeModel) {
        this.form.patchValue({ prefix: Number(this.country.code) });
      }

      this.changeDetectorRef.detectChanges();
    }
  }

  public openCountries(): void {
    this.findCountriesService.launch()
      .subscribe(
        (response: Country) => {
          this.country = response;
          this.form.patchValue({ prefix: Number(this.country.code) });
          this.changeDetectorRef.detectChanges();
        }
      );
  }

  private createForm(): void {
    this.form = this.formBuilder.group(this.controls);
  }

  private get controls(): object {
    const controls = {};

    this.fields.forEach((field) => {
      controls[field] = this.generateFormControl(field);
    });

    return controls;
  }

  private generateFormControl(field: Field): FormControl {
    switch (field) {
      case Field.Email:
        return new FormControl(
          '',
          [ Validators.required, Validators.email ]
        );
      case Field.Password:
        return new FormControl(
          '',
          [ Validators.required, Validators.minLength(8) ]
        );
      case Field.Username:
        return new FormControl(
          '',
          [ Validators.required, Validators.minLength(8) ]
        );
      case Field.Phone:
        return new FormControl(
          '',
          [ Validators.required, Validators.minLength(8) ]
        );
      case Field.Prefix:
        return new FormControl(
          '',
          [ Validators.required, Validators.minLength(8) ]
        );
      case Field.Code:
        return new FormControl(
          '',
          [ Validators.required, Validators.minLength(1) ]
        );
    }

  }

}
