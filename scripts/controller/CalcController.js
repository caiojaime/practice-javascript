class CalcController {

    constructor(){
        
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber - '';
        this._operation = [];
        this._locale = 'pt-br';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
      //this.pasteFromClipboard();

    } 
    // pasteFromClipboard(){

    //     document.addEventListener('paste', e=>{

    //         let text = e.clipboardData.getData('Text');

    //         this.displayCalc = parseFloat(text); 23

    //     });
    // }

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("copy");

        input.remove();

    }
    // Clock seconds timer.
    initialize(){

        this.setDisplayDateTime();
        
        setInterval(()=> {  this.setDisplayDateTime();

        },1000 );

        this.setLestNumberToDisplay();

        document.querySelectorAll('.btn-ac').forEach(btn=>{

            btn.addEventListener('dblclick', e=> {

                this.toggleAudio();

            })

        });

    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;

    }

    palyAudio() {

        if (this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }

    initKeyBoard(){

        document.addEventListener('keyup', e=> {

            this.palyAudio();

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                     break;

                case 'Backspace':
                    this.clearEntry();
                     break;
                         
                case 'Enter':
                case '=':
                    this.calc();
                    break; 

                case '.':
                case ',':
                     this.addDot(); 
                     break;
    
                case 'Enter':
                case '=':
                    this.calc();
                     break; 
                     
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':      
                this.addOperation(e.key); 
                break;
                 
                case '0':
                case '1':     
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                     break; 
                // case 'c':
                //     if (e.ctrlKey) this.copyToClipboard();
                //     break;
            }      
        });
    }


    // Optimizing the event to receive more than one parameter.
    addEventListenerAll(element, events, fn){

        events.split(',').forEach( event => {
             element.addEventListener(event, fn,false);
        });

    }

    clearAll(){
       
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLestNumberToDisplay(); // Update display

    }

    clearEntry(){

        this._operation.pop(); 
        this.setLestNumberToDisplay(); // Update display
    }
   
    getLastOperation(){
        
        return this._operation[this._operation.length-1];
      
    }
    setLestOperation(value){

        this._operation[this._operation.length -1] = value;

    }
    
    isOperator(value){
           
       return (['+', '-','*','%','/'].indexOf(value) >-1); 

    }

    pushOparation(value){

        this._operation.push(value); 
        if(this._operation.length > 3){

            this.calc();
        }
    }

    getResult(){

        return eval(this._operation.join(""));

    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firsItem = this._operation[0];
            this._operation = [firsItem, this._lastOperator, this._lastNumber ];
        }

        if (this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if (last == '%') {

            result /= 100;
            this._operation = [result];
    
        } else {

             this._operation = [result];
            if (last) this._operation.push(last);

        }

        this.setLestNumberToDisplay(); // Update display

    }

    getLastItem(isOperator = true){

        let lastItem;

        for (let i = this._operation.length-1; i >= 0; i--){

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
            
        }  

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }


    setLestNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if(!lastNumber){
            lastNumber = 0;
        }    
        
       this.displayCalc = lastNumber;

    }

    addOperation(value){

        if(isNaN(this.getLastOperation())) {

                if(this.isOperator(value)){

                    this.setLestOperation(value);

                } else {

                    this.pushOparation(value);
                    this.setLestNumberToDisplay(); // Update display
                }
           
        } else {

            if (this.isOperator(value)) {

                this.pushOparation(value);

            } else {

           let newValue = this.getLastOperation().toString() + value.toString(); 
           this.setLestOperation(newValue);
           this.setLestNumberToDisplay();  // Update display
            }
        }
    }

    setError(){

        this.displayCalc = "Error";
         
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) ||!lastOperation ) {
            this,this.pushOparation('0.');
        } else {
            this.setLestOperation(lastOperation.toString() + '.');

        }
        this.setLestNumberToDisplay();
    }

    execBtn(value){
        this.palyAudio();

        switch (value) {

            case 'ac':
                this.clearAll();
                 break;

            case 'ce':
                this.clearEntry();
                 break;

            case 'soma':
                 this.addOperation('+');   
                 break;

            case 'divisao':
                 this.addOperation('/'); 
                 break; 

            case 'multiplicacao':
                 this.addOperation('*'); 
                 break;

            case 'subtracao':
                 this.addOperation('-'); 
                  break;

            case 'porcento':
                 this.addOperation('%'); 
                 break;

            case 'ponto':
                 this.addDot(); 
                 break;

            case 'igual':
                this.calc();
                 break; 

            case '0':
            case '1':     
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                 break; 

            default:
                this.setError();
                 break;
        }
    }
    // Events.
    initButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons >g, #parts >g");

        buttons.forEach((btn, index) =>{

            this.addEventListenerAll(btn,"click, drag", e =>{

                let textBtn = btn.className.baseVal.replace("btn-","");
                
                this.execBtn(textBtn);
            });
            // Changing pointer.
            this.addEventListenerAll(btn, "mouseover, mouseup, mousedown", e=>{

                btn.style.cursor = "pointer";

            });
        });
    }

    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    get displayTime(){
        return this._timeEl.innerHTML;

    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;

    }

    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }  

    set currentDate(value){
        this._currentDate = value;
    }

}