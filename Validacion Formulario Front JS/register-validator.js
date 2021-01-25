//Expresiones
const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{2,}$/, // Letras y espacios, pueden llevar acentos.
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/, //minimo 8, al menos un dígito, al menos una minúscula, al menos una mayúscula y al menos un caracter no alfanumérico
    avatar: /(.jpg|.jpeg|.png|.gif)$/i
}

//Selectores 
let form = document.querySelector("form")
let inputs = document.querySelectorAll(".register-input")
let input = (campo)=>{return document.querySelector(`.register-${campo} input`)}
let error = (campo, label)=>{return document.querySelector(`.register-${campo} ${label}`)}

let errorSubmit = [];

let estado = {
    name:false,
    lastName: false,
    email:false,
    password:false,
    avatar:true,
}

//FUNCIONES DE VALIDADORES//

//Validador-distribuidor
let validator = (inputElement)=>{
    if(inputElement.name == "name"){
        /*1- Empty*/ emptyInputValidator(inputElement); 
        /*2- Expresiones*/ return validExpressionValidator(inputElement, expresiones.nombre);
    }
    if(inputElement.name == "lastName"){
        /*1- Empty*/ emptyInputValidator(inputElement); 
        /*2- Expresiones*/ return validExpressionValidator(inputElement, expresiones.nombre);
    }
    if(inputElement.name == "email"){
        /*1- Empty*/ emptyInputValidator(inputElement); 
        /*2- Expresiones*/ validExpressionValidator(inputElement, expresiones.email);
        /*3- SameAs*/ return sameAsRetypeValidator.retypeEmail(input("retypeEmail"));
    }
    if(inputElement.name == "retypeEmail"){
        /*3- SameAs*/ return sameAsRetypeValidator.retypeEmail(inputElement);
    }
    if(inputElement.name == "password"){
        /*1- Empty*/ emptyInputValidator(inputElement); 
        /*2- Expresiones*/ validExpressionValidator(inputElement, expresiones.password);
        /*3- SameAs*/ return sameAsRetypeValidator.retypePassword(input("retype"));
    }
    if(inputElement.name == "retype"){
        /*3- SameAs*/ return sameAsRetypeValidator.retypePassword(inputElement);
    }
}
//nota: 1 validador por validacion diferente (5)

//Validador 1 campo obligatorio 
let emptyInputValidator = (inputElement)=>{
    if(inputElement.value == ""){
        return addError(inputElement.name, "blank");
    }
    removeError(inputElement.name, "blank");
}

//Validador 2 archivo valido/expresiones
let validExpressionValidator = (inputElement, expresion)=>{
        if(!expresion.test(inputElement.value)){
            return addError(inputElement.name, "validExpression");
        }
    removeError(inputElement.name, "validExpression");
}

//Validador 3 si es igual al retype
let sameAsRetypeValidator = {
    retypeEmail: (retypeInputElement)=>{
        if(input("email").value !== retypeInputElement.value){
            return addError(retypeInputElement.name, "validRetype");
        }
        removeError(retypeInputElement.name, "validRetype");
    },
    retypePassword: (retypeInputElement)=>{
        if(input("password").value !== retypeInputElement.value){
            return addError(retypeInputElement.name, "validRetype");
        }
        removeError(retypeInputElement.name, "validRetype");
    }
}

//Validador 4 si la imagen tiene una extension valida
let imgExtValidator = (inputElement)=>{
    if(!expresiones.avatar.exec(inputElement.value)){
        return addError(inputElement.name, "avatar");
    }
    removeError(inputElement.name, "avatar");
}

//Validador 5 submit
let blankSubmitValidator = (inputElement)=>{
    if(inputElement.value == ""){
        addError(inputElement.name, "blank");
    } else {
        removeError(inputElement.name, "blank");
    }
}

//Funcion class add - remove    
let addError = (campo, tipoValidador)=>{
    console.log(campo)  
    if(tipoValidador == "blank"){
        error(campo, "small").classList.remove("front-blank-error-inactive")
        error(campo, "small").classList.add("front-blank-error-active")
        error(campo, "input").classList.add("wrong-input")
        error(campo, "label").classList.add("wrong-label")
        estado[campo]= false;
    }
    if(tipoValidador == "validExpression"){
        error(campo, "p").classList.remove("front-error-inactive")
        error(campo, "p").classList.add("front-error-active")
        error(campo, "input").classList.add("wrong-input")
        error(campo, "label").classList.add("wrong-label")
        estado[campo]= false;
    }
    if(tipoValidador == "validRetype"){
        error(campo, "p").classList.remove("front-error-inactive")
        error(campo, "p").classList.add("front-error-active")
        error(campo, "input").classList.add("wrong-input")
        error(campo, "label").classList.add("wrong-label")
        error(campo, "small").classList.add("front-blank-error-inactive")
    }
    if(tipoValidador == "avatar"){
        error(campo, "p").classList.remove("front-error-inactive")
        error(campo, "p").classList.add("front-error-active")
        estado[campo]= false;
    }
}

let removeError = (campo, tipoValidador)=>{
    if(tipoValidador == "blank"){
        error(campo, "small").classList.add("front-blank-error-inactive")
        error(campo, "small").classList.remove("front-blank-error-active")
        error(campo, "input").classList.remove("wrong-input")
        error(campo, "label").classList.remove("wrong-label")
        estado[campo]= true;
    }
    if(tipoValidador == "validExpression"){
        error(campo, "p").classList.add("front-error-inactive")
        error(campo, "p").classList.remove("front-error-active")
        error(campo, "input").classList.remove("wrong-input")
        error(campo, "label").classList.remove("wrong-label")
        estado[campo]= true;
    }
    if(tipoValidador == "validRetype"){
        error(campo, "p").classList.add("front-error-inactive")
        error(campo, "p").classList.remove("front-error-active")
        error(campo, "input").classList.remove("wrong-input")
        error(campo, "label").classList.remove("wrong-label")
        error(campo, "small").classList.add("front-blank-error-inactive")
    }
    if(tipoValidador == "avatar"){
        error(campo, "p").classList.add("front-error-inactive")
        error(campo, "p").classList.remove("front-error-active")
        estado[campo]= true;
    }
}

//EJECUCION DE EVENTOS DE VALIDACION//

//Validacion campo por campo
inputs.forEach((input)=>{
    input.addEventListener("blur", (e)=>{
        validator(input);
    })
    input.addEventListener("keyup", (e)=>{
        validator(input);
    })

})
  
//Validacion imagen
input("image").addEventListener("change", (e)=>{
    /*2- Expresiones*/ return imgExtValidator(input("image"));
})

//Validacion submit empty
form.addEventListener("submit", (e)=>{
    inputs.forEach((input)=>{
        blankSubmitValidator(input);
    })
    if(!estado.name||!estado.lastName||!estado.password||!estado.email||!estado.avatar){
        e.preventDefault();
    }
})
console.table(estado)




    //--------------------------------------------------------------------------------//

