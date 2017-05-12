const vendor_helper = {
  modal: {
    StyleFirstOption,
    StyleSecondOption,
    StyleThirdOption,
  },
  field: {
    getBusinessName,
    getBusinessEmail,
    getName,
    getPhone,
    getPaymentOptionId
  }
}
//********************* Field helper functions *********************
// ********************* ********************* *********************
let paymentOptionId, businessEmail, businessName, phone, name

function getPaymentOptionId() {return paymentOptionId}
function getBusinessEmail() {return businessEmail}
function getBusinessName() {return businessName}
function getPhone() {return phone}
function getName() {return name}


//********************* Modal helper functions *********************
// ********************* ********************* *********************

// Closes the modal either when clicking outside the box or on the x.
let modal = document.getElementById('stripe-modal');
let span = document.getElementsByClassName("close")[0];
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
span.onclick = function() {
    modal.style.display= "none";
  }


// Return the payment Option id selected by the user.
function getPaymentOptionId() {
  return paymentOptionId
}

function StyleFirstOption(e){
  businessEmail = $("#business-email1").val();
  businessName = $("#business-name1").val();
  phone = $("#phone1").val();
  name = $("#name1").val();
  paymentOptionId=e.target.id;
  modal.style.display = "block";
}
function StyleSecondOption(e){
  businessEmail = $("#business-email2").val();
  businessName = $("#business-name2").val();
  phone = $("#phone2").val();
  name = $("#name2").val();
  paymentOptionId=e.target.id;
  modal.style.display = "block";
}
function StyleThirdOption(e){
  businessEmail = $("#business-email3").val();
  businessName = $("#business-name3").val();
  phone = $("#phone3").val();
  name = $("#name3").val();
  paymentOptionId=e.target.id;
  modal.style.display = "block";
}
