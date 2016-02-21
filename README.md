# Getting started

## Setting up the dev environment
If you're setting up your environment to work on this project, there's a few things to do before you can start:

1. Install node 0.10.32
1. Install Java
1. Install Firefox
1. cd to the root of the source directory (where this file is)
1. Run `npm run setup-dev-env`
3. Ensure you have the proper values for `AZURE_STORAGE_KEY` and `AZURE_STORAGE_ACCOUNT` set in your environment.

## Running the tests

In order to run the tests:

1. Launch the server itself with `npm start` (http://localhost:3000)
2. In parallel, launch the Selenium server with `webdriver-manager start`
3. Launch the test suite with `npm test`
