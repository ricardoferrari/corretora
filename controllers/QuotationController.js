'use strict';
const moment = require('moment');
const {AgeFromDate} = require('age-calculator');

const quotation = require('../models/Quotation');
const address = require('../models/Address');

class QuotationController {

  async price(req, res) {
    try {
      const { nascimento, endereco, coberturas } = req.body.request;
      const day = nascimento.split('/')[0];
      const month = nascimento.split('/')[1];
      const year = nascimento.split('/')[2];
      const birthDate = new Date(year + '-' + month + '-' + day);
      const presentDate = new Date('2020-3-28');

      // Checks if the person has more than 18 years old
      if (!quotation.isMoreThan18YearsOld(birthDate)) {
        res.status(400).json({
          message: 'É necessário possuir mais de 18 anos!',
        });
        return;
      }

      // Checks if the city is valid
      if (!(await address.isValidCity(endereco.cidade))) {
        res.status(400).json({
          message: 'Cidade não cadastrada!',
        });
        return;
      }

      // Checks if the CEP is valid
      if (!(await address.isValidCEP(endereco.cep))) {
        res.status(400).json({
          message: 'CEP inválido!',
        });
        return;
      }

      // Checks if there is one mandatory coverage present
      if (!quotation.hasMandatoryCoverage(coberturas)) {
        res.status(400).json({
          message: 'Cobertura obrigatória inexistente!',
        });
        return;
      }

      // Max number of coverages excedded
      if (coberturas.length > 4) {
        res.status(400).json({
          message: 'Número máximo de coberturas excedido!',
        });
        return;
      }

      const totalCoverage = quotation.sumIndividualCoverage(coberturas);
      const ageFromDate = new AgeFromDate(birthDate).age;
      const totalPrize = quotation.calcPrizeWithDiscounts(coberturas, ageFromDate);
      const n = quotation.amountOfPayments();
      const pmt = quotation.calcParcelValue();

      res.status(200).json({
        response: {
          premio: totalPrize,
          parcelas: n,
          valor_parcelas: pmt,
          primeiro_vencimento: moment(quotation.next5thBusinessDay(presentDate)).format('DD/MM/YYYY'),
          cobertura_total: totalCoverage,
        },
      });

    } catch (err) {
      res.status(500).json({
        message: 'Falha ao calcular cotação!',
        error: err.message,
      });
    }

  }

}

module.exports = new QuotationController();
