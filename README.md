# Truffle

## Installer Truffle

Installer NodeJS , version > 7

* ```npm install –g truffle```
* ```npm install –g ganache-cli```

## Box

Box utilisée : https://www.trufflesuite.com/boxes/drizzle
Initialiser le template : ```npx truffle unbox drizzle```

### Déploiement

Démarre la console de développement : ```truffle develop```
Dans la console dev effectuer :

* ```compile```
* ```migrate```

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
