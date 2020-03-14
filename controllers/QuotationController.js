const quotation = require('../models/Quotation');
const financial = require('../models/Financial');
const address = require('../models/Address');

class QuotationController {

  price(req, res) {

    try {
        console.log(req.body);
        res.status(200).json({ 
            "response": {
              "premio": 800,
              "parcelas": 3,
              "valor_parcelas": 266.67,
              "primeiro_vencimento": "05/09/2019",
              "cobertura_total": 180000
            }
        });
    } catch(err) {
        res.status(500).json({
            message: "Falha ao calcular cotação!"
        });
    }

  }

}

module.exports = new QuotationController();