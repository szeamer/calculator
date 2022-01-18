//set up calculator object
window.onload = () => {
    const calculator = {
        'expression': [],
        'text_field': document.querySelector('#textfield'),
        expressionToString() {
            return this.expression.join(' ');
        },
        'key_pad': {
            'operators': {
                'plus_button': document.querySelector('#plus'),
                'minus_button': document.querySelector('#minus'),
                'times_button': document.querySelector('#times'),
                'divide_button': document.querySelector('#over')
            },
            
            'digits': {
                'one_button': document.querySelector('#one'),
                'two_button': document.querySelector('#two'),
                'three_button': document.querySelector('#three'),
                'four_button': document.querySelector('#four'),
                'five_button': document.querySelector('#five'),
                'six_button': document.querySelector('#six'),
                'seven_button': document.querySelector('#seven'),
                'eight_button': document.querySelector('#eight'),
                'nine_button': document.querySelector('#nine'),
                'zero_button': document.querySelector('#zero')
            },

            'clear_button': document.querySelector('#clear'),
            'back_button': document.querySelector('#back'),
            'equals_button': document.querySelector('#equals')
        }
    };

    calculator.text_field.value = '';

    //connect to UI buttons
    //connect operators
    for(let operator in calculator.key_pad.operators){
        let button = calculator.key_pad.operators[operator];
        let value = button.textContent;
        button.addEventListener('click', () => {
            calculator.expression.push(value);
            console.log(calculator.expression);
            calculator.text_field.value = calculator.expressionToString();
        });
    }
    //connect digits
    for(let digit in calculator.key_pad.digits){
        let button = calculator.key_pad.digits[digit];
        let value = button.textContent;
        button.addEventListener('click', () => {
            let last_token = calculator.expression.pop();
            console.log(parseInt(last_token), last_token);
            //if the last thing pushed to expression is a number and our input is too, concatenate them and push that
            if((last_token != undefined) & (!isNaN(parseInt(last_token))) & (!isNaN(parseInt(value)))){
                console.log(last_token, value);
                last_token = last_token + value;

                calculator.expression.push(last_token);
            }
            //if the last thing pushed is not a number but is defined, put it back in and push our input
            else if(last_token != undefined){
                calculator.expression.push(last_token);
                calculator.expression.push(value);
            }
            //if there's nothing in the expression yet, just push our input
            else{
                calculator.expression.push(value);
            }

            console.log(calculator.expression);
            calculator.text_field.value = calculator.expressionToString();
        })
    }
    //connect clear button
    calculator.key_pad.clear_button.addEventListener('click', () => {
        calculator.expression = [];
        calculator.text_field.value = '';
    });
    //connect back button
    calculator.key_pad.back_button.addEventListener('click', () => {
        calculator.expression.pop();
        console.log(calculator.expression);
        calculator.text_field.value = calculator.expressionToString();
    })
};

//basic calculation functions
function add(a, b){
    return a + b;
}

function multiply(a, b){
    return a * b;
}

function subtract(a, b){
    return a - b;
}

function divide(a, b){
    return a / b;
}

function operate(operator, a, b){
    if(operator == '+'){
        return add(a, b);
    }
    if(operator == '-'){
        return subtract(a, b);
    }
    if(operator == '*'){
        return multiply(a, b);
    }
    if(operator == '/'){
        return divide(a, b);
    }
}
