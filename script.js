//set up calculator object
window.onload = () => {
    const calculator = {
        'expression': [],
        'text_field': document.querySelector('#textfield'),
        expressionToString() {
            if(this.expression.length == 1 & isNaN(this.expression[0])){
                return "undefined";
            }
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
        last_token = calculator.expression.pop();
        if(!isNaN(parseInt(last_token))){
            last_token = last_token.slice(0, -1);
            calculator.expression.push(last_token);
        }
        console.log(calculator.expression);
        calculator.text_field.value = calculator.expressionToString();
    });

    //connect equals button
    calculator.key_pad.equals_button.addEventListener('click', () => {
        calculator.expression = evaluate_expression(calculator.expression);
        calculator.text_field.value = calculator.expressionToString();
        console.log(calculator.expression);
    });
};

function evaluate_expression(expression){
    //functions to check operator 
    const is_times_over = (element) => '*/'.includes(element);
    const is_plus_minus = (element) => '+-'.includes(element);

    //operate on sb-expressions until they are reduced to one number
    if(expression.length>=3){
        while(canEvaluate(expression)){
            console.log('loop' + expression);
            //to satisfy PEMDAS, operate on multiplication and division first
            if(expression.find(element => '*/'.includes(element))){
                let operator_index = expression.findIndex(is_times_over);
                let operator = expression.find(is_times_over);
                let item_1 = expression[operator_index-1];
                let item_2 = expression[operator_index+1];

                console.log(operator, item_1, item_2);
                expression.splice(operator_index-1, 3, operate(operator, item_1, item_2));
            }
            //then operate on addition and subtraction
            else if(expression.find(element => '+-'.includes(element))){
                let operator_index = expression.findIndex(is_plus_minus);
                let operator = expression.find(is_plus_minus);
                let item_1 = expression[operator_index-1];
                let item_2 = expression[operator_index+1];

                console.log(operator, item_1, item_2);
                expression.splice(operator_index-1, 3, operate(operator, item_1, item_2));
            }
        }
        return expression;
    }
    else{
        return [undefined];
    }
}

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
    a = parseInt(a);
    b = parseInt(b);
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

function canEvaluate(expression){
    console.log('check if can evaluate');
    if(expression.length >=3){
        for(let n = 0; n+=2; n<expression.length){
            if(isNaN(expression[n])){
                console.log(false);
                return false;
            }
        }
        for(let n = 1; n+=2; n<expression.length){
            if(!'+-/*'.includes(expression[n])){
                return false;
            }
        }
        return true;
    }
    else{
        return false;
    }
}