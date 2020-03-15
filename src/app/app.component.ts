import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { QuotationService } from "./quotation.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  resposta: boolean = false;
  // Response data
  premio:string = '0.00';
  parcelas:number = 0;
  valor_parcelas:string = '0.00';
  primeiro_vencimento: string = '';
  cobertura_total:string = '0.00';

  private statusSub: Subscription;
  
  constructor(public quotationService: QuotationService) {}

  ngOnInit() {
    this.statusSub = this.quotationService.getStatusListener().subscribe(
      response => {
        // When there are no errors proceed
        if (response.cotacao !== null) {
          this.resposta = response.status;
          this.premio = parseFloat(response.cotacao.response.premio).toFixed(2);
          this.parcelas = response.cotacao.response.parcelas;
          this.valor_parcelas = parseFloat(response.cotacao.response.valor_parcelas).toFixed(2);
          this.primeiro_vencimento = response.cotacao.response.primeiro_vencimento;
          this.cobertura_total = parseFloat(response.cotacao.response.cobertura_total).toFixed(2);
        }
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.statusSub.unsubscribe();
  }

  onPost(form: NgForm) {
    var coberturas = [];
    // if (form.invalid) {
    //   return;
    // }
    for (var i =1; i<=10; i++) {
      var formattedNumber = ("0" + i).slice(-2);
      if (form.value[formattedNumber] === true) coberturas.push(formattedNumber);
    }
    this.isLoading = true;
    this.quotationService.price(form.value.name, form.value.nascimento, form.value.logradouro, form.value.bairro, form.value.cep, form.value.cidade, coberturas);
  }

  voltar() {
    this.resposta = false;
  }

}
