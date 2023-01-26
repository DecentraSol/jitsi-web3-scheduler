A Jitsi web3 scheduler as React component using any EVM blockchain (web3) to book appointments.

Requires the Metamask browser extension.

# Description
Users interact with the Frontend React Calend3 Web3app, viewing the available schedule to book appointments by paying a rate of ETH/min as set by the owner. Once an appointment has been booked, the user receives a confirmation of the appointment booking on the blockchain viewed by etherscan txn hash. The owner of the Calend3 receives ETH and is notified by SMS of the appointment on the blockchain.

# Usage
1. clone this repo and run ```npm i```
2. run ```npx run build``` in order to compile the smart contracts with waffle
3. run ```npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/${API_KEY}``` in a separate console
4. run ```npx hardhat test scripts/test.js``` to run basic tests
5. run ```npx hardhat run --network local scripts/deploy.js``` 
6. copy deployed contract address into:
    - client/src/components/Calendar.js and
    - test/test2.js 
7. run ```npx hardhat test --network local  scripts/test2.js``` to check if contract is deployed
8. run ```npm start``` and open http://localhost:3000 
    - make an appointment 
    - if you are connecting with admin it should be possible to set minutely reate in ETH or other currency


# Todo & Considerations
- when clicking on "join conference" -> check smart contract for current appointments of this address
- when entering a booked conference:
    - the room url must be gathered from the smart contract by the account addresss
    - the room url must be decrypted by metamask https://github.com/MetaMask/eth-simple-keyring
    - when making a booking the room url must be generated randomly and stored encrypted in the smart contract
- booking / invoice email should be sent (by a background service / node?)
- appointments should be made in UTC user should see his tz, admin his tz
- it should be possible to block certain days and day times (in utc)
- it should be possible to pay in different currencies - they should be converted to a default currency at the moment of payment.
- the minutely should be visible in EUR/USD/BTC and current price should be converted from chainlink
- invite other participants
