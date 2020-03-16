'use strict';
const BusinessRules = require('../business/BusinessRules');

class QuotationController {

  async price(req, res) {
    try {
      const { nascimento, endereco, coberturas } = req.body.request;

      // Checks if the request passes through all business constraints
      let business = new BusinessRules(nascimento, endereco, coberturas);
      // Return an error response if fails
      const check = await business.check();

      if (check.status === 200) {
        res.status(200).json({
          response: {
            premio: business.totalPrize,
            parcelas: business.n,
            valor_parcelas: business.pmt,
            primeiro_vencimento: business.vencimento,
            cobertura_total: business.totalCoverage,
          },
        });
      } else {
        res.status(check.status).json({
          message: check.message,
        });
      }

    } catch (err) {
      res.status(500).json({
        message: 'Falha ao calcular cotação!',
        error: err.message,
      });
    }

  }

}

module.exports = new QuotationController();
