import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ProfilesService } from '../../../services/profiles.service';
import { ItemType } from '../../../models/itemType.model';
import { Item } from '../../../models/item.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { MessageError } from '../../../config/enums/messageError.enum';

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
  @Output() eliminar = new EventEmitter();
  @Output() cambio = new EventEmitter();
  @Input() chipInput: any;


  preIcono: string;
  icon: string;
  value: Item;
  itemType: ItemType = null;
  isDisabled: boolean;
  type = 'text';
  focus = false;
  errorMessage = null;
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
    // console.log('obj', obj);
    if (obj) {
      this.value = obj;
      // this.onChange(this.value);
      // this.form.setControl('campo1', new FormControl());
      this.form.setControl(
        'selector', new FormControl(null, Validators.required),
      );
      this.CargarItem();
      this.CargarChips();
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
    if ((value || '').trim() && value.length > 2 && this.value.value.length < 31) {
      this.chipArray.push(value.trim());
      this.value.value = this.chipArray.join(',');
      if (input) {
        input.value = '';
      }
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
    console.log(this.form);
    this.form.removeControl('selector');
    this.form.removeControl('campo1');
    this.form.removeControl('campo2');
    if (this.itemType) {
      console.log(this.itemType);
      switch (this.itemType.index) {
        case 0:
          this.type = 'text';
          this.form.setControl(
            'campo1', new FormControl(this.Valor(0),
            this.value.basic ? [
              Validators.minLength(2),
              Validators.maxLength(150),
            ]
            : [
              Validators.required,
              Validators.minLength(2),
              Validators.maxLength(150)
            ]),
          );
          break;
        case 1:
            this.type = 'email';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basic ? [
                Validators.email
              ]
              : [
                Validators.required,
                Validators.email
              ]),
            );
            break;
        case 2:
            this.type = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basic ? [
                Validators.minLength(2),
                Validators.maxLength(150),
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(150),
              ]),
            );
            this.form.setControl(
              'campo2', new FormControl(this.Valor(1),
              this.value.basic ? [
                Validators.minLength(2),
                Validators.maxLength(150),
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(150),
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
                Validators.maxLength(150),
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(150),
              ]),
            );
            this.form.setControl(
              'campo2', new FormControl(this.Valor(1),
              this.value.basic ? [
                Validators.minLength(2),
                Validators.maxLength(150),
              ]
              : [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(150),
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
      console.log(this.itemType);
      this.form.setControl(
        'selector', new FormControl(null, Validators.required),
      );
    }
    this.dataLoad = true;
  }

  async BuscarTItem() {
    try {
      if (this.value) {
        this.itemType = await this.profilesServices.BuscarTipoItem(this.value.itemtype);
        if (this.itemType) {
          this.AggCampoForm();
          this.BuscarTItems(this.itemType.category);
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
        this.tiposItems = await this.profilesServices.BuscarTItemCategoria(idCategoria);
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
    this.EliminarUnico();
    this.eliminar.emit(this.value);
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
      this.cambio.emit(true);
      this.EliminarUnico();
      this.itemType = null;
      this.onChange(this.value);
      this.AggCampoForm();
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
    this.cambio.emit(true);
  }

  ValorChip(valor) {
    this.value.value = this.chipArray.join(',');
    this.value.value = this.value.value + valor;
    (this.form.controls.campo1 as FormControl).markAsTouched();
  }

  Unicos(tipoItem: ItemType): boolean {
    return this.unique.indexOf(tipoItem._id) === -1 ? false : true;
  }

  AggUnico() {
    // console.log('lista', this.unique);
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
        this.form.get('selector').hasError('required') && this.form.get('selector').touched ?
        this.errorMessage = MessageError.REQUERIDO : this.errorMessage = null;
      } else {
        if (this.form.get('campo1') && this.form.get('campo1').errors && this.form.get('campo1').touched ) {
          if (this.form.get('campo1').hasError('required')) {
            this.errorMessage = MessageError.REQUERIDO;
          } else if (this.form.get('campo1').hasError('email')) {
            this.errorMessage = MessageError.EMAIL;
          } else if (this.form.get('campo1').hasError('pattern')) {
            this.errorMessage = MessageError.URL;
          } else if (this.form.get('campo1').hasError('minlength')) {
            if (this.itemType.index === 6 || this.itemType.index === 8) {
              this.errorMessage = MessageError.MINIMO3;
            } else {
              this.errorMessage = MessageError.MINIMO2;
            }
          } else if (this.form.get('campo1').hasError('maxlength')) {
            this.errorMessage = MessageError.MAXIMO;
          }
        } else  if (this.form.get('campo2') && this.form.get('campo2').touched) {
          if (this.form.get('campo2').hasError('required')) {
            this.errorMessage = MessageError.REQUERIDO;
          } else if (this.form.get('campo2').hasError('minlength')) {
            this.errorMessage = MessageError.MINIMO2;
          } else if (this.form.get('campo2').hasError('maxlength')) {
            this.errorMessage = MessageError.MAXIMO;
          }
        }
      }
    } catch (err) {
      this.errorMessage = null;
    }
  }

}
