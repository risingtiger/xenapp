

declare var Lit_Render: any;
declare var Lit_Html: any;




class VIndex extends HTMLElement {
  state = {
    someprop: 9988,
    somepropB: 112234455
  }; 

  


  constructor() {   
    super(); 
    console.log("v-index constructor");
  }




  connectedCallback() {
    console.log("v-index connected");   
  }




  activated() { return new Promise<number>((res, _rej)=> {
    console.log("v-index activated");
    this.stateChanged();

    res(1);
  })}




  stateChanged() {
    console.log("v-index stateChanged");
    Lit_Render(this.template(this.state), this);
  }




  template = (_s:any) => { return Lit_Html`{--htmlcss--}`; };
}




customElements.define('v-index', VIndex);




export {  }


