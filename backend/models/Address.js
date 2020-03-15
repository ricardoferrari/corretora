'use strict';
const axios = require('axios');

/*
* Class that validate and manage data related to the person's address
*/
class Address {

  constructor(logradouro, bairro, cep, cidade) {
    this.logradouro = logradouro;
    this.bairro = bairro;
    this.cep = cep;
    this.cidade = cidade;
  }

  // Check if the cep is valid
  isValidCEP(cep) {
    // Regular expression for the format #####-###
    const regEx = /^[0-9]{5}-[0-9]{3}$/;
    // Check if cep is fullfilled
    if ((cep === null) || (cep === undefined) || (cep.length === 0)) return false;
    return regEx.test(cep);
  }

  async isValidCity(city) {
    let reached = false;
    await axios.get('https://www.redesocialdecidades.org.br/cities')
      .then(response => {
        const cities = response.data.cities;
        if (cities && (cities.length > 0)) {
          cities.forEach(element => {
            reached = (element.name === city) ? true : reached;
          });
        }
      })
      .catch(error => {
        console.log('Failed to access the service', error);
        return false;
      });
    return reached;
  }

}

module.exports = new Address();
