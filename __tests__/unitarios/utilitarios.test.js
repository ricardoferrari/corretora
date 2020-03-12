const financeiro = require('../../utils/Financeiro');
const cotacao = require('../../utils/Cotacao');

describe("Financeiro", () => {

    it("should return the number of max parcels allowed", () => {
        let prestacoes = financeiro.numMaxParcelas(100);
        expect(prestacoes).toBe(1);
        prestacoes = financeiro.numMaxParcelas(500);
        expect(prestacoes).toBe(1);
        prestacoes = financeiro.numMaxParcelas(501);
        expect(prestacoes).toBe(2);
        prestacoes = financeiro.numMaxParcelas(1000);
        expect(prestacoes).toBe(2);
        prestacoes = financeiro.numMaxParcelas(1001);
        expect(prestacoes).toBe(3);
        prestacoes = financeiro.numMaxParcelas(2000);
        expect(prestacoes).toBe(3);
        prestacoes = financeiro.numMaxParcelas(2001);
        expect(prestacoes).toBe(4);
        prestacoes = financeiro.numMaxParcelas(5044);
        expect(prestacoes).toBe(4);
    });

    it("should return true if there is at least one mandatory coverage present", () => {
        let existe = cotacao.existeCoberturaObrigatoria([0,1,2]);
        expect(existe).toBe(true);
    });

    it("should return false if there are no mandatory coverage present", () => {
        let existe = cotacao.existeCoberturaObrigatoria([2]);
        expect(existe).toBe(false);
    });

    it("should return false if there is no coverage present", () => {
        let existe = cotacao.existeCoberturaObrigatoria();
        expect(existe).toBe(false);
        existe = cotacao.existeCoberturaObrigatoria([]);
        expect(existe).toBe(false);
    });

})