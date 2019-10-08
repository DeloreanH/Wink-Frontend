import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, forwardRef } from '@angular/core';
import { InformacionPerfilService } from 'src/app/servicios/informacion-perfil.service';
import { Categoria } from 'src/app/modelos/Categoria.model';
import { TipoItem } from 'src/app/modelos/TipoItem.model';
import { ValorTI } from 'src/app/modelos/ValorTI.model';
import { Item } from 'src/app/modelos/Item.model';
import { Subscription } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl,
   NG_VALIDATORS, Validator, FormBuilder, Validators } from '@angular/forms';

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
export class ItemPerfilComponent implements ControlValueAccessor, OnInit, Validator {

  @Input() ordenando;
  @Input() categoria;
  @Input() seccion;
  @Input() tipo;
  @Input()  item: Item;
  valor: string;
  valor2: string;
  selecionado = false;
  prefijoIcono: string;
  iconoValor: string;
  @Output() eliminar = new EventEmitter();
  value: Item;
  isDisabled: boolean;

  entrada = true;

  @Input()  form: FormGroup;

  errors;
  valido: boolean;

  categorias: Categoria[] = [];
  tiposItems: TipoItem[] = [];
  valoresTI: ValorTI[] = [];
  tipoItem: TipoItem;
  personalizado: string;

  itemForm: FormGroup;


  onChange = (_: Item) => { };
  onTouch = (_: Item) => { };

  writeValue(obj: Item): void {
    // throw new Error('Method not implemented.');

      console.log('writeValue', obj);
      if (obj) {
        this.value = obj || null;
      } else {
        this.value = null;
      }
      this.onChange(this.value);
      this.CargarItem(obj);
  }
  registerOnChange(fn: any): void {
    // console.log('registerOnChange', fn);
    // throw new Error('Method not implemented.');
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    // console.log('registerOnTouched', fn);
    // throw new Error('Method not implemented.');
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // console.log('setDisabledState', isDisabled);
    // throw new Error('Method not implemented.');
    this.isDisabled = isDisabled;
  }

  CargarItem(item: Item) {
    if (item.id >= 0) {
      this.selecionado = true;
      this.valor = this.value.valor;
      this.BuscarTItem();
    } else {
      this.valor = this.value.valor;
      this.BuscarTItems(item.id_categoria);
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
    console.log('registerOnValidatorChange', fn);
    this.onChange = fn;
    // throw new Error('Method not implemented.');
  }

  constructor(
    private informacionPerfilService: InformacionPerfilService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    // this.item.posicion = this.posicion;
    console.log('Aquiiiiiii', this.form);
    /*this.form.setControl(
      'campo1', new FormControl('', [Validators.required
        , Validators.minLength(5)]),
    );*/
    this.AggCampoForm();
  }

  AggCampoForm() {
    if (this.tipoItem) {
      this.form.removeControl('selector');
      switch (this.tipoItem.tipo) {
        case 0:
          this.form.setControl(
            'campo1', new FormControl('', [Validators.required
              , Validators.minLength(5)]),
          );
          break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            break;
        case 7:
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
      // console.log('tiposItem', this.tipoItem);
    }
    this.CargarIcono();
  }

  BuscarTItems(idCategoria: number) {
    this.tiposItems = this.informacionPerfilService.BuscarTItemCategoria(idCategoria);
    // console.log('tiposItems', this.tiposItems);
  }

  async BuscarValoresTI(event: TipoItem) {
    // this.AlmacenarValores();
    console.log('BuscarValoresTI event', event);
    console.log('BuscarValoresTI tipoItem', this.tipoItem);
    this.tipoItem = event;
    this.selecionado = true;
    this.value.id = 0;
    this.value.id_tipoitem = await event.id;
    console.log('BuscarValoresTI tipoItem', this.tipoItem, this.value);
    // console.log(this.tipoItem);
    if (this.tipoItem && this.tipoItem.tipo === 4) {
      this.valoresTI =  this.informacionPerfilService.BuscarValoresTipoItem(this.tipoItem.id);
    }
    this.AggCampoForm();
    this.onChange(this.value);
    this.CargarIcono();
    // this.onInput(event.target.value);
  }

  CargarIcono() {
    console.log('tipoItem: ', this.tipoItem);
    if (this.tipoItem) {
      const valores = this.tipoItem.icono.split(' ');
      this.prefijoIcono = valores[0];
      this.iconoValor = valores[1];
    }
  }

  Eliminar() {
    this.eliminar.emit(this.item);
  }

  FechaActual() {
    return new Date();
  }

  MarcaAgua(campo: number) {
    switch (campo) {
      case 0:
        return this.tipoItem.tipo !== 2 ? this.tipoItem.descripcion : 'Puesto';
      case 1:
        return this.tipoItem.tipo !== 2 ? this.tipoItem.descripcion : 'Empresa';
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
    this.tipoItem = null;
    this.selecionado = false;
    this.onChange(this.value);
  }

  AlmacenarValores() {
    if (this.tipoItem) {
      this.value.id_tipoitem = this.tipoItem.id;
      if (this.tipoItem.tipo === 2) {
        this.value.valor = this.valor + '-' + this.valor2;
      } else {
        this.value.valor = this.valor;
      }
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
    // console.log('Valor: ', value);
    // console.log('Valor: ', this.value);
    this.onTouch(this.value);
    this.onChange(this.value);
  }

}
