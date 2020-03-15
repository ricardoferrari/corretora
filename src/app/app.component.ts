import { QuotationService } from './quotation.service';
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { QuotationService } from "./quotation.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoading = false;
  pergunta = true;
  
  constructor(public quotationService: QuotationService) {}

  onPost(form: NgForm) {
    var coberturas = [];
    console.log(form.value);
    if (form.invalid) {
      return;
    }
    for (var i =1; i<=10; i++) {
      var formattedNumber = ("0" + i).slice(-2);
      if (form.value[formattedNumber] === true) coberturas.push(formattedNumber);
    }
    console.log(coberturas);
    this.isLoading = true;
    this.quotationService.price(form.value.name, form.value.nascimento);
  }

}
