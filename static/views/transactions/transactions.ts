

import { TransactionType } from "../../definitions_xtend.js"
declare var Lit_Render: any;
declare var Lit_Html: any;
declare var FSQss: any;

//type str = string;   type int = number;   type bool = boolean;

type State = {
  propa: number,
  propb: number
}




class VTransactions extends HTMLElement {
  state:State;
  transactions:Array<TransactionType>;




  constructor() {   
    super(); 
    console.log("v-transactions constructor");

    this.transactions = [];
    this.state = {propa:9, propb:2};
  }




  connectedCallback() {   
    console.log("v-transactions connected");   
  }




  activated() { return new Promise((res, rej)=> {
    console.log("v-transactions activated");   

    FSQss("transactions > all", {}).then((transactions:Array<TransactionType>)=> {
      this.transactions = transactions;
      this.stateChanged();
      res(1);

    }).catch(()=> rej());
  })};




  stateChanged() {
    Lit_Render(this.template(this.state, this.transactions), this);
  }




  template = (_s:State, _transactions:Array<TransactionType>) => { return Lit_Html`{--htmlcss--}`; };
}




customElements.define('v-transactions', VTransactions);




export {  }


