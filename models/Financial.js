class Financial {

    //Calculate the amount of payments according to the prize threshold
    maxAmountOfPayments(prize) {
        const threshold1 = 500; //Limite para 1 parcela
        const threshold2 = 1000; //Limite para 2 parcela
        const threshold3 = 2000; //Limite para 3 parcela

        if (prize <= threshold1) {
            return 1;
        } else if (prize <= threshold2) {
            return 2;
        } else if (prize <= threshold3) {
            return 3;
        } else {
            return 4;
        }

    }

    //Count business days including the initial date
    countBusinessDays(initialDate, days) {
        const businessDays = [1, 2, 3, 4, 5];
        let dateCalc = new Date(initialDate);
        let daysCount = days;
        //If the initial day is business day
        if ( businessDays.includes(dateCalc.getDay()) ) { 
            daysCount--;
        }
        while(daysCount > 0) {
            dateCalc.setDate(dateCalc.getDate()+1);
            if ( businessDays.includes(dateCalc.getDay()) ) daysCount--;
        }
        return dateCalc;
    }

    next5thBusinessDay(presentDate) {
        const nextMonth = presentDate.getMonth()+1;
        const firstDayNextMonth = new Date(presentDate.getFullYear(), nextMonth, 1); 
        return this.countBusinessDays(firstDayNextMonth,5);
    }
}

module.exports = new Financial();
