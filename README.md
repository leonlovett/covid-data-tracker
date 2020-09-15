# CovidDataTracker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Back-End setup

This application uses firebase cloud functions and firestore to manage the backend data. It pulls from the mathdroid api at regular intervals and shapes the data for consupmtion by the front-end.

The code for the cloud functions are in the `functions` folder. You will need to connect the application to your own firebase account or add the functions and database setup to your platform of choice.

## Deploy to Production

This project is setup to use Firebase Hosting. You will need to connect this project to your own Firebase account. After connected all you need to do is run the following commands to deploy.
```
npm run build
firebase deploy
```

If you would prefer to not host the application with Firebase, you would run `npm run build`, then upload the contents of the dist folder to your server.
