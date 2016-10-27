
generateKeyFields([' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']); //Generate 10 empty field for recovery keys
var wallet;


new Clipboard('.clipboard'); //initiate the click to copy lib 
var walletPasswordGen = '';
var walletPasswordReco = '';


var params = { keyBytes: 32, ivBytes: 16 }; // optional private key and initialization vector sizes in bytes
var options = {		//Keystore parameters 
	kdf: "pbkdf2",
	cipher: "aes-128-ctr",
	kdfparams: {
		c: 262144,
		dklen: 32,
		prf: "hmac-sha256"
	}
};

var kdf = "pbkdf2"; //Key export variables

var modal = document.getElementById('loading');  // Get the modal
var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
modal.style.display = "none"; //Hide the modal
span.style.display = "none"; //Hide zhe close button in the modal

/////////////////////////////////////////////////////////////////
			//////////////////////////**Events**//////////////////////////////
			/////////////////////////////////////////////////////////////////
			// When the user clicks on <span> (x), close the modal
			span.onclick = function() {
				modal.style.display = "none";
				span.style.display = "none";
			}

			// When the user clicks anywhere outside of the modal, close it
			window.onclick = function(event) {
				if (event.target == modal) {
					modal.style.display = "none";
					span.style.display = "none";
				}
			}
			
			//event upload wallet
			document.getElementById('uploadWallet').onchange = function() {
				if(checkUiGenerate()){
					var file = document.getElementById("uploadWallet").files[0];
					if (file) {
						var reader = new FileReader();
						reader.readAsText(file, "UTF-8");
						reader.onload = function (evt) {
							loading("The file has been sucessfully opened.");		
							createRecoveryKeys(walletPasswordGen,JSON.parse(evt.target.result));
						}
						reader.onerror = function (evt) {
							information("The file is not readable.");
						}
					}
				}else{
					//Stop the file uploading process
					document.getElementById('uploadWallet').value = "";
				}
			};
			
			//Event to update the generation password  variable on change
			document.getElementById('walletPasswordGen').onchange = function() {
				walletPasswordGen = document.getElementById('walletPasswordGen').value;
			}
			//Event to update the password variable for the recovered wallet
			document.getElementById('walletPasswordReco').onchange = function() {
				walletPasswordReco = document.getElementById('walletPasswordReco').value;
			}
			//Event to update the nbrKeyRecover variable on change 
			document.getElementById('nbrKeyRecover').onchange = function() {
				 nbrKeyRecover = parseInt(document.getElementById("nbrKeyRecover").value);
			}

			//Event to update the nbrKeyGen variable on change
			document.getElementById('nbrKeyGen').onchange = function() {
				nbrKeyGen = parseInt(document.getElementById("nbrKeyGen").value);
			}