'use strict';
const LocalizedStrings = require('localized-strings').default;

let strings = new LocalizedStrings({
  pt: {
    fail: {
      illegal: {
        postalCode: 'CEP inválido!',
      },
      tooManyCoverages: 'Número máximo de coberturas excedido!',
      missing: {
        mandatoryCoverage: 'Cobertura obrigatória inexistente!',
      },
      unregisteredCity: 'Cidade não cadastrada!',
      tooYoung: 'É necessário possuir mais de 18 anos!',
      unknown: 'Falha ao calcular cotação!',
    },
  },

});

module.exports = strings;
