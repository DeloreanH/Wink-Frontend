import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { InformacionPerfilService } from 'src/app/servicios/informacion-perfil.service';
import { Category } from 'src/app/modelos/category.model';
import { ItemType } from 'src/app/modelos/itemType.model';
import { Item } from 'src/app/modelos/item.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl,
   NG_VALIDATORS, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { MessageError } from 'src/app/modelos/messageError.enum';

@Component({
  selector: 'app-item-perfil',
  templateUrl: './item-perfil.component.html',
  styleUrls: ['./item-perfil.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItemPerfilComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ItemPerfilComponent),
      multi: true,
    }
  ]
})
export class ItemPerfilComponent implements ControlValueAccessor, OnInit {

  @Input() ordenando;
  @Input() form: FormGroup;
  @Output() eliminar = new EventEmitter();
  @Input() chipInput: any;

  preIcono: string;
  icon: string;
  value: Item;
  itemType: ItemType;
  isDisabled: boolean;
  type = 'text';
  focus = false;

  tiposItems: ItemType[] = [];
  unique: string[] = [];
  chipArray: string[] = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private informacionPerfilService: InformacionPerfilService,
  ) {
    this.unique = this.informacionPerfilService.unique;
  }

  ngOnInit() {
  }

  onChange = (_: Item) => { };
  onTouch = (_: Item) => { };

  writeValue(obj: Item): void {
    // console.log('obj', obj);
    if (obj) {
      this.value = obj;
      // this.onChange(this.value);
      this.CargarItem();
      this.AggCampoForm();
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

  AggChip(event: MatChipInputEvent): void {
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

  RemoverChip(fruit: any): void {
    const index = this.chipArray.indexOf(fruit);
    if (index >= 0) {
      this.chipArray.splice(index, 1);
      this.value.value = this.chipArray.join(',');
    }
  }

  CargarItem() {
    if (this.value.value === '' || this.value.value) {
      this.BuscarTItem();
    } else {
      this.BuscarTItems(this.value.category_id);
    }
  }

  validate(control: import('@angular/forms').AbstractControl): import('@angular/forms').ValidationErrors {
     // throw new Error('Method not implemented.');

    // tslint:disable-next-line: triple-equals
    /* console.log('this.selecionado', this.selecionado);
    console.log('control validate: ', control);
    if (!this.selecionado) {
      this.errors = 'Debe seleccionar una opcion';
      return {
        message : 'Debe seleccionar una opcion'
      };
    }
    switch (this.tipoItem.tipo) {
      case 0:
        console.log(control);
        if (this.value.valor.length < 2) {
          this.errors = 'Cantidad minima de caracteres: 2';
          return  {message : 'Cantidad minima de caracteres: 2'};
        }
        if (this.value.valor.length > 150) {
          this.errors = 'Cantidad maxima de caracteres: 150';
          return  {message : 'Cantidad maxima de caracteres: 150'};
        }
        this.errors = null;
        return null;
      case 1:
        this.errors = null;
        return null;
      case 2:
        this.errors = null;
        return null;
      case 3:
        this.errors = null;
        return null;
      case 4:
        this.errors = null;
        return null;
      case 5:
        this.errors = null;
        return null;
      case 6:
        this.errors = null;
        return null;
      case 7:
        this.errors = null;
        return null;
    }*/
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onChange = fn;
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
      this.form.setControl(
        'selector', new FormControl(null, Validators.required),
      );
    }
  }

  BuscarTItem() {
    if (this.value) {
      this.itemType = this.informacionPerfilService.BuscarTipoItem(this.value.itemType_id);
      console.log('Aquiii', this.informacionPerfilService.BuscarTipoItem(this.value.itemType_id), this.value );
      this.BuscarTItems(this.itemType.category_id);
    }
    this.CargarIcono();
  }

  BuscarTItems(idCategoria: string) {
    this.tiposItems = this.informacionPerfilService.BuscarTItemCategoria(idCategoria);
    // console.log('tiposItems', this.tiposItems);
  }

  SelecionarTipoItem(event: ItemType) {
    this.itemType = event;
    this.AggUnico();
    this.value.itemType_id =  event._id;
    this.value.value  = '';
    this.CargarIcono();
    this.AggCampoForm();
      // this.onChange(this.value);
  }


  CargarIcono() {
    if (this.itemType) {
      const valores = this.itemType.icon.split(' ');
      this.preIcono = valores[0];
      this.icon = valores[1];
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
    if (this.unique.indexOf(this.itemType._id) === -1) {
      this.unique.push(this.itemType._id);
    }
  }

  EliminarUnico() {
    const index = this.unique.indexOf(this.itemType._id);
    if (index !== -1) {
      this.unique.splice(index);
    }
  }

  Focus(valor: boolean) {
    this.focus = valor;
  }

  MensajeError() {
    if (!this.itemType) {
      return this.form.get('selector').hasError('required') && this.form.get('selector').touched ? MessageError.REQUERIDO : null;
    } else {
      if (this.form.get('campo1').errors && this.form.get('campo1').touched ) {
        if (this.form.get('campo1').hasError('required')) {
          return MessageError.REQUERIDO;
        } else if (this.form.get('campo1').hasError('email')) {
          return MessageError.EMAIL;
        } else if (this.form.get('campo1').hasError('pattern')) {
          return MessageError.URL;
        } else if (this.form.get('campo1').hasError('minlength')) {
          if (this.itemType.index === 6 || this.itemType.index === 8) {
            return MessageError.MINIMO3;
          } else {
            return MessageError.MINIMO2;
          }
        } else if (this.form.get('campo1').hasError('maxlength')) {
            return MessageError.MAXIMO;
        }
      } else  if (this.form.get('campo2') && this.form.get('campo2').touched) {
        if (this.form.get('campo2').hasError('required')) {
          return MessageError.REQUERIDO;
        } else if (this.form.get('campo2').hasError('minlength')) {
          return MessageError.MINIMO2;
        } else if (this.form.get('campo2').hasError('maxlength')) {
          return MessageError.MAXIMO;
        }
      }
    }
  }

}
