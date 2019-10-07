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
  @Input() posicion;
  @Input() public item: Item;
  valor: string;
  valor2: string;
  selecionado = false;
  @Output() eliminar = new EventEmitter();
  eventoCambio = new Subscription();
  value: Item;
  isDisabled: boolean;

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
    this.CargarItem(obj);
  }
  registerOnChange(fn: any): void {
    console.log('registerOnChange', fn);
    // throw new Error('Method not implemented.');
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    console.log('registerOnTouched', fn);
    // throw new Error('Method not implemented.');
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    console.log('setDisabledState', isDisabled);
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
    console.log('control: ', control);
    return null; /*{item: {
      valid: true,
      },
    };*/
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
    this.itemForm = this.formBuilder.group({
      campo: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    // this.item.posicion = this.posicion;
  }

  BuscarTItem() {
    if (this.value) {
      this.tipoItem = this.informacionPerfilService.BuscarTipoItem(this.value.id_tipoitem);
      this.BuscarTItems(this.tipoItem.id_categoria);
      console.log('tiposItem', this.tipoItem);
    }
  }

  BuscarTItems(idCategoria: number) {
    this.tiposItems = this.informacionPerfilService.BuscarTItemCategoria(idCategoria);
    console.log('tiposItems', this.tiposItems);
  }

  BuscarValoresTI(event) {
    this.AlmacenarValores();
    this.selecionado = true;
    this.value.id = 0;
    console.log(this.tipoItem);
    if (this.tipoItem && this.tipoItem.tipo === 1) {
      this.valoresTI = this.informacionPerfilService.BuscarValoresTipoItem(this.tipoItem.id);
    }
    this.onInput(event.target.value);
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

  MostrarSelector() {
    this.selecionado = false;
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

  onInput(value: string) {
    console.log('Valor: ', value);
    this.valor = value;
    this.value.valor = this.valor;
    this.onTouch(this.value);
    this.onChange(this.value);
  }

}
