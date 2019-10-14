import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { InformacionPerfilService } from 'src/app/servicios/informacion-perfil.service';
import { Categoria } from 'src/app/modelos/Categoria.model';
import { TipoItem } from 'src/app/modelos/TipoItem.model';
import { ValorTI } from 'src/app/modelos/ValorTI.model';
import { Item } from 'src/app/modelos/Item.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl,
   NG_VALIDATORS, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { Error } from 'src/app/modelos/Error.enum';

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
  @Input()  form: FormGroup;
  @Output() eliminar = new EventEmitter();

  prefijoIcono: string;
  iconoValor: string;
  value: Item;
  tipoItem: TipoItem;
  personalizado: string;
  isDisabled: boolean;
  tipo = 'text';

  categorias: Categoria[] = [];
  tiposItems: TipoItem[] = [];
  valoresTI: ValorTI[] = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @Input() chipInput: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  chipArray: string[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim() && value.length > 2 && this.value.valor.length < 31) {
      this.chipArray.push(value.trim());
      this.value.valor = this.chipArray.join(',');
      if (input) {
        input.value = '';
      }
    }
    (this.form.controls.campo1 as FormControl).markAsTouched();
  }

  remove(fruit: any): void {
    const index = this.chipArray.indexOf(fruit);

    if (index >= 0) {
      this.chipArray.splice(index, 1);
      this.value.valor = this.chipArray.join(',');
    }
  }

  constructor(
    private informacionPerfilService: InformacionPerfilService,
  ) {
  }

  ngOnInit() {
  }

  onChange = (_: Item) => { };
  onTouch = (_: Item) => { };

  writeValue(obj: Item): void {
    console.log('obj', obj);
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

  CargarItem() {
    if (this.value.valor === '' || this.value.valor) {
      this.BuscarTItem();
      this.BuscarValoresTI();
    } else {
      this.BuscarTItems(this.value.id_categoria);
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
    if (this.tipoItem) {
      switch (this.tipoItem.tipo) {
        case 0:
          this.tipo = 'text';
          this.form.setControl(
            'campo1', new FormControl(this.Valor(0),
            this.value.basico ? [
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
            this.tipo = 'email';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basico ? [
                Validators.email
              ]
              : [
                Validators.required,
                Validators.email
              ]),
            );
            break;
        case 2:
            this.tipo = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basico ? [
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
              this.value.basico ? [
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
            this.tipo = 'url';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basico ? [
                Validators.pattern(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)
              ]
              : [
                Validators.required,
                Validators.pattern(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)
              ]),
            );
            break;
        case 4:
            this.tipo = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basico ? [] :
              [
                Validators.required,
              ]),
            );
            break;
        case 5:
            this.tipo = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basico ? [] :
              [
                Validators.required,
              ]),
            );
            break;
        case 6:
            this.tipo = 'number';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basico ? [
                Validators.minLength(3)
              ]
              : [
                Validators.required,
                Validators.minLength(3)
              ]),
            );
            break;
        case 7:
            this.tipo = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basico ? [
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
              this.value.basico ? [
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
            this.tipo = 'text';
            this.form.setControl(
              'campo1', new FormControl(this.Valor(0),
              this.value.basico ? [
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
      this.tipoItem = this.informacionPerfilService.BuscarTipoItem(this.value.id_tipoitem);
      this.BuscarTItems(this.tipoItem.id_categoria);
    }
    this.CargarIcono();
  }

  BuscarTItems(idCategoria: string) {
    this.tiposItems = this.informacionPerfilService.BuscarTItemCategoria(idCategoria);
    // console.log('tiposItems', this.tiposItems);
  }

  SelecionarTipoItem(event: TipoItem) {
    this.tipoItem = event;
    this.value.id_tipoitem =  event.id;
    this.value.valor  = '';
    this.BuscarValoresTI();
    this.AggCampoForm();
      // this.onChange(this.value);
  }

  BuscarValoresTI() {
    if (this.tipoItem && this.tipoItem.tipo === 4) {
      this.valoresTI =  this.informacionPerfilService.BuscarValoresTipoItem(this.tipoItem.id);
    }
    this.CargarIcono();
  }

  CargarIcono() {
    if (this.tipoItem) {
      const valores = this.tipoItem.icono.split(' ');
      this.prefijoIcono = valores[0];
      this.iconoValor = valores[1];
    }
  }

  Eliminar() {
    this.eliminar.emit(this.value);
  }

  FechaActual() {
    return new Date();
  }

  MarcaAgua(campo: number) {
    switch (this.tipoItem.tipo) {
      case 2:
        return campo === 0 ? 'Puesto' : 'Empresa';
      case 7:
        return campo === 0 ? 'Título' : 'Valor';
      default:
        return this.tipoItem.descripcion;
    }
  }

  Valor(campo: number): string {
    switch (campo) {
      case 0:
        return this.value.valor;
      case 1:
        return this.value.personalizado;
    }
  }

  MostrarSelector() {
    if (!this.value.basico) {
      this.tipoItem = null;
      this.onChange(this.value);
      this.AggCampoForm();
    }
  }

  onInput(value: string, campo: number) {
    switch (campo) {
      case 0:
        this.value.valor = value;
        break;
      case 1:
        this.value.personalizado = value;
        break;
    }
    this.onTouch(this.value);
    this.onChange(this.value);
  }

  ValorChip(valor) {
    this.value.valor = this.chipArray.join(',');
    this.value.valor = this.value.valor + valor;
    (this.form.controls.campo1 as FormControl).markAsTouched();
  }

  MensajeError() {
    if (!this.tipoItem) {
      return this.form.get('selector').hasError('required') && this.form.get('selector').touched ? Error.REQUERIDO : null;
    } else {
      if (this.form.get('campo1').errors && this.form.get('campo1').touched ) {
        if (this.form.get('campo1').hasError('required')) {
          return Error.REQUERIDO;
        } else if (this.form.get('campo1').hasError('email')) {
          return Error.EMAIL;
        } else if (this.form.get('campo1').hasError('pattern')) {
          return Error.URL;
        } else if (this.form.get('campo1').hasError('minlength')) {
          if (this.tipoItem.tipo === 6 || this.tipoItem.tipo === 8) {
            return Error.MINIMO3;
          } else {
            return Error.MINIMO2;
          }
        } else if (this.form.get('campo1').hasError('maxlength')) {
            return Error.MAXIMO;
        }
      } else  if (this.form.get('campo2') && this.form.get('campo2').touched) {
        if (this.form.get('campo2').hasError('required')) {
          return Error.REQUERIDO;
        } else if (this.form.get('campo2').hasError('minlength')) {
          return Error.MINIMO2;
        } else if (this.form.get('campo2').hasError('maxlength')) {
          return Error.MAXIMO;
        }
      }
    }
  }

}
