var express = require('express');
var router = express.Router();

/* POST price listing. */
router.post('/', function(req, res, next) {
  res.json({ 
    "response": {
      "premio": 800,
      "parcelas": 3,
      "valor_parcelas": 266.67,
      "primeiro_vencimento": "05/09/2019",
      "cobertura_total": 180000
    }
  });
});

module.exports = router;
