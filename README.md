
# Ganache
Installer ganache
```npm install –g ganache-cli```
Démarrer ganache 
```ganache-cli -a 40 -l 0x1C9C380 -h 0.0.0.0```

# Truffle
Installer truffle
```npm install –g truffle```

## Box
Box utilisée : https://www.trufflesuite.com/boxes/drizzle
Initialiser le template : ```npx truffle unbox drizzle```

## Déploiement
Pour déployer sur la blockchain de ganache en réseau de dev
* ```truffle compile```
* ```truffle migrate --network develop```

# Geth

https://geth.ethereum.org/docs/install-and-build/installing-geth*
Installation :
```
sudo add-apt-repository -y ppa:ethereum/ethereum \
sudo apt-get update \
sudo apt-get install ethereum \ 
```

Création de la blockchain en local : ```clef init ```
Renseigner un mot de passe et le conserver Création de deux comptes avec : ```clef newaccount```
Renseigner les mot de passe et les conserver ainsi que le champs address en output des commandes 
