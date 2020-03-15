import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { QuotationService } from './quotation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = false;
  resposta = false;
  // Response data
  premio = '0.00';
  parcelas = 0;
  valorParcelas = '0.00';
  primeiroVencimento = '';
  coberturaTotal = '0.00';

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
          this.valorParcelas = parseFloat(response.cotacao.response.valor_parcelas).toFixed(2);
          this.primeiroVencimento = response.cotacao.response.primeiro_vencimento;
          this.coberturaTotal = parseFloat(response.cotacao.response.cobertura_total).toFixed(2);
        }
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.statusSub.unsubscribe();
  }

  onPost(form: NgForm, event) {
    event.preventDefault();
    const coberturas = [];
    if (form.invalid) {
      return;
    }
    for (let i = 1; i <= 10; i++) {
      const formattedNumber = ('0' + i).slice(-2);
      if (form.value[formattedNumber] === true) { coberturas.push(formattedNumber); }
    }
    this.isLoading = true;
    this.quotationService.price(
        form.value.name,
        form.value.nascimento,
        form.value.logradouro,
        form.value.bairro,
        form.value.cep,
        form.value.cidade,
        coberturas
      );
    return;
  }

  voltar() {
    this.resposta = false;
  }

}
