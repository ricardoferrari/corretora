class Cotacao {

    constructor () {
        this.coberturas = [
            {id:0, nome:"teste", obrigatorio:true},
            {id:1, nome:"teste1", obrigatorio:true},
            {id:2, nome:"teste2", obrigatorio:false}
        ];
    }

    //Calcula o numero máximo de prestações para cada faixa de premio
    existeCoberturaObrigatoria( coberturasSolicitadas ) {
        let possueObrigatoria = false;
        if ( (coberturasSolicitadas != null) && (coberturasSolicitadas.length > 0) ) {
            coberturasSolicitadas.forEach( solicitada => {
                const idSolicitado = solicitada;
                const umaCoberturaSolicitada = this.coberturas.find( element => {
                    return (element.id == idSolicitado);
                });
                if ( umaCoberturaSolicitada && umaCoberturaSolicitada.obrigatorio ) possueObrigatoria = true;
            });
        }
        return possueObrigatoria;
    }
}

module.exports = new Cotacao();
