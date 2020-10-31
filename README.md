[![CircleCI](https://circleci.com/gh/maxwfreu/Scrumptious/tree/master.svg?style=svg&circle-token=04eae26fa0145948978ca797afc5b2be5852e75e)](https://circleci.com/gh/maxwfreu/Scrumptious/tree/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/318c506dcc474d33bc172f5ad8ec0b57)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=maxwfreu/Scrumptious&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/318c506dcc474d33bc172f5ad8ec0b57)](https://www.codacy.com?utm_source=github.com&utm_medium=referral&utm_content=maxwfreu/Scrumptious&utm_campaign=Badge_Coverage)

# Scrumptious
A chrome extension that turns your new tab into a kanban board!

1. [Getting Started](#getting-started)
2. [Local Development](#local-development)
    1. [Running the dev server](#running-the-dev-server)
    2. [Chrome development](#chrome-development)
3. [Running tests](#running-tests)
4. [Building](#building)
5. [Deployments](#deployments)
    1. [Pre Deployment](#pre-deployment)
    2. [Deploying](#deploying)
6. [Contributing](#contributing)

## Getting started
1. `npm i`
  - Requires Node 15 or greater
2. `npm start`
3. Visit [localhost:8080](https://localhost:8080)

## Local Development

### Running the dev server
1. `npm start`

### Chrome development
1. Build the application
   - `npm run build` - prod build
   - `npm run build-staging` - staging env
   - `npm run build-demo` - demo build (demo.scrumptioustab.com)
   - `npm run build-firefox` - firefox specific build ( unstable ) 
2. In chrome, go to chrome://extensions
3. Toggle "developer mode", found on the top right
4. On the left, select "Load Unpacked" and select the `dist` folder generated in the build
5. Open the new tab and you should see the app

## Running tests
Tests are ran with `jest` and `enzyme`
1. `npm run test`

## Building
1. `npm run build`

## Deployments

### Pre deployment
1. QA all the things.
    1. Does the application work for fresh installs?
    2. Does the application work with existing data?
    3. Does the application work for users with older extension versions?
2. Verify tests pass
3. Verify test coverage does not decrease

### Deploying
1. Increase the version number in `manifest.json`
2. Remove the existing `dist` folder if any
3. `npm run build`
4. Zip the build file, upload it in the Chrome developer console

## Contributing
Find a bug? Want a feature? Want to change some bad code? Please open an issue! There are a few issue templates to choose from so select the one that is most relevant to the issue you are opening. Please provide as much detail as possible :)

This project is newly open source, and there is a lot of work to be done!

Any questions? Contact me at mfreundlich1@gmail.com
