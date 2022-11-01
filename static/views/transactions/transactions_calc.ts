
type str = string; 
//type bool = boolean; 
type int = number;

import { AreaT, SourceT, TagT, CatT, CalcT, BCalcT, TransactionT } from "../../definitions_xtend.js"




export function CalcRunIt(y:int, m:int, areas:AreaT[], cats:CatT[], sources:SourceT[], tags:TagT[], transactions:TransactionT[]) : {calcs:CalcT[], bcalcs:BCalcT[], bcalcsH:string[]} {

  let calcs:CalcT[] = [];



  // base calculation rows: year,month,category,total 

  for(let yi = 2020; yi <= y; yi++) {
    for(let mi = 1; mi <= 12; mi++) {
      cats.forEach(cat=> {
        calcs.push({y:yi, m:mi, cat, amount: 0})
      })
    }
  }

  transactions.forEach(t=> {
    let c  = calcs.find(c=> (c.y === t.y && c.m === t.m && c.cat === t.cat)) as CalcT 
    let cP = calcs.find(c=> (c.y === t.y && c.m === t.m && c.cat === t.cat.parent)) as CalcT 
    c.amount += t.amount
    cP.amount += t.amount
  })



  // second layer up calculation rows: category, amounts[this month, last month, .... up to one year in the past] 

  let bcalcs:BCalcT[] = []
  let bcalcsH:str[] = Array(13).fill("")

  cats.forEach((cat, index)=> {
    let catdisplay = (cat.parent ? cat.parent.name : "") + " - " + cat.name

    bcalcs.push({cat, catdisplay, amounts:Array(12).fill(0)})

    const bc:BCalcT = bcalcs[bcalcs.length-1]

    for(let i = 0; i < 12; i++) {
      let yi = y
      let mi = m - i
      if (mi <= 0) {
        mi = 12 + m
        yi = yi - 1
      }
      bc.amounts[i] = (calcs.find(c=> c.cat === cat && c.y === yi && c.m === mi))?.amount as number

      if (index === 0) {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        bcalcsH[1+i] = months[mi-1]
      }
    }

    if (index === 0) {
      bcalcsH[0] = "Category"
    }
  })

  return { calcs, bcalcs, bcalcsH }

}


