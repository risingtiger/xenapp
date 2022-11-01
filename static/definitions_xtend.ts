

type str = string; type bool = boolean; type int = number;




export type AreaT   = {   id: str, name: str   } 
export type SourceT = {   id: str, name: str   } 
export type TagT    = {   id: str, name: str   } 
export type CalcT   = {   y:number, m:number, cat:CatT, amount:number };
export type BCalcT  = {   cat:CatT, catdisplay:str, amounts:number[] };




export type CatT = { 
  id: str,
  parent: CatT, 
  name: str 
  area: AreaT, 
} 




export type TransactionT = { 
  id: str,
  ts: number, 
  y: number, 
  m: number, 
  d: number, 
  merchant: str, 
  cat: CatT, 
  tags: TagT[], 
  source: SourceT, 
  amount: number, 
  notes: str, 
}




