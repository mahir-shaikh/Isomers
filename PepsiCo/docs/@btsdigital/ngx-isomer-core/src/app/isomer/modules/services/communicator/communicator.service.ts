import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as Collections from 'typescript-collections';
import { LoggerService } from '../logger/logger.service';


/**
 * The service that is responsible for all cross component/service communication using RxJs/Observables.
 *
 * The CommunicatorService makes use of rxjs/Subject to trigger events when needed.
 */
@Injectable()
export class CommunicatorService {

  /**
   * Emitters dictionary for storing emitter keys and subject pair
   *
   */
  private emitters: Collections.Dictionary<string, Subject<any>> = new Collections.Dictionary<string, Subject<any>>();

  /**
   * Constructor function for Communicator service
   *
   * @param {LoggerService} logger Logger service reference for any and all logging requirements
   *
   */
  constructor(private logger: LoggerService) { }

  /**
   * Returns the emitter pair from the emitters dictionary.
   *
   * @param {string} emitterKey The key for emitter reference in emitters dictionary.
   *
   * @return {Subject<any>} The emitter reference for the given emitterKey.
   */
  getEmitter(emitterKey: string): Subject<any> {
    if (!this.emitterExists(emitterKey)) {
      this.createEmitter(emitterKey);
    }
    return this.emitters.getValue(emitterKey);
  }

  /**
   * Triggers an event on the emitter subject with optional data
   *
   * @param {string} emitterKey The key for emitter reference in emitters dictionary.
   *
   * @param {data} [data] Data to be passed along with the event trigger on the Subject
   */
  trigger(emitterKey: string, data?: any): void {
    // consider if we want to create an emitter and emit if its not created already
    // emit data/event if emitter exists
    if (this.emitterExists(emitterKey)) {
      this.emitters.getValue(emitterKey).next(data);
    }
  }

  /**
   * Create a new emitter pair and add it to the emitters dictionary
   *
   * @param {string} emitterKey The key for emitter reference in emitters dictionary.
   *
   */
  createEmitter(emitterKey: string): void {
    if (this.emitterExists(emitterKey)) {
      this.logger.log('Emitter for ' + emitterKey + ' already exists!');
      return;
    }
    this.emitters.setValue(emitterKey, new Subject<any>());
  }

  /**
   * Check if the emitter exists for the given dictionary key
   *
   * @param {string} emitterKey The key for emitter reference in emitters dictionary.
   *
   * @return {Boolean} True/False value depending on whether emitter exists
   */
  emitterExists(emitterKey: string): Boolean {
    return this.emitters.containsKey(emitterKey);
  }

}
