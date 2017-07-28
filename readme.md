# Important note
At the present time this project is experimental, do not use this application for any other purpose than testing. It has only been tested successfully with Chrome. It does not work with Safari.

# Use case
I was initially looking for a password-less solution that ensures the confidentiality, the integrity and the availability of my private keys. So I created this web application that generates recovery keys to be distributed to a "semi-trusted" third-party.

Why password-less? Because I change my passwords on a regular basis and so changing the passwords of my keystores imply to update its backups. Life is too short for this.

#What is a "semi-trusted" party
A "semi-trusted" party is an entity (computer, human or whatever) that will keep ONE recovery key secured in "best effort". In case that one semi-trusted party:
* disappear: you can still rely on the other parties to recover your private key.
* is corrupted (e.g. : cloud provider is hacked): no one else can recover your private key, unless he has enough recovery keys for that.
The number of recovery key required to recover the wallet is configurable and must be adapted to your threat model.

# Cryptographic algorithm
This mechanism of "recovery keys" is enforced by the Shamir's Secret Sharing algorithm. It is a method for distributing a secret amongst a group of participants, each of whom is allocated a share of the secret. The secret can be reconstructed only when a sufficient number, of possibly different types, of shares are combined together; individual shares are of no use on their own. More information: https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing

# Security recommendations
The security efficiency of this solution relies on the following points:
Participants (people, systems, cold storage, etc.) will ensure confidentiality, integrity and availability of the recovery keys in "best effort".
* Use a **TRUSTED** computer to generate the keys
* Use **DIFFERENT** channels to communicate the recovery keys to each participant (hand-to-hand, encrypted chat/mail, etc.)
* **DELETE** any copy of the recovery key once it is received by participants (don't forget mail/chat history).
* **TEST** the recovery process on a regular basis. It can also be an opportunity to regenerate the keys
* **ENSURE** that every human participant understand the criticality of the request.
* No more than **ONE** recovery key per semi-trusted party.

# Process
* Creation of the recovery keys :
  1. Extract the private key from the Ethereum Keystore (imported or generated)
  2. Split of the private key into X recovery keys (using the Shamir's Secret Sharing algorithm)
* Recovery process :
  3. Recover the private key from the provided recovery keys (using the Shamir's Secret Sharing algorithm)
  4. Generate a new keystore, that can be imported into a wallet


# Technical implementation
This application uses the following javascript libraries:
* crypto-js: https://github.com/brix/crypto-js
* keythereum: https://github.com/ethereumjs/keythereum
* secrets.js: https://github.com/amper5and/secrets.js/

# Improvements to come
* Integrity-check of each key provided by semi-trusted parties
* Make this application compliant with bitcoin
