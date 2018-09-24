# Isomer Core Modules

Core modules package that provide utility modules and services that form the core of every Isomer based application.

## Usage

### Installation
- __Install core modules__

    `npm install git+ssh://git+ssh://git@bitbucket.org/btsdigital/ngx-isomer-core.git#v1.0.0-beta.4`

- __Install peer dependencies__

    Once the Isomer-Core modules package is installed, install its peer dependencies.

### Import
Import the core module in the app module of your project.

    ...
    import { IsomerCoreModule } from '@btsdigital/ngx-isomer-core';
    @NgModule({
        declarations: [
            ...
        ],
        imports: [
            ...
            IsomerCoreModule
        ],
        providers: [],
        bootstrap: [...]
      })
      export class AppModule { }

## Extending Isomer Core Modules

### Setup
Clone this repository from bitbucket at <https://bitbucket.org/btsdigital/ngx-isomer-core>

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma].


### Unit tests coverage report

Run 'npm run test:coverage' to generate unit tests coverage report under coverage folder.

### Generating Documentation

Run `npm run docs` to generate documentation under docs folder.
