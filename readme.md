yarn install
yarn build
docker build -t joancipria/trusted-issuers-list-ui:latest .
docker push joancipria/trusted-issuers-list-ui:latest 
   kubectl apply -f trust-anchor-ui.yaml