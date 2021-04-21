console.log("HI");
console.log("HI");
console.log("HI");
console.log("HI");

form = document.getElementById("register_form");
register_section = document.getElementById("register_section");

// Get First & Last names and add listeners
fname = document.getElementById("fname");
fname.addEventListener("blur", fname_fun);

email = document.getElementById("email");

lname = document.getElementById("lname");
lname.addEventListener("blur", lname_fun);

name_regex = new RegExp("^[A-Za-z]+$");

// Get address and add listeners
address = document.getElementById("address");
address.addEventListener("blur", address_fun);
address_regex = new RegExp("^[a-zA-Z0-9 ]+$");

// Get age and add listeners
age = document.getElementById("age");
age.addEventListener("blur", age_fun);

// On submit check all fields --> continue if validate info entered
submit = document.getElementById("submit_register");
submit.addEventListener("click", submit_register);

// Add listeners to login submits & check credentials
username = document.getElementById("username"); // retrieve username value
password = document.getElementById("password"); // retrieve password value
login = document.getElementById("submit_login");
login.addEventListener("click", submit_login);

function lname_fun() {
  if (!name_regex.test(lname.value)) {
    lname.classList.remove("is-valid");
    lname.classList.add("is-invalid");
    // lname.focus()
  } else {
    lname.classList.add("is-valid");
    lname.classList.remove("is-invalid");
  }
}

function address_fun() {
  if (!address_regex.test(address.value)) {
    address.classList.remove("is-valid");
    address.classList.add("is-invalid");
    // address.focus()
  } else {
    address.classList.add("is-valid");
    address.classList.remove("is-invalid");
  }
}

function age_fun() {
  if (!Number.isInteger(Number(age.value)) || Number(age.value) < 12) {
    age.classList.remove("is-valid");
    age.classList.add("is-invalid");
    // age.focus()
  } else {
    age.classList.add("is-valid");
    age.classList.remove("is-invalid");
  }
}

function submit_register(e) {
  e.preventDefault();
  if (
    !Number.isInteger(Number(age.value)) ||
    Number(age.value) < 12 ||
    !address_regex.test(address.value) ||
    !name_regex.test(fname.value) ||
    !name_regex.test(lname.value)
  ) {
    if (!name_regex.test(fname.value)) {
      fname.focus();
      fname();
    } else if (!name_regex.test(lname.value)) {
      lname.focus();
      lname();
    } else if (!address_regex.test(address.value)) {
      address.focus();
      address_fun();
    } else if (!Number.isInteger(Number(age.value)) || Number(age.value) < 12) {
      age.focus();
      age_fun();
    }
  }
}
