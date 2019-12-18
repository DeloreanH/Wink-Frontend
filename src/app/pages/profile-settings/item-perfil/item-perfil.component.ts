import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ProfilesService } from '../../../core/services/profiles.service';
import { ItemType } from '../../../common/models/itemType.model';
import { Item } from '../../../common/models/item.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { MessageErrorForms } from '../../../common/enums/messageError.enum';
import { ToastService } from 'src/app/core/services/toast.service';
import { NoWhiteSpace } from 'src/app/common/validators/noWhitespace.validator';
import { Buttons } from 'src/app/common/enums/buttons.enum';

@Component({
  selector: 'app-item-perfil',
  templateUrl: './item-perfil.component.html',
  styleUrls: ['./item-perfil.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItemPerfilComponent),
      multi: true
    }
  ]
})
export class ItemPerfilComponent implements ControlValueAccessor, OnInit {

  @Input() order;
  @Input() form: FormGroup;
  @Output() delete = new EventEmitter();
  @Output() changeData = new EventEmitter();
  @Input() chipInput: any;


  preIcon: string;
  icon: string;
  value: Item;
  itemType: ItemType = null;
  isDisabled: boolean;
  type = 'text';
  focus = false;
  dataLoad = false;

  itemsType: ItemType[] = [];
  unique: string[] = [];
  chipArray: string[] = [];

  visibility = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  noWhiteSpace =  new NoWhiteSpace();

  buttonConfirm: string = Buttons.CONFIRM;
  buttonCancel: string = Buttons.CANCEL;

  constructor(
    private profilesServices: ProfilesService,
    private toastService: ToastService,
  ) {
    this.unique = this.profilesServices.unique;
    // this.form.setControl('campo1', new FormControl());
  }

  ngOnInit() {
    this.ErrorMessage();
  }

  onChange = (_: Item) => { };
  onTouch = (_: Item) => { };

  writeValue(obj: Item): void {
    if (obj) {
      this.value = obj;
      // this.onChange(this.value);
      // this.form.setControl('campo1', new FormControl());
      this.form.setControl(
        'selector', new FormControl(null, Validators.required),
      );
      this.LoadItem();
    } else {
      this.value = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  AddChip(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim() && value.length > 2 && value.length < 13 && this.value.value.length < 31) {
      this.chipArray.push(this.noWhiteSpace.RemoveWhiteSpace(value));
      this.value.value = this.chipArray.join(',');
      this.Change();
    } else if (value !== '' && value.length <= 2 || value.length >= 13) {
      this.value.value = this.chipArray.join(',');
      this.toastService.Toast('WINK.PROFILE_SETTINGS.CHIP');
    }
    if (input) {
      input.value = '';
    }
    (this.form.controls.campo1 as FormControl).markAsTouched();
  }

  DeleteChip(chip: any): void {
    const index = this.chipArray.indexOf(chip);
    if (index >= 0) {
      this.chipArray.splice(index, 1);
      this.value.value = this.chipArray.join(',');
      this.focus = true;
    }
    this.Change();
  }

  KeyDown(event: any, inputValue: any) {
    if (event && event.keyCode === COMMA) {
      // this._chipList._allowFocusEscape();
      inputValue.value = inputValue.value.replace(',', '', 'gi');
      if (inputValue.value.indexOf(',') === -1) {
        this.AddChip({
          input: inputValue,
          value: inputValue.value,
        });
      }
    }
  }

  LoadItem() {
    if (this.value.value === '' || this.value.value) {
      this.SearchItemType();
      if (this.itemType && !this.itemType.repeat) {
        this.AddUnique();
      }
    } else {
      this.SearchItemsType(this.value.category);
    }
  }

  LoadChips() {
    if (this.itemType && this.itemType.index === 8 && this.value.value !== '') {
      const valores = this.value.value.split(',');
      for (const valor of valores) {
        this.chipArray.push(valor.trim());
      }
      (this.form.controls.campo1 as FormControl).markAsTouched();
    }
  }

  AddInputForm() {
    this.form.removeControl('selector');
    this.form.removeControl('campo1');
    this.form.removeControl('campo2');
    if (this.itemType) {
      switch (this.itemType.index) {
        case 0:
          this.type = 'text';
          this.form.setControl(
            'campo1', new FormControl(this.Value(0),
            this.value.basic ? [
              Validators.minLength(2),
              Validators.maxLength(50),
              this.noWhiteSpace.Validator
            ]
            : [
              Validators.required,
              Validators.minLength(2),
              Validators.maxLength(50),
              this.noWhiteSpace.Validator
            ]),
          );
          break;
        case 1:
            this.type = 'email';
            this.form.setControl(
              'campo1', new FormControl(this.Value(0),
              this.value.basic ? [
                Validators.email,
                Validators.maxLength(50),
                this.noWhiteSpace.Validator
              ]
              : [
                Validators.required,
                Validators.email,
                Validators.maxLength(50),
                this.noWhiteSpace.Validator
              ]),
            );
            break;
        case 2:
            this.type = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Value(0),
              this.value.basic ? [
                Validators.minLength(2),
                Validators.maxLength(50),
                this.noWhiteSpace.Validator
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                this.noWhiteSpace.Validator
              ]),
            );
            this.form.setControl(
              'campo2', new FormControl(this.Value(1),
              this.value.basic ? [
                Validators.minLength(2),
                Validators.maxLength(50),
                this.noWhiteSpace.Validator
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                this.noWhiteSpace.Validator
              ]),
            );
            break;
        case 3:
            this.type = 'url';
            this.form.setControl(
              'campo1', new FormControl(this.Value(0),
              this.value.basic ? [
                Validators.pattern(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/),
                this.noWhiteSpace.Validator
              ]
              : [
                Validators.required,
                Validators.pattern(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/),
                this.noWhiteSpace.Validator
              ]),
            );
            break;
        case 4:
            this.type = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Value(0),
              this.value.basic ? [
                this.noWhiteSpace.Validator
              ] :
              [
                Validators.required,
                this.noWhiteSpace.Validator
              ]),
            );
            break;
        case 5:
            this.type = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Value(0),
              this.value.basic ? [
                this.noWhiteSpace.Validator
              ] :
              [
                Validators.required,
                this.noWhiteSpace.Validator
              ]),
            );
            break;
        case 6:
            this.type = 'number';
            this.form.setControl(
              'campo1', new FormControl(this.Value(0),
              this.value.basic ? [
                Validators.minLength(3),
                this.noWhiteSpace.Validator
              ]
              : [
                Validators.required,
                Validators.minLength(3),
                this.noWhiteSpace.Validator
              ]),
            );
            break;
        case 7:
            this.type = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Value(0),
              this.value.basic ? [
                Validators.minLength(2),
                Validators.maxLength(50),
                this.noWhiteSpace.Validator
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                this.noWhiteSpace.Validator
              ]),
            );
            this.form.setControl(
              'campo2', new FormControl(this.Value(1),
              this.value.basic ? [
                Validators.minLength(2),
                Validators.maxLength(50),
                this.noWhiteSpace.Validator
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                this.noWhiteSpace.Validator
              ]),
            );
            break;
          case 8:
            this.type = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Value(0),
              this.value.basic ? [
                Validators.minLength(3),
                Validators.maxLength(30),
                this.noWhiteSpace.Validator
              ]
              : [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
                this.noWhiteSpace.Validator
              ]),
            );
            break;
      }
    } else {
      this.form.setControl(
        'selector', new FormControl(null, Validators.required),
      );
    }
    this.dataLoad = true;
  }

  async SearchItemType() {
    try {
      if (this.value) {
        this.itemType = await this.profilesServices.SearchItemType(this.value.itemtype);
        if (this.itemType) {
          this.AddInputForm();
          this.SearchItemsType(this.itemType.category);
          this.LoadChips();
        }
      }
      this.LoadIcon();
    } catch (err) {
      console.log('Error SearchItemType', err.message);
    }
  }

  async SearchItemsType(idCategory: string) {
    try {
      if (idCategory) {
        this.itemsType = await this.profilesServices.SearchItemTypeCategoryName(idCategory);
      }
    } catch (err) {
      console.log('Error SearchItemsType', err.message);
    }
  }

  SelectItemType(event: ItemType) {
    this.itemType = event;
    if (!event.repeat) {
      this.AddUnique();
    }
    this.value.itemtype =  event.name;
    this.value.value  = '';
    this.LoadIcon();
    this.AddInputForm();
    this.Change();
  }

  LoadIcon() {
    if (this.itemType) {
      const values = this.itemType.icon.split(' ');
      this.preIcon = values[0];
      this.icon = values[1];
    } else {
      this.preIcon = 'far';
      this.icon = 'smile-wink';
    }
  }

  Delete() {
    this.Change();
    this.DeleteUnique();
    this.delete.emit(this.value);
  }

  CurrentDate() {
    return new Date();
  }

  Watermark(input: number) {
    switch (this.itemType.index) {
      case 2:
        return input === 0 ? 'WINK.PROFILE_SETTINGS.OPTIONS.POSITION' : 'WINK.PROFILE_SETTINGS.OPTIONS.COMPANY';
      case 7:
        return input === 0 ? 'WINK.PROFILE_SETTINGS.OPTIONS.TITLE' : 'WINK.PROFILE_SETTINGS.OPTIONS.VALUE';
      default:
        return this.itemType.description;
    }
  }

  Value(input: number): string {
    switch (input) {
      case 0:
        return this.value.value;
      case 1:
        return this.value.custom;
    }
  }

  ShowSelector() {
    if (!this.value.basic) {
      this.DeleteUnique();
      this.itemType = null;
      this.onChange(this.value);
      this.AddInputForm();
      this.Change();
    }
  }

  OnInput(value: string, campo: number) {
    switch (campo) {
      case 0:
        this.value.value = this.noWhiteSpace.RemoveWhiteSpace(value);
        break;
      case 1:
        this.value.custom = this.noWhiteSpace.RemoveWhiteSpace(value);
        break;
    }
    this.onTouch(this.value);
    this.onChange(this.value);
    if (value !== '') {
      this.Change();
    }
  }

  ValueChip(value) {
    this.value.value = this.chipArray.join(',');
    this.value.value = this.value.value + ',' + value;
    (this.form.controls.campo1 as FormControl).markAsTouched();
  }

  Unique(tipoItem: ItemType): boolean {
    return this.unique.indexOf(tipoItem._id) === -1 ? false : true;
  }

  AddUnique() {
    if (this.unique.indexOf(this.itemType._id) === -1) {
      this.unique.push(this.itemType._id);
    }
  }

  DeleteUnique() {
    if (this.itemType) {
      const index = this.unique.indexOf(this.itemType._id);
      if (index !== -1) {
        this.unique.splice(index, 1);
      }
    }
  }

  Focus(value: boolean) {
    this.focus = value;
  }

  ErrorMessage() {
    try {
      if (!this.itemType) {
        return this.form.get('selector').hasError('required') && this.form.get('selector').touched ?
        MessageErrorForms.REQUIRED :  null;
      } else {
        if (this.form.get('campo1') && this.form.get('campo1').errors && this.form.get('campo1').touched ) {
          return this.ValidError('campo1');
        } else  if (this.form.get('campo2') && this.form.get('campo2').touched) {
          return this.ValidError('campo2');
        }
      }
    } catch (err) {
      return null;
    }
  }

  ValidError(input: string) {
    const obj = this.form.controls[input].errors;
    let prop;
    Object.keys(obj).forEach(
      (key) => {
        prop = key;
      }
    );
    if (prop) {
      switch (prop) {
        case 'required':
          return MessageErrorForms.REQUIRED;
        case 'email':
          return MessageErrorForms.EMAIL;
        case 'pattern':
          return MessageErrorForms.URL;
        case 'minlength':
          return MessageErrorForms.MINIMUM;
        case 'maxlength':
          return  MessageErrorForms.MAXIMUM;
        case 'whitespace':
          return MessageErrorForms.WHITE_SPACE;
      }
    } else {
      return null;
    }
  }

  private Change() {
    this.changeData.emit(true);
  }

}
