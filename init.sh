# Ubuntu

## Installing node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completio

nvm install node
npm install -g yarn pm2 typescriptnode

## Installing docker
https://docs.docker.com/engine/install/ubuntu/
sudo apt  install docker-composeA


## Installing SSL certs

sudo apt-get update &&
sudo apt-get install software-properties-common &&
sudo add-apt-repository universe &&
sudo apt-add-repository -r ppa:certbot/certbot &&
sudo apt-get update &&
sudo apt-get install certbot

sudo certbot certonly --manual --preferred-challenges dns