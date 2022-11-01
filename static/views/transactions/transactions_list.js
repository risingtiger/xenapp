export function ListIt(transactions, y, m, merchantF, areaF, catsF, tagsF, sourceF, noteF, sortby) {
    const filtered = transactions
        .filter(t => {
        return (t.y === y && t.m === m);
    })
        .filter(t => {
        if (merchantF)
            return (t.merchant.includes(merchantF));
        else
            return true;
    })
        .filter(t => {
        if (areaF)
            return (t.cat.parent.area === areaF);
        else
            return true;
    })
        .filter(t => {
        if (catsF)
            return (catsF.includes(t.cat) || catsF.includes(t.cat.parent));
        else
            return true;
    })
        .filter(t => {
        if (tagsF) {
            for (let i = 0; i < t.tags.length; i++) {
                if (tagsF.includes(t.tags[i]))
                    return true;
            }
            return false;
        }
        else {
            return true;
        }
    })
        .filter(t => {
        if (sourceF)
            return (t.source === sourceF);
        else
            return true;
    })
        .filter(t => {
        if (noteF)
            return (t.notes.includes(noteF));
        else
            return true;
    })
        .sort((a, b) => {
        if (sortby === 0) {
            const da = a.y + a.m + a.d;
            const db = b.y + b.m + a.d;
            return (da < db) ? -1 : 1;
        }
        if (sortby === 1) {
            return (a.amount < b.amount) ? -1 : 1;
        }
        return 0;
    });
    return { t: filtered };
}
