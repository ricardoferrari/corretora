const financial = require('../../models/Financial');
const quotation = require('../../models/Quotation');
const address = require('../../models/Address');

describe("Financial", () => {

    it("should return the number of max parcels allowed", () => {
        let installments = financial.maxAmountOfPayments(100);
        expect(installments).toBe(1);
        installments = financial.maxAmountOfPayments(500);
        expect(installments).toBe(1);
        installments = financial.maxAmountOfPayments(501);
        expect(installments).toBe(2);
        installments = financial.maxAmountOfPayments(1000);
        expect(installments).toBe(2);
        installments = financial.maxAmountOfPayments(1001);
        expect(installments).toBe(3);
        installments = financial.maxAmountOfPayments(2000);
        expect(installments).toBe(3);
        installments = financial.maxAmountOfPayments(2001);
        expect(installments).toBe(4);
        installments = financial.maxAmountOfPayments(5044);
        expect(installments).toBe(4);
    });

    it("should return the sum of N business days", () => {
        let presentDate = new Date("2020-3-12");
        let days = 5;
        let paymentDay = financial.countBusinessDays(presentDate, days).toString();
        expect(paymentDay).toBe(new Date("2020-3-18").toString());
        presentDate = new Date("2020-3-13");
        days = 1;
        paymentDay = financial.countBusinessDays(presentDate, days).toString();
        expect(paymentDay).toBe(new Date("2020-3-13").toString());
        presentDate = new Date("2020-3-13");
        days = 2;
        paymentDay = financial.countBusinessDays(presentDate, days).toString();
        expect(paymentDay).toBe(new Date("2020-3-16").toString());
        presentDate = new Date("2020-3-14");
        days = 1;
        paymentDay = financial.countBusinessDays(presentDate, days).toString();
        expect(paymentDay).toBe(new Date("2020-3-16").toString());
    })

    it("should return the 5th business day of next month", () => {
        //Test for usual 31 days month
        let presentDate = new Date("2020-3-28");
        let paymentDay = financial.next5thBusinessDay(presentDate).toString();
        expect(paymentDay).toBe(new Date("2020-4-7").toString());
        //Test for february in a bissextile month
        presentDate = new Date("2020-2-29");
        paymentDay = financial.next5thBusinessDay(presentDate).toString();
        expect(paymentDay).toBe(new Date("2020-3-6").toString());
    })

})

describe("Quotation", () => {

    it("should return true if there is at least one mandatory coverage present", () => {
        const ok = quotation.haveMandatoryCoverage(["01","02","03"]);
        expect(ok).toBe(true);
    });

    it("should return false if there are no mandatory coverage present", () => {
        const ok = quotation.haveMandatoryCoverage(["02"]);
        expect(ok).toBe(false);
    });

    it("should return false if there is no coverage present", () => {
        let ok = quotation.haveMandatoryCoverage();
        expect(ok).toBe(false);
        ok = quotation.haveMandatoryCoverage([]);
        expect(ok).toBe(false);
    });

    it("should return true if the person has more than 18 years old", () => {
        let birthDate = new Date("1979-11-23");
        expect(quotation.isMoreThan18YearsOld(birthDate)).toBe(true);
        birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear()-19);
        expect(quotation.isMoreThan18YearsOld(birthDate)).toBe(true);
    });

    it("should return false if the person has less than 18 years old", () => {
        let birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear()-18);
        birthDate.setDate(birthDate.getDate()+10);
        expect(quotation.isMoreThan18YearsOld(birthDate)).toBe(false);
    });

    it("should check if the CEP is valid", () => {
        let cep = "03693-020";
        expect(address.isValidCEP(cep)).toBe(true);
        cep = "03693-20";
        expect(address.isValidCEP(cep)).toBe(false);
        cep = "AA693-020";
        expect(address.isValidCEP(cep)).toBe(false);
        cep = "13042-200";
        expect(address.isValidCEP(cep)).toBe(true);
    });

    it("should check if the city is present in the service response", async () => {
        let city = "Campinas";
        expect(await address.isValidCity(city)).toBe(true);
        city = "São Paulo";
        expect(await address.isValidCity(city)).toBe(true);
        city = "Pindamonhangaba";
        expect(await address.isValidCity(city)).toBe(false);
    });

})