class Quotation {

    constructor () {
        this.coverage = [
            {id:0, nome:"teste", obrigatorio:true},
            {id:1, nome:"teste1", obrigatorio:true},
            {id:2, nome:"teste2", obrigatorio:false}
        ];
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
                if ( tempCoverageoRequested && tempCoverageoRequested.obrigatorio ) haveMandatory = true;
            });
        }
        return haveMandatory;
    }
}

module.exports = new Quotation();
