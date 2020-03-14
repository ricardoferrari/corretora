'use strict';
const quotation = require('../models/Quotation');
// const financial = require('../models/Financial');
const address = require('../models/Address');

class QuotationController {

  async price(req, res) {
    try {
      const { nascimento, endereco, coberturas } = req.body.request;
      const day = nascimento.split('/')[0];
      const month = nascimento.split('/')[1];
      const year = nascimento.split('/')[2];
      const birthDate = new Date(year + '-' + month + '-' + day);

      console.log(coberturas);
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
      if (coberturas.length >= 4) {
        res.status(400).json({
          message: 'Número máximo de coberturas excedido!',
        });
        return;
      }

      res.status(200).json({
        response: {
          premio: 800,
          parcelas: 3,
          valor_parcelas: 266.67,
          primeiro_vencimento: '05/09/2019',
          cobertura_total: 180000,
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
