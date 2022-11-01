

import { AreaT, SourceT, TagT, CatT, CalcT, BCalcT, TransactionT } from "../../definitions_xtend.js"
import { CalcRunIt } from "./transactions_calc.js"
import { ListIt } from "./transactions_list.js"
declare var Lit_Render: any;
declare var Lit_Html: any;
declare var FSQss: any;

type str = string;   type int = number;   type bool = boolean;

type State = {
  filterY: int,
  filterM: int,
  filterMerchant: str|null,
  filterArea: AreaT|null,
  filterCats: CatT[]|null,
  filterTags: TagT[]|null,
  filterSource: SourceT|null,
  filterNote: str|null,
  keystate: int,
  keyaction: str,
  keyaction2: str,
  keysearchstr: str,
}




class VTransactions extends HTMLElement {
  s:State;
  areas:Array<AreaT>;
  cats:Array<CatT>;
  sources:Array<SourceT>;
  tags:Array<TagT>;
  transactions:Array<TransactionT>;
  filteredt:Array<TransactionT>;
  calcs:Array<CalcT>;
  bcalcs:Array<BCalcT>;
  bcalcsH:Array<string>;




  constructor() {   
    super(); 
    console.log("v-transactions constructor");

    this.s = {
      filterY:0, 
      filterM:0, 
      filterMerchant:null, 
      filterArea:null, 
      filterCats:null, 
      filterTags:null,
      filterSource:null,
      filterNote:null,
      keystate:0, 
      keyaction:'', 
      keyaction2:'', 
      keysearchstr:''
    };
    this.areas = [];
    this.cats = [];
    this.sources = [];
    this.tags = [];
    this.transactions = [];
    this.filteredt = []
    this.calcs = [];
    this.bcalcs = [];
    this.bcalcsH = [];
  }




  connectedCallback() {   
    console.log("v-transactions connected");   
  }




  activated() { return new Promise((res)=> {

    console.log("v-transactions activated");   

    FSQss(["area", "cat", "source", "tag", "transaction"], {})
      .then((allDataIn:any)=> {

        allDataIn.cat.forEach((a:any)=> {
          a.area   = allDataIn.area.find((aa:any)=> aa.id === a.area.id)
          a.parent = allDataIn.cat.find((aa:any)=> aa.id === a.parent.id)
        })

        allDataIn.transaction.forEach((a:TransactionT)=> {
          a.cat      = allDataIn.cat.find((aa:any)=> aa.id === a.cat.id)
          a.source   = allDataIn.source.find((aa:any)=> aa.id === a.source.id)

          for (let i = 0; i < a.tags.length; i++) {
            a.tags[i] = allDataIn.tag.find((aa:any)=> aa.id === a.tags[i].id)
          }

          const d = new Date(a.ts * 1000)
          a.y = d.getFullYear()
          a.m = d.getMonth() + 1
          a.d = d.getDate()
        })



        // get cats in an ordered array where each parent is ordered first and child cats are ordered under parent

        const parentOrderedCats:CatT[] = []
        const allOrderedCats:CatT[]    = []

        allDataIn.cat.forEach((cat:CatT)=> {     if (!cat.parent) parentOrderedCats.push(cat);     })
        parentOrderedCats.sort((a,b)=>   ((a.name < b.name) ? -1 : 1)   )

        parentOrderedCats.forEach(cat=> {
          const childcats:CatT[] = allDataIn.cat.filter((c:CatT)=> c.parent && c.parent.name === cat.name)

          childcats.sort((a,b)=>   ((a.name < b.name) ? -1 : 1)   )

          allOrderedCats.push(cat, ...childcats)
        })


        let nowD = new Date();
        this.s.filterM = nowD.getMonth() + 1
        this.s.filterY = nowD.getFullYear()


        this.areas = allDataIn.area
        this.sources = allDataIn.source
        this.cats = allOrderedCats
        this.tags = allDataIn.tag
        this.transactions = allDataIn.transaction

        let { bcalcs, bcalcsH } = CalcRunIt(this.s.filterY, this.s.filterM, this.areas, this.cats, this.sources, this.tags, this.transactions)


        let { t } = ListIt(this.transactions, this.s.filterY, this.s.filterM, null, null, null, null, null, null, 0)

        this.bcalcs  = bcalcs
        this.bcalcsH = bcalcsH
        this.filteredt = t

        this.stateChanged()

        // TODO - fix this. will keep attaching to window everytime this page is loaded. thats a problem

        window.addEventListener('keydown', (e)=> this.keyDownEv(e))

        res(1)
      })

  })};




  stateChanged() {
    Lit_Render(this.template(this.s, this.filteredt, this.bcalcs, this.bcalcsH), this);
  }




  keyDownEv(e:KeyboardEvent) {

    let runFilter = false

    if (this.s.keystate === 0 && e.key === 'r') {
      this.s.filterMerchant = null
      this.s.filterArea   = null
      this.s.filterCats   = null
      this.s.filterTags   = null
      this.s.filterSource = null
      this.s.filterNote   = null
      runFilter = true
    }

    else if (this.s.keystate === 0 && e.key === 'd') {
      this.s.keyaction = 'd'
      this.s.keystate = 1
    }

    else if (this.s.keystate === 1 && this.s.keyaction === 'd' && e.key === 'm') {
      this.s.keystate = 2
      this.s.keyaction2 = 'm'
    }

    else if (this.s.keystate === 0 && e.key === 'f') {
      this.s.keyaction = 'f'
      this.s.keystate = 1
    }

    else if (this.s.keystate === 1 && this.s.keyaction === 'f' && e.key === 'm') {
      this.s.keystate = 2
      this.s.keyaction2 = 'm'
    }

    else if (this.s.keystate === 1 && this.s.keyaction === 'f' && e.key === 'a') {
      this.s.keystate = 2
      this.s.keyaction2 = 'a'
    }

    else if (this.s.keystate === 1 && this.s.keyaction === 'f' && e.key === 'c') {
      this.s.keystate = 2
      this.s.keyaction2 = 'c'
    }
    
    else if (this.s.keystate === 1 && this.s.keyaction === 'f' && e.key === 't') {
      this.s.keystate = 2
      this.s.keyaction2 = 't'
    }

    else if (this.s.keystate === 1 && this.s.keyaction === 'f' && e.key === 's') {
      this.s.keystate = 2
      this.s.keyaction2 = 's'
    }

    else if (this.s.keystate === 1 && this.s.keyaction === 'f' && e.key === 'n') {
      this.s.keystate = 2
      this.s.keyaction2 = 'n'
    }

    else if (this.s.keystate === 2 && this.s.keyaction === 'd' && this.s.keyaction2 !== '') {
      if (e.key === 'Enter') {
        console.log("begin search for date: ", this.s.keysearchstr)

        switch (this.s.keyaction2) {
          case "m" :
            this.s.filterY = Number('20'+this.s.keysearchstr.substring(0,2))
            this.s.filterM = Number(this.s.keysearchstr.substring(2,4))
            break
        }

        let { bcalcs, bcalcsH } = CalcRunIt(this.s.filterY, this.s.filterM, this.areas, this.cats, this.sources, this.tags, this.transactions)
        this.bcalcs  = bcalcs
        this.bcalcsH = bcalcsH

        runFilter = true

        this.s.keyaction2 = ''
        this.s.keyaction = ''
        this.s.keystate = 0
        this.s.keysearchstr = ''
      }

      else if (e.key !== 'Shift') {
        this.s.keysearchstr += e.key
      }
    }

    else if (this.s.keystate === 2 && this.s.keyaction === 'f' && this.s.keyaction2 !== '') {
      if (e.key === 'Enter') {
        console.log("begin search for: ", this.s.keysearchstr)

        switch (this.s.keyaction2) {
          case "m" :
            this.s.filterMerchant = this.s.keysearchstr
            break
          case "a" :
            this.s.filterArea = this.areas.find(a=> a.name === this.s.keysearchstr) || null
            break
          case "c" :
            this.s.filterCats = this.cats.filter(a=> a.name === this.s.keysearchstr) || null
            break
          case "t" :
            this.s.filterTags = this.tags.filter(a=> a.name === this.s.keysearchstr) || null
            break
          case "s" :
            this.s.filterSource = this.sources.find(a=> a.name === this.s.keysearchstr) || null
            break
          case "n" :
            this.s.filterNote = this.s.keysearchstr
            break
        }

        runFilter = true

        this.s.keyaction2 = ''
        this.s.keyaction = ''
        this.s.keystate = 0
        this.s.keysearchstr = ''
      }

      else if (e.key !== 'Shift') {
        this.s.keysearchstr += e.key
      }

    }



    if (runFilter) {
      let { t } = ListIt(this.transactions, this.s.filterY, this.s.filterM, this.s.filterMerchant, this.s.filterArea, this.s.filterCats, this.s.filterTags, this.s.filterSource, this.s.filterNote, 0)
      this.filteredt = t

    }

    this.stateChanged()
  }




  template = (_s:State, _filteredt:TransactionT[], _bcalcs:BCalcT[], _bcalcsH:string[]) => { return Lit_Html`{--htmlcss--}`; };
}




customElements.define('v-transactions', VTransactions);




export {  }


