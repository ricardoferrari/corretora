'use strict';
const BusinessRules = require('../business/BusinessRules');
const status = require('../commons/status-code');

class QuotationController {

  async price(req, res) {
    try {
      const { nascimento, endereco, coberturas } = req.body.request;

      // Checks if the request passes through all business constraints
      let business = new BusinessRules(nascimento, endereco, coberturas);
      // Return an error response if fails
      const check = await business.check();

      if (check.status === status.OK) {
        res.status(status.OK).json({
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
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'Falha ao calcular cotação!',
        error: err.message,
      });
    }

  }

}

module.exports = new QuotationController();
