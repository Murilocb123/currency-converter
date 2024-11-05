import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { PanelModule } from 'primeng/panel';
import { AwesomeapiMoedasService } from '../../services/awesomeapi-moedas';
import { MoedaDTO } from '../../dto/moeda-dto';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [PanelModule, AvatarModule, DropdownModule, FormsModule,ReactiveFormsModule,
     InputNumberModule, ButtonModule, RippleModule, FloatLabelModule,ProgressSpinnerModule, CommonModule,
     DividerModule, IconFieldModule, InputIconModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css',
  providers: [AwesomeapiMoedasService]
})
export class ConverterComponent  implements OnInit {

  public formGroup: FormGroup;

  public moedasIn: any[];

  public moedasOut: any[];

  public disabledTaxaCambio:boolean = false;

  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  private resultSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public result$: Observable<number> = this.resultSubject.asObservable();



  constructor(
    private readonly awesomeapiMoedasService: AwesomeapiMoedasService,
    private formBuilder: FormBuilder,
  ) {
    console.log('ConverterComponent created ');
    this.formGroup = this.getFormGroup();
    this.moedasIn = this.getMoedaInDropdown();
    console.log(this.moedasIn);
    this.moedasOut = [];
  }

  ngOnInit() {
    console.log(this.awesomeapiMoedasService.getMoedas(null));
  }

  private getFormGroup(): FormGroup {
    return this.formBuilder.group({
      moedaIn: [{ value: null, disabled: false }, Validators.compose([Validators.required])],
      moedaOut: [{ value: null, disabled: false }, Validators.compose([Validators.required])],
      taxaCambio: [{ value: null, disabled: false }, Validators.compose([Validators.required, Validators.min(0)])],
      valorIn: [{ value: null, disabled: false }, Validators.compose([Validators.required, Validators.min(0.1)])],
    });
  }

  public onMoedaInChange(): void {
    console.log('onMoedaInChange');
    this.moedasOut = this.getMoedaOutDropdown(this.formGroup.get('moedaIn')?.value.key);
  }

  public getMoedaInDropdown(): any[] {
    return this.awesomeapiMoedasService.getMoedas(null).map((moeda) => {
      return {
        value: moeda.description,
        key: moeda.token
      };
    });
  }

  public getMoedaOutDropdown(moedaIn:string): any[] {
    return this.awesomeapiMoedasService.getMoedas(moedaIn).map((moeda) => {
      return {
        value: moeda.description,
        key: moeda.token
      };
    });
  }

  public convert(): void {

    console.log('convert');
    const funcConverterMoeda = (valor: number, taxaCambio: number) => {
      return valor * taxaCambio;
    }
    const valorIn = this.formGroup.get('valorIn')?.value;
    const taxaCambio = this.formGroup.get('taxaCambio')?.value;

    this.resultSubject.next(funcConverterMoeda(valorIn, taxaCambio));
  }

  public updateTaxaCambio(): void {
    this.isLoadingSubject.next(true);
    this.disabledTaxaCambio = true;
    console.log('updateTaxaCambio');
    const moedasIn = this.formGroup.get('moedaIn')?.value.key;
    const moedasOut = this.formGroup.get('moedaOut')?.value.key;
    if(moedasIn && moedasOut) {

      this.awesomeapiMoedasService.getCotacao(moedasIn, moedasOut)
      .subscribe((cotacao) => {
        console.log(cotacao);
        console.log('---updateTaxaCambio---');
        this.formGroup.get('taxaCambio')?.setValue(cotacao);
        this.isLoadingSubject.next(false);
        this.disabledTaxaCambio = false;
      });
    }
  }
}
