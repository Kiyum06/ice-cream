// alert("Hello, ice cream!");


document.getElementById("icecream-form").onsubmit = () => {

    clearErrors();

    let isValid = true;
    //validate name
    let name = document.getElementById("name").value.trim();
    if(!name) {
        document.getElementById("err-name").style.display = "block";
        isValid = false;
    }

    //validate email address
    let email = document.getElementById("email").value.trim();
    if(!email || !email.includes("@")) {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

     //validate flavor
    let size = document.getElementById("flavor").value;
    if(size == "none") {
        document.getElementById("err-flavor").style.display = "block";
        isValid = false;
    }

    //validate cone
    let waffle = document.getElementById("waffle");
    let sugar = document.getElementById("sugar");
    let cup = document.getElementById("cup");
    if(!waffle.checked && !sugar.checked && !cup.checked) {
        document.getElementById("err-cone").style.display = "block";
        isValid = false;
    }

    return isValid;

}

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for(let i = 0; i < errors.length ; i++){
        errors[i].style.display = "none";
    }
}