'use strict';
const jsonFile = require('./coverage.json');
const moment = require('moment');

const Financial = require('./Financial');
/*
* Class that handles the data necessary to create a quotation
*/
class Quotation extends Financial{

  constructor() {
    super();
    this.coverage = jsonFile;
    this.totalPrize = 0;
    this.totalCoverage = 0;
    this.parcels = 1;
  }

  // Check if the person has more than 18 years old
  isMoreThan18YearsOld(birthDate, presentDate) {
    if (presentDate === undefined) {
      presentDate = new Date();
      presentDate.setHours(0);
      presentDate.setMinutes(0);
      presentDate.setSeconds(0);
    }
    const ageFromDate = moment(presentDate).diff(moment(birthDate), 'years');
    return (ageFromDate >= 18);
  }

  // Calc the maximun amount of installments for a prize
  hasMandatoryCoverage(coverageRequested) {
    let haveMandatory = false;
    if ((coverageRequested != null) && (coverageRequested.length > 0)) {
      coverageRequested.forEach(cr => {
        const idRequested = cr;
        const tempCoverageoRequested = this.coverage.find(element => {
          return (element.id === idRequested);
        });
        if (tempCoverageoRequested && (tempCoverageoRequested.principal === 'S')) haveMandatory = true;
      });
    }
    return haveMandatory;
  }

  // It sums all the coverage values requested
  sumIndividualCoverage(coverageRequested) {
    let sum = 0;
    if ((coverageRequested != null) && (coverageRequested.length > 0)) {
      coverageRequested.forEach(cr => {
        const idRequested = cr;
        const tempCoverageRequested = this.coverage.find(element => {
          return (element.id === idRequested);
        });
        if (tempCoverageRequested.valor) sum += tempCoverageRequested.valor;
      });
    }
    this.totalCoverage = sum;
    return sum;
  }

  // It sums all the coverage values requested
  sumIndividualPrize(prizeRequested) {
    let sum = 0;
    if ((prizeRequested != null) && (prizeRequested.length > 0)) {
      prizeRequested.forEach(cr => {
        const idRequested = cr;
        const tempCoverageoRequested = this.coverage.find(element => {
          return (element.id === idRequested);
        });
        if (tempCoverageoRequested.premio) sum += tempCoverageoRequested.premio;
      });
    }
    this.totalPrize = sum;
    return sum;
  }

  amountOfPayments() {
    this.parcels = super.maxAmountOfPayments(this.totalPrize);
    return this.parcels;
  }

  calcPrizeWithDiscounts(prizeRequested, age) {
    this.sumIndividualPrize(prizeRequested);
    // Add discounts or additions to the prize
    this.totalPrize = this.totalPrize * (1 + super.calcDiscountAddition(age));
    // Format the prize to 2 decimals
    this.totalPrize = Math.round(this.totalPrize * 100) / 100;
    return this.totalPrize;
  }

  calcParcelValue() {
    const pmt = this.totalPrize / this.parcels;
    return pmt;
  }

}

module.exports = new Quotation();
