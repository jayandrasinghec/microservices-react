module.exports = {
  "env": {
    "browser": true,
    "es2020": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    // "plugin:react-extra/all",
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "eslint-plugin-no-inline-styles"
    // "react-extra"
  ],
  "rules": {
    // "react-extra/rule-name": 2,
    "no-inline-styles/no-inline-styles": 2,
    "react/prop-types": 0
  }
};
