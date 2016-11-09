1. Infomation here https://github.com/aws/amazon-cognito-identity-js
2. Setup amazon-cognito-identity-js using npm and webpack
  - Create pakage.json file:
      {
      "private": true
      }
  -  npm install --save-dev webpack json-loader
     npm install --save amazon-cognito-identity-js
  After commands above, the pakage.json is updated with dependencies.
  - create webpack.seting.js
  - add to pakage.json:
      "scripts": {
      "build": "webpack"
      }
  - install with : npm run build
  - watch webpack working using an other terminal tab:
    node_modules/.bin/webpack --watch    
3. In Cognito web console:
  - Create a UserPool, note out following informations:
    + UserPoolId
    + userPoolClientId(App client id)
  *Note: When creating the App, the generate client secret box must be unchecked because the JavaScript SDK doesn't support apps that have a client secret.*
  - In Federated Identity
    + Create Identity pool
    + In Authentication Provider add a Amazon Provider using UserPoolId and AppClientId are created above.
