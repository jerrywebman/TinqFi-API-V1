heroku redis:cli -a tinqfi-api
heroku config -a tinqfi-api  
heroku logs --tail

//tatum
tatum-kms generatewallet BTC --testnet //generate wallet
tatum-kms generatemanagedwallet BTC --testnet // generatemanagedwallet
tatum-kms export // check ur wallets
