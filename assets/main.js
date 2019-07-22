function openForm(){
	hide("div-button-widget")
	show("div-form-widget")
}

function closeForm(){
	hide("div-form-widget")
	show("div-button-widget")
	hide("info-message-error")
	hide("info-message-success")
	document.getElementById("input-name").value = ""
	document.getElementById("input-telp").value = ""
	document.getElementById("input-email").value = ""
}

function hide(el){
	eLement = document.getElementById(el)
	eLement.style.display = 'none'
}

function show(el){
	eLement = document.getElementById(el)
	eLement.style.display = 'block'
}

function submitCall(){
	document.getElementById("info-message-error").innerHTML = ""

	var inputName = document.getElementById('input-name').value
	var inputTelp = document.getElementById('input-telp').value
	var inputEmail = document.getElementById('input-email').value

	var inputError = ""
	// alert(inputName + " " + inputTelp + " " + inputEmail );

	if (statusName) {
		if (inputName == "") {
			inputError += "&diams; The name is required!<br>";
		}	
	}
	 
	if (statusPhone) {
		if (inputTelp == "") {
			inputError += "&diams; The telephone is required!<br>";
		}	
	}
	 
	if(statusEmail){
		if (inputEmail == "") {
			inputError += "&diams; The email is required!<br>";
		} 
		else {
			if (!validateEmail(inputEmail)) {
				inputError += "&diams; The email not valid!<br>";
			} 
		}
	}
	
	if (inputError == "") {
		hide("info-message-error");
	} else {
		show("info-message-error");
		document.getElementById("info-message-error").innerHTML = inputError;	
	}
	
	if (statusPhone) {
		if (inputTelp != "") {
			checkApiNumber(inputTelp)
		}	
	}
	
}

function checkApiNumber(number){
	var url = "http://apilayer.net/api/validate?access_key=d9181dee0913ff70ac53a44013b1f399&number="+number
	var status = false

	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'json'
	})
	.done(function(result) {
		if (result.success == false) {
			show("info-message-error");
			document.getElementById("info-message-error").innerHTML += "&diams; " + result.error.info
		} else {
			if (result.valid) {
				hide("info-message-error")
				show("info-message-success")
			} else {
				show("info-message-error")
				document.getElementById("info-message-error").innerHTML += "&diams; The phone number not valid!"
			}
		}
	});
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$(document).on('submit', '#form-setting-widget', function(event) {
	event.preventDefault();
	
	closeForm()
	var inputs = $('#form-setting-widget input[type=radio]:checked');
    var values = {};
    inputs.each(function() {
        values[this.name] = $(this).val();
    });
    console.log(values);

    /* kiosk ({	
		"vertical"	: "top", 
		"horizontal": "bottom", 
		"name"		: 1, 
		"phone"		: 1, 
		"email"		: 0 
	}); */

	kiosk(values);
});

/* global variable */
var statusName = "";
var statusPhone = "";
var statusEmail = "";
/* end */

function kiosk(dataJson){
	$('#btn-call-now').show()
	$('#widget').removeAttr('style');

	if (dataJson.vertical == "top" ) {
		$('#widget').css("top",'0');
	} if (dataJson.vertical == "bottom" ) {
		$('#widget').css("bottom",'0');
	} if (dataJson.horizontal == "left") {
		$('#widget').css("left",'0');
	} if (dataJson.horizontal == "right") {
		$('#widget').css("right",'0');
	}
	
	$('#widget').css({
		"position": "fixed",
		"z-index": "122",
		"padding": '10px',
	});

	if (dataJson.showName == 1) {
		statusName = 1
		$('#input-name').show()
	} else {
		$('#input-name').hide()
		statusName = 0
	}

	if (dataJson.phone == 1) {
		statusPhone = 1
		$('#input-telp').show()
	} else {
		statusPhone = 0
		$('#input-telp').hide()
	}

	if (dataJson.email == 1) {
		statusEmail = 1
		$('#input-email').show()
	} else {
		statusEmail = 0
		$('#input-email').hide()
	}

	if (dataJson.showName == 0 && dataJson.phone == 0 && dataJson.email == 0) {
		$('#btn-call-now').hide()
	}
}