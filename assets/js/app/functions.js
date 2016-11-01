/////////////////////////////////////////////////////////////////
			//////////////////////////**Modal**//////////////////////////////
			/////////////////////////////////////////////////////////////////
			function loading(text){
				if(span.style.display != "inline"){
					console.log("loading :"+text);
					var loading = document.createElement("img");
					loading.src = "images/dashinfinity.gif";
					loading.title = "Loading";

					textModal=document.getElementById("textModal")

					textModal.innerHTML = text+'<br/>';
					textModal.appendChild(loading);
					span.style.display = "none";
					modal.style.display = "inline";

				}else{
					console.log("Loading (Not shown) :"+text);
				}

			}
			function information(text){
				console.log("Information :"+text);
				document.getElementById("textModal").innerHTML = text;
				modal.style.display = "inline";
				span.style.display = "inline";
			}
			function genWalletButton(){
				if(checkUiGenerate()){
					genWallet(params,walletPasswordGen, options);
				}
			}
			function uploadButtonClick () {

			}
			function checkUiGenerate(){
			err='';
				if(walletPasswordGen.length<9){
					err += "Enter a strong password (at least 9 characters). ";
				}

				if(nbrKeyRecover> nbrKeyGen){
					err += "The number of recovery keys requiered to recover the wallet must be inferior to the total amount of keys. ";
				}
				if(document.getElementById("nbrKeyRecover").value<2){
					err += "The minimum number of - requiered - recovery keys is 2. ";
				}
				if(document.getElementById("nbrKeyGen").value<2){
					err += "The minimum number of recovery keys to be generated is 2. ";
				}

				if(err.length==0){
					return true;
				}else{
					information(err);
					return false;
				}
			}
			function checkUiRecover(){
				err='';
				if(walletPasswordReco.length<9){
					err += "Enter a strong password for the creation of your new keystore (at least 9 characters). ";
				}

				if(document.getElementById("inputAddress").value.length<32 && document.getElementById("inputAddress").value!="?"){
					err += "Enter your ethereum address. This will make sure that the recovery process worked. If you don't know your private key, put \"?\" in the address field. In this case the application cannot garanty that the recovery process worked.";
				}
				if(getKeyUI().length<2){
					err += "Enter (at least) 2 recovery keys. You might need more than 2 keys, depending of your settings used for the generation of the keys.";
				}

				if(err.length==0){
					return true;
				}else{
					information(err);
					return false;
				}
			}

			function getKeyUI(){
				combine = [];
				x = document.getElementsByName("keyField");
				addressInput = document.getElementById("inputAddress").value.replace (/(^\s*)|(\s*$)/gi, "");
				for (i = 0; i < x.length; i++) {
					if (x[i].value.length  > 3) {
						//Clean the string and push it into a table
						combine.push(x[i].value.replace (/(^\s*)|(\s*$)/gi, ""));
					}
				}
				return combine;
			}

			function genWallet(params,password, options) {
				loading("Creation of the private key.");
				keythereum.create(params, function (dk) {
					loading("Creation of the keystore.");
					keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, function (keyObject) {
						//Put the address of the wallet in the user interface
						setAddress(keyObject.address);
						loading("Creation of recovery keys.");
						createRecoveryKeys(password,keyObject);

					});
				});
			}

			function createRecoveryKeys (password,keyObject){
				try{
					privateKey = keythereum.recover(password, keyObject);
					hexprivateKey = privateKey.toString('hex');
					shares = secrets.share(hexprivateKey, nbrKeyGen, nbrKeyRecover);
					information("The keystore can be downloaded. <br />");
					downloadKeyStore(keyObject, "Download the wallet");
					generateKeyFields(shares);

				}catch(err) {
					if(err.message=="message authentication code mismatch") {
						information("Wrong password");
					}else{
						information(err.message);
					}

				}
				//Reset the upload form
				document.getElementById('uploadWallet').value = "";


			}


			function generateKeyFields(fields){
				//show the recovery keys
				var i = 0;
				var keys = document.getElementById("keys");
				keys.innerHTML='';
				var copyButton='';
				var noEditableField = '';
				while (fields[i]){
					if(fields[i].length>3){
						copyButton = '<button class="clipboard" data-clipboard-target="#key'+i+'">copy</button>';
						noEditableField = ' readonly '
					}
					keys.innerHTML +=
					'<p> <input  id="key'+i+'" type="text" style="width:40em;display: inline;" name="keyField" value="'+fields[i]+'" '+noEditableField+'>'+copyButton+'</p>';

					i++;
				}
				//if the first row is empty, it means that there is no need for integrity check
				if(fields[0].replace (/(^\s*)|(\s*$)/gi, "")!=''){
					//generate the integrity check field
					integrityHashes.readonly = "enable";
					integrityHashes.innerHTML = hashTable(fields);

				}



			}
			function combineKeys(){

					if(checkUiRecover()){
						privateKey=secrets.combine(getKeyUI());
						try {

							//Generate random initialisation vector and salt for AES encryption of the private key
							iv = CryptoJS.lib.WordArray.random(params.ivBytes).toString();
							salt = CryptoJS.lib.WordArray.random(params.keyBytes).toString();

							//Dump the key store
							keythereum.dump(walletPasswordReco, privateKey, salt, iv, options, function (keyObject) {
								if(addressInput==keyObject.address || addressInput=="?") {

									if(addressInput!="?") {
										information("The recovery process worked. You can download your recovered keystore!");
									}else{
										information("The recovery process is finish without any garanty of success because you did not provide your Ethereum address. The Ethereum address recovered is "+keyObject.address+". You can download your recovered keystore!");
									}
									downloadKeyStore(keyObject, "Download the recovered keystore");
								}else{
									information("The recovered address does not match with your address. Are you sure that ALL the keys are correct? ");
								}
							});
						}
						catch(err) {
							information(err.message);
						}
					}




			}



			function  downloadKeyStore(keyObject, buttonText){
				//Update the upload button
					var modal =document.getElementById("textModal");
					var a = document.createElement('a');
					a.setAttribute('href','data:application/json;charset=utf-8,'+ encodeURIComponent(JSON.stringify(keyObject)));
					a.download = keyObject.id+".json";
					a.innerHTML = buttonText;
					a.className = "button big";
					modal.appendChild(a);

			}
			function setAddress(address){
				document.getElementById("inputAddress").value = address;
			}

			function  hashTable(keys) {
				hashRes ='';
				for (i = 0; i < keys.length; i++) {
					keyId = keys[i].charAt(1)+keys[i].charAt(2)+keys[i].charAt(3)+keys[i].charAt(4);
					hashRes += keyId+CryptoJS.SHA1(keys[i]).toString()+"\r";
				}
				return hashRes;
			}
			function compareIntegrity(recoveryKey, integrityHash) {
				integrityHashId = integrityHash.charAt(1)+integrityHash.charAt(2)+integrityHash.charAt(3)+integrityHash.charAt(4);
				recoveryKeyId = integrityHash.charAt(1)+integrityHash.charAt(2)+integrityHash.charAt(3)+integrityHash.charAt(4);
				integrityHash = integrityHash.replace (/(^@test@$)/gi, "");
				if(integrityHashId != recoveryKeyId){
					console.log("The comparaison cannot be perform because keys are differents.")
					console.log(integrityHashId +" "+recoveryKeyId);
				}else{
					console.log("The key are comparable.")
					if(integrityHash==CryptoJS.SHA1(recoveryKey)){
						console.log("success");
					}else {
						console.log(integrityHash+"------"+CryptoJS.SHA1(recoveryKey));
					}
				}
			}
