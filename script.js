//set up calculator object
window.onload = () => {
    const calculator = {
        'expression': [],
        'text_field': document.querySelector('#textfield'),
        expressionToString() {
            if(this.expression.length == 1 & isNaN(this.expression[0]) & !('*/+-^'.includes(this.expression))){
                return "undefined";
            }
            return this.expression.join(' ');
        },
        'key_pad': {
            'operators': {
                'plus_button': document.querySelector('#plus'),
                'minus_button': document.querySelector('#minus'),
                'times_button': document.querySelector('#times'),
                'divide_button': document.querySelector('#over'),
                'power_button': document.querySelector('#power')
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
            'dot_button': document.querySelector('#dot'),
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
        //click
        button.addEventListener('click', () => {
            calculator.expression.push(value);
            console.log(calculator.expression);
            calculator.text_field.value = calculator.expressionToString();
        });
        //keypress
        document.addEventListener('keydown', (event) => {
            if(event.key == button.innerText){
                event.preventDefault();
                button.click();
            }
        });
    }
    //connect digits
    for(let digit in calculator.key_pad.digits){
        let button = calculator.key_pad.digits[digit];
        let value = button.textContent;
        button.addEventListener('click', () => {
            pushNumber(value);
        });
        //keypress
        document.addEventListener('keydown', (event) => {
            if(event.key == button.innerText){
                event.preventDefault();
                button.click();
            }
        });
    }

    //connect dot button
    calculator.key_pad.dot_button.addEventListener('click', () => {
        pushNumber('.');
    });
    //keypress
    document.addEventListener('keydown', (event) => {
        if(event.key == '.'){
            event.preventDefault();
            calculator.key_pad.dot_button.click();
        }
    });

    //connect clear button
    calculator.key_pad.clear_button.addEventListener('click', () => {
        calculator.expression = [];
        calculator.text_field.value = '';
    });
    //keypress
    document.addEventListener('keydown', (event) => {
        if(event.keyCode == 27){
            event.preventDefault();
            calculator.key_pad.clear_button.click();
        }
    });

    //connect back button
    calculator.key_pad.back_button.addEventListener('click', () => {
        //pop the last thing in the expression
        last_token = calculator.expression.pop();

        //if it's a number, put back all but the last digit
        if(isNumeric(last_token)){
            console.log('deleted a number');
            console.log(last_token);
            last_token = String(last_token).slice(0, -1);
            calculator.expression.push(last_token);
        }
        console.log(calculator.expression);
        calculator.text_field.value = calculator.expressionToString();
    });
    //keypress
    document.addEventListener('keydown', (event) => {
        if(event.keyCode == 8){
            event.preventDefault();
            calculator.key_pad.back_button.click();
        }
    });

    //connect equals button
    calculator.key_pad.equals_button.addEventListener('click', () => {
        calculator.expression = evaluate_expression(calculator.expression);
        calculator.text_field.value = calculator.expressionToString();
        console.log(calculator.expression);
    });
    //keypress
    document.addEventListener('keydown', (event) => {
        if(event.key == '=' | event.keyCode==13){
            event.preventDefault();
            calculator.key_pad.equals_button.click();
        }
    });

    function pushNumber(value){
        let last_token = calculator.expression.pop();
        console.log(parseFloat(last_token), last_token);
        //if the last thing pushed to expression is a number and our input is too, concatenate them and push that
        if((last_token != undefined) & (isNumeric(last_token)) & (isNumeric(value))){
            console.log(last_token, value);
            last_token = String(last_token) + value;
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
    }
};

function evaluate_expression(expression){
    //functions to check operator 
    const is_exponent = (element) => '^' == element;
    const is_times_over = (element) => '*/'.includes(element);
    const is_plus_minus = (element) => '+-'.includes(element);

    //operate on sb-expressions until they are reduced to one number
    console.log( 'evaluate_expression(expression) -> expression & canEvaluate', expression, canEvaluate(expression))
    if(canEvaluate(expression)){
        while(canEvaluate(expression)){
            console.log('looping ' + expression);
            //to satisfy PEMDAS, exponentiate first
            if(expression.find(element => '^' == element)){
                let operator_index = expression.findIndex(is_exponent);
                let operator = expression.find(is_exponent);
                let item_1 = expression[operator_index-1];
                let item_2 = expression[operator_index+1];

                console.log(operator, item_1, item_2);
                expression.splice(operator_index-1, 3, operate(operator, item_1, item_2));
            }
            //operate on multiplication and division second
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
        console.log('func dont think it can eval');
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

function power(a, b){
    return a ** b;
}

function operate(operator, a, b){
    a = parseFloat(a);
    b = parseFloat(b);
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
    if(operator == '^'){
        return power(a, b);
    }
}

function canEvaluate(expression){
    console.log('check if can evaluate');
    if(expression.length >=3){
        should_be_numeric = expression.filter((element, index) => {
            return index % 2 == 0;
        });
        should_be_operators = expression.filter((element, index) => {
            return index % 2 == 1;
        });

        console.log('operators', should_be_operators);
        console.log('numbers', should_be_numeric);

        correctly_numeric = should_be_numeric.reduce((previousValue, currentValue) => {
            return (isNumeric(previousValue)) & (isNumeric(currentValue));
        });
        correctly_operators = should_be_operators.reduce((previousValue, currentValue) => {
            console.log(currentValue, previousValue);
            return previousValue & '^+-/*'.includes(currentValue);
        }, true);
        console.log('num', correctly_numeric, 'op: ', correctly_operators);
        return correctly_numeric & correctly_operators;
    }
    else{
        console.log('CANNOT EVALUATE');
        return false;
    }
}

function isNumeric(char){
    if(!isNaN(char) | char=='.'){
        return true;
    }
    return false;
}