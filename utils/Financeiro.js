class Financeiro {

    //Calcula o numero máximo de prestações para cada faixa de premio
    numMaxParcelas(premio) {
        const limite1 = 500; //Limite para 1 parcela
        const limite2 = 1000; //Limite para 2 parcela
        const limite3 = 2000; //Limite para 3 parcela

        if (premio <= limite1) {
            return 1;
        } else if (premio <= limite2) {
            return 2;
        } else if (premio <= limite3) {
            return 3;
        } else {
            return 4;
        }

    }
}

module.exports = new Financeiro();
