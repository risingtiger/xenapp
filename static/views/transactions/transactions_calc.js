export function CalcRunIt(y, m, areas, cats, sources, tags, transactions) {
    let calcs = [];
    // base calculation rows: year,month,category,total 
    for (let yi = 2020; yi <= y; yi++) {
        for (let mi = 1; mi <= 12; mi++) {
            cats.forEach(cat => {
                calcs.push({ y: yi, m: mi, cat, amount: 0 });
            });
        }
    }
    transactions.forEach(t => {
        let c = calcs.find(c => (c.y === t.y && c.m === t.m && c.cat === t.cat));
        let cP = calcs.find(c => (c.y === t.y && c.m === t.m && c.cat === t.cat.parent));
        c.amount += t.amount;
        cP.amount += t.amount;
    });
    // second layer up calculation rows: category, amounts[this month, last month, .... up to one year in the past] 
    let bcalcs = [];
    let bcalcsH = Array(13).fill("");
    cats.forEach((cat, index) => {
        let catdisplay = (cat.parent ? cat.parent.name : "") + " - " + cat.name;
        bcalcs.push({ cat, catdisplay, amounts: Array(12).fill(0) });
        const bc = bcalcs[bcalcs.length - 1];
        for (let i = 0; i < 12; i++) {
            let yi = y;
            let mi = m - i;
            if (mi <= 0) {
                mi = 12 + m;
                yi = yi - 1;
            }
            bc.amounts[i] = (calcs.find(c => c.cat === cat && c.y === yi && c.m === mi))?.amount;
            if (index === 0) {
                let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                bcalcsH[1 + i] = months[mi - 1];
            }
        }
        if (index === 0) {
            bcalcsH[0] = "Category";
        }
    });
    return { calcs, bcalcs, bcalcsH };
}
