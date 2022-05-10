# SAFUSCAN API

- copy .env-example to .env
- Generate self-signed certificate for proxy with the commands
`openssl req -x509 -out ./docker-proxy-certs/safu.crt -keyout ./docker/proxy-certs/safu.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")`
- run docker-compose up -d
- Token query is done at : https://localhost:443/api/info with query parameter `address=TOKEN_ADDRESS` and `refresh=BOOLEAN` to renew token info

