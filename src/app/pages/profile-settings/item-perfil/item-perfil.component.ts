import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ProfilesService } from '../../../core/services/profiles.service';
import { ItemType } from '../../../common/models/itemType.model';
import { Item } from '../../../common/models/item.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { MessageErrorForms } from '../../../common/enums/messageError.enum';
import { ToastService } from 'src/app/core/services/toast.service';

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

  @Input() ordenando;
  @Input() form: FormGroup;
  @Output() delete = new EventEmitter();
  @Output() change = new EventEmitter();
  @Input() chipInput: any;


  preIcono: string;
  icon: string;
  value: Item;
  itemType: ItemType = null;
  isDisabled: boolean;
  type = 'text';
  focus = false;
  dataLoad = false;

  tiposItems: ItemType[] = [];
  unique: string[] = [];
  chipArray: string[] = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

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
      this.CargarItem();
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
      this.chipArray.push(value.trim());
      this.value.value = this.chipArray.join(',');
      if (input) {
        input.value = '';
      }
    } else if (value !== '' && value.length <= 2 || value.length >= 13) {
      this.toastService.Toast('WINK.PROFILE_SETTINGS.CHIP');
    }
    if (value && value !== '') {
      this.Change();
    }
    (this.form.controls.campo1 as FormControl).markAsTouched();
  }

  DeleteChip(fruit: any): void {
    const index = this.chipArray.indexOf(fruit);
    if (index >= 0) {
      this.chipArray.splice(index, 1);
      this.value.value = this.chipArray.join(',');
      this.focus = true;
    }
    this.Change();
  }

  CargarItem() {
    if (this.value.value === '' || this.value.value) {
      this.BuscarTItem();
      if (this.itemType && !this.itemType.repeat) {
        this.AggUnico();
      }
    } else {
      this.BuscarTItems(this.value.category);
    }
  }

  CargarChips() {
    if (this.itemType && this.itemType.index === 8 && this.value.value !== '') {
      const valores = this.value.value.split(',');
      for (const valor of valores) {
        this.chipArray.push(valor.trim());
      }
      (this.form.controls.campo1 as FormControl).markAsTouched();
    }
  }

  AggCampoForm() {
    this.form.removeControl('selector');
    this.form.removeControl('campo1');
    this.form.removeControl('campo2');
    if (this.itemType) {
      switch (this.itemType.index) {
        case 0:
          this.type = 'text';
          this.form.setControl(
            'campo1', new FormControl(this.Valor(0),
            this.value.basic ? [
              Validators.minLength(2),
              Validators.maxLength(50),
            ]
            : [
              Validators.required,
              Validators.minLength(2),
              Validators.maxLength(50)
            ]),
          );
          break;
        case 1:
            this.type = 'email';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basic ? [
                Validators.email,
                Validators.maxLength(50)
              ]
              : [
                Validators.required,
                Validators.email,
                Validators.maxLength(50)
              ]),
            );
            break;
        case 2:
            this.type = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basic ? [
                Validators.minLength(2),
                Validators.maxLength(50),
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
              ]),
            );
            this.form.setControl(
              'campo2', new FormControl(this.Valor(1),
              this.value.basic ? [
                Validators.minLength(2),
                Validators.maxLength(50),
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
              ]),
            );
            break;
        case 3:
            this.type = 'url';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basic ? [
                Validators.pattern(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)
              ]
              : [
                Validators.required,
                Validators.pattern(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)
              ]),
            );
            break;
        case 4:
            this.type = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basic ? [] :
              [
                Validators.required,
              ]),
            );
            break;
        case 5:
            this.type = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basic ? [] :
              [
                Validators.required,
              ]),
            );
            break;
        case 6:
            this.type = 'number';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basic ? [
                Validators.minLength(3)
              ]
              : [
                Validators.required,
                Validators.minLength(3)
              ]),
            );
            break;
        case 7:
            this.type = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basic ? [
                Validators.minLength(2),
                Validators.maxLength(50),
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
              ]),
            );
            this.form.setControl(
              'campo2', new FormControl(this.Valor(1),
              this.value.basic ? [
                Validators.minLength(2),
                Validators.maxLength(50),
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
              ]),
            );
            break;
          case 8:
            this.type = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basic ? [
                Validators.minLength(3),
                Validators.maxLength(30),
              ]
              : [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
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

  async BuscarTItem() {
    try {
      if (this.value) {
        this.itemType = await this.profilesServices.SearchItemType(this.value.itemtype);
        if (this.itemType) {
          this.AggCampoForm();
          this.BuscarTItems(this.itemType.category);
          this.CargarChips();
        }
      }
      this.CargarIcono();
    } catch (err) {
      console.log('Error BuscarTItem', err.message);
    }
  }

  async BuscarTItems(idCategoria: string) {
    try {
      if (idCategoria) {
        this.tiposItems = await this.profilesServices.SearchItemTypeCategoryName(idCategoria);
      }
    } catch (err) {
      console.log('Error BuscarTItems', err.message);
    }
  }

  SelecionarTipoItem(event: ItemType) {
    this.itemType = event;
    if (!event.repeat) {
      this.AggUnico();
    }
    this.value.itemtype =  event.name;
    this.value.value  = '';
    this.CargarIcono();
    this.AggCampoForm();
    this.Change();
  }

  CargarIcono() {
    if (this.itemType) {
      const valores = this.itemType.icon.split(' ');
      this.preIcono = valores[0];
      this.icon = valores[1];
    } else {
      this.preIcono = 'far';
      this.icon = 'smile-wink';
    }
  }

  Eliminar() {
    this.Change();
    this.EliminarUnico();
    this.delete.emit(this.value);
  }

  FechaActual() {
    return new Date();
  }

  MarcaAgua(campo: number) {
    switch (this.itemType.index) {
      case 2:
        return campo === 0 ? 'Puesto' : 'Empresa';
      case 7:
        return campo === 0 ? 'Título' : 'Valor';
      default:
        return this.itemType.description;
    }
  }

  Valor(campo: number): string {
    switch (campo) {
      case 0:
        return this.value.value;
      case 1:
        return this.value.custom;
    }
  }

  MostrarSelector() {
    if (!this.value.basic) {
      this.EliminarUnico();
      this.itemType = null;
      this.onChange(this.value);
      this.AggCampoForm();
      this.Change();
    }
  }

  onInput(value: string, campo: number) {
    switch (campo) {
      case 0:
        this.value.value = value;
        break;
      case 1:
        this.value.custom = value;
        break;
    }
    this.onTouch(this.value);
    this.onChange(this.value);
    if (value !== '') {
      this.Change();
    }
  }

  ValorChip(value) {
    this.value.value = this.chipArray.join(',');
    this.value.value = this.value.value + ',' + value;
    (this.form.controls.campo1 as FormControl).markAsTouched();
  }

  Unicos(tipoItem: ItemType): boolean {
    return this.unique.indexOf(tipoItem._id) === -1 ? false : true;
  }

  AggUnico() {
    if (this.unique.indexOf(this.itemType._id) === -1) {
      this.unique.push(this.itemType._id);
    }
  }

  EliminarUnico() {
    if (this.itemType) {
      const index = this.unique.indexOf(this.itemType._id);
      if (index !== -1) {
        this.unique.splice(index, 1);
      }
    }
  }

  Focus(valor: boolean) {
    this.focus = valor;
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
        case 'limit' :
          return 'limite';
      }
    } else {
      return null;
    }
  }

  private Change() {
    this.change.emit(true);
  }

}
