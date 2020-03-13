const jsonFile = require('./coverage.json');
const {AgeFromDate} = require('age-calculator');
/*
* Class that handles the data necessary to create a quotation
*/
class Quotation {

    constructor () {
        this.coverage = jsonFile;
    }

    //Check if the person has more than 18 years old
    isMoreThan18YearsOld( birthDate ) {
        const ageFromDate = new AgeFromDate(birthDate).age;
        return ( ageFromDate >= 18 ); 
    }

    //Calcula o numero máximo de prestações para cada faixa de premio
    haveMandatoryCoverage( coverageRequested ) {
        let haveMandatory = false;
        if ( (coverageRequested != null) && (coverageRequested.length > 0) ) {
            coverageRequested.forEach( cr => {
                const idRequested = cr;
                const tempCoverageoRequested = this.coverage.find( element => {
                    return (element.id == idRequested);
                });
                if ( tempCoverageoRequested && (tempCoverageoRequested.principal == 'S') ) haveMandatory = true;
            });
        }
        return haveMandatory;
    }
}

module.exports = new Quotation();
