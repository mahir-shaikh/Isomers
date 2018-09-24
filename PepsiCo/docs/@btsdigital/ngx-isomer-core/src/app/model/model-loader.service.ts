import { Injectable } from '@angular/core';
import * as model from './index.js';

@Injectable()
export class ModelLoaderService {
    constructor() {}

    getModel() {
        return model;
    }
}
