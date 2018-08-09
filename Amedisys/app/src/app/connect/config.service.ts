import { Injectable } from '@angular/core'

@Injectable()
export class ConfigService {
    public CONNECT_TO_PULSE: boolean = process.env.CONNECT_TO_PULSE === 'true';

    constructor() {}
}

