'use strict';
const moment = require('moment');

const quotation = require('../models/Quotation');
const address = require('../models/Address');

class BusinessRules {

  constructor(nascimento, endereco, coberturas) {
    this.totalCoverage = 0;
    this.totalPrize = 0;
    this.n = 0;
    this.pmt = 0;
    this.vencimento = '';
    this.nascimento = nascimento;
    this.endereco = endereco;
    this.coberturas = coberturas;
  }

  // Checks all business constraints and return a error response if needed
  async check() {
    const day = this.nascimento.split('/')[0];
    const month = this.nascimento.split('/')[1];
    const year = this.nascimento.split('/')[2];
    const birthDate = new Date(year + '-' + month + '-' + day);
    let presentDate = new Date();
    presentDate.setHours(0);
    presentDate.setMinutes(0);
    presentDate.setUTCMilliseconds(0);

    // Variables needed for the response
    const ageFromDate = moment(presentDate).diff(moment(birthDate), 'years');
    this.totalCoverage = quotation.sumIndividualCoverage(this.coberturas);
    this.totalPrize = quotation.calcPrizeWithDiscounts(this.coberturas, ageFromDate);
    this.n = quotation.amountOfPayments();
    this.pmt = quotation.calcParcelValue();
    this.vencimento = moment(quotation.next5thBusinessDay(presentDate)).format('DD/MM/YYYY');

    // Checks if the person has more than 18 years old
    if (!quotation.isMoreThan18YearsOld(birthDate)) {
      return {status: 400, message: 'É necessário possuir mais de 18 anos!'};
    }

    // Checks if the city is valid
    if (!(await address.isValidCity(this.endereco.cidade))) {
      return {status: 400, message: 'Cidade não cadastrada!'};
    }

    // Checks if the CEP is valid
    if (!(await address.isValidCEP(this.endereco.cep))) {
      return {status: 400, message: 'CEP inválido!'};
    }

    // Checks if there is one mandatory coverage present
    if (!quotation.hasMandatoryCoverage(this.coberturas)) {
      return {status: 400, message: 'Cobertura obrigatória inexistente!'};
    }

    // Max number of coverages excedded
    if (this.coberturas.length > 4) {
      return {status: 400, message: 'Número máximo de coberturas excedido!'};
    }

    return {status: 200};
  }
}

module.exports = BusinessRules;
