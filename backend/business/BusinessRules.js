'use strict';
const moment = require('moment');

const quotation = require('../models/Quotation');
const address = require('../models/Address');
const status = require('../commons/status-code');
const dateFormats = require('../commons/date-formats');

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
    const day = this.nascimento.split(dateFormats.separatorSlash)[0];
    const month = this.nascimento.split(dateFormats.separatorSlash)[1];
    const year = this.nascimento.split(dateFormats.separatorSlash)[2];
    const birthDate = new Date(year + dateFormats.separatorDash + month + dateFormats.separatorDash + day);
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
    this.vencimento = moment(quotation.next5thBusinessDay(presentDate)).format(dateFormats.dayMonthYear);

    // Checks if the person has more than 18 years old
    if (!quotation.isMoreThan18YearsOld(birthDate)) {
      return {status: status.BAD_REQUEST, message: 'É necessário possuir mais de 18 anos!'};
    }

    // Checks if the city is valid
    if (!(await address.isValidCity(this.endereco.cidade))) {
      return {status: status.BAD_REQUEST, message: 'Cidade não cadastrada!'};
    }

    // Checks if the CEP is valid
    if (!(await address.isValidCEP(this.endereco.cep))) {
      return {status: status.BAD_REQUEST, message: 'CEP inválido!'};
    }

    // Checks if there is one mandatory coverage present
    if (!quotation.hasMandatoryCoverage(this.coberturas)) {
      return {status: status.BAD_REQUEST, message: 'Cobertura obrigatória inexistente!'};
    }

    // Max number of coverages excedded
    if (this.coberturas.length > 4) {
      return {status: status.BAD_REQUEST, message: 'Número máximo de coberturas excedido!'};
    }

    return {status: status.OK};
  }
}

module.exports = BusinessRules;
