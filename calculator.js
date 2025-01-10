/* In this problem, first of all I have stored the expression entered by the user inside 'input' string variable. Then I have 
checked for possible syntax and mathematical errors. If the entered 'input' expression is correct, then in order to evaluate it I 
have splitted it into 2 arrays:- 'arr_number' for storing the numerical values present in the expression and 'arr_operator'
for storing the operators present in the expression. Using these 2 arrays and keeping the BODMAS rule in mind, I have evaluated
the expression. 'input_for_display' is created to design how the expression will be visually displayed on my calculator.*/

// Declare a input global variable
let input = "", input_for_display=""; 
let is_syntax_error = false;


function getInput(char){
    // Using regex check whether char is a digit or not
    if(input_for_display=="Ans" && /^[0-9]$/.test(char)){
        clearInput();
    }
    let len = input.length;
    //Check whether current (except '-') and previous entered expression is an operator or not
    if((char=='/' || char=='*' || char=='+') && (input[len-1]=='*' || input[len-1]=='/' || input[len-1]=='+' || input[len-1]=='-')){
        is_syntax_error = true;
    }
    if(char=='-' && (input[len-1]=='-' || input[len-1]=='+')){
        is_syntax_error = true;
    }
    input_for_display += char;
    input += char;
    var expression = document.querySelector("#expression");
    // Replace '*' and '/' by the symbols which are needed to be displayed in the calculator
    expression.innerHTML = input_for_display.replace(/\//g, '&divide;').replace(/\*/g, '&times;');
}

let clearInput = ()=>{
    // Called when "CE" is clicked.
    input="";
    input_for_display = "";
    var expression = document.querySelector("#expression"); 
    expression.innerHTML = input_for_display; 
}

function computeExpression(){
    // Check whether is_syntax_error is true or not
    if(is_syntax_error){
        let expression = document.querySelector("#expression");
        expression.innerText = 'Syntax Error';
        input="";
        input_for_display = '';
        is_syntax_error = false;
        return;
    }
    let arr_number = []; 
    let arr_operator = [];
    let start_index = 0, len=input.length;
    let ans = document.querySelector("#expression");
    // Check for syntax error due to leading or trailing operators present in the expression.
    if(input[0]=='+' || input[0]=='*' || input[0]=='/' || input[len-1]=='+' || input[len-1]=='*' || input[len-1]=='-' || input[len-1]=='/'){
        ans.innerText = 'Syntax Error';
        input="";
        input_for_display = "";
        return;
    }
    for(let i=0; i<len; i++){
        // If input[0] = '-' then '-' will represent a negative number and will not be treated as a separate operator
        // which needs to be evaluated.
        if(i==0 && input[i]=='-'){
            let j=1;
            // Iterate till input[j] is a digit
            while(/^[0-9]$/.test(input[j])) j++;
            // Append elements to arrays
            arr_number.push(Number(input.slice(start_index, j)));
            start_index = j;
            i=j-1;
        }
        else if(input[i]=='+' || input[i]=='*' || input[i]=='-' || input[i]=='/'){ 
            // "/-" and "*-" in the expression is not a syntax error but rather represents that the second operand of '/' and '*'
            // is a negative number.
            if(input[i]=='-' && (input[i-1]=='*' || input[i-1]=='/')){
                let j = start_index+1;
                // Iterate till input[j] is a digit
                while(/^[0-9]$/.test(input[j])) j++;
                // Append elements to arrays
                arr_number.push(Number(input.slice(start_index, j)));
                start_index = j;
                i=j-1;
            }
            else{
                if(start_index != i) arr_number.push(Number(input.slice(start_index, i)));
                start_index = i+1;
                arr_operator.push(input[i]);
            }
        }
    }
    // Populate the last number present inside 'input' expression into "arr_number".
    arr_number.push(Number(input.slice(start_index, len)));
    // Check whether any operator was present in the expression or not
    if(arr_operator.length==0){
        ans.innerText = input_for_display;
        return;
    }
    // Compute the expression following BODMAS rules. So first '/' is evaluated followed by '*' and then followed by '+' and '-'.
    let iter_count = 1;
    while(arr_operator.length>0){
        for(let i=0; i<arr_operator.length; i++){
            if(iter_count==1){
                //Perform Division
                // Check whether the second operand is 0 or not.
                if(arr_operator[i]=='/'){
                    if(arr_number[i+1]==0){
                        ans.innerText = "Math Error";
                        input="";
                        input_for_display="";
                        return;
                    }            
                    arr_number[i] = arr_number[i] / arr_number[i+1];
                    // Delete the operator and the second operand. First operand is replaced with the evaluated answer.
                    arr_number.splice(i+1, 1);
                    arr_operator.splice(i, 1);
                    i--; // 'i' is decremented because after the execution of this loop it will naturally be incremented.
                }
            }
            else if(iter_count==2){
                //Perform Multiplication
                if(arr_operator[i]=='*'){
                    arr_number[i] = arr_number[i] * arr_number[i+1]; 
                    // Delete the operator and the second operand. First operand is replaced with the evaluated answer.
                    arr_number.splice(i+1, 1);
                    arr_operator.splice(i, 1);
                    i--; // 'i' is decremented because after the execution of this loop it will naturally be incremented.
                }
            }
            else{
                // Perform Addition or Subtraction
                if(arr_operator[i]=='+' || arr_operator[i]=='-'){
                    if(arr_operator[i]=='+') arr_number[i] = arr_number[i] + arr_number[i+1];
                    else arr_number[i] = arr_number[i] - arr_number[i+1];
                    // Delete the operator and the second operand. First operand is replaced with the evaluated answer.
                    arr_number.splice(i+1, 1);
                    arr_operator.splice(i, 1);
                    i--; // 'i' is decremented because after the execution of this loop it will naturally be incremented.
                }
            }
        }
        iter_count++;
    }
    // Display the final computed answer
    ans.innerText = arr_number[0];
    input= String(arr_number[0]);
    input_for_display = "Ans";
    return;
}