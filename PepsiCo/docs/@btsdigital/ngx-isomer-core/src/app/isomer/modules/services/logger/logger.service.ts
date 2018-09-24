import { Injectable } from '@angular/core';

/**
 * Logger service to log information to console
 *
 */
@Injectable()
export class LoggerService {
  /**
   * Internal status flag for whether the service is logging to console or not
   *
   */
  private isLogging: boolean;

  /**
   * Constructor for initializing the service
   *
   */
  constructor() {
    this.isLogging = true;
  }

  /**
   * Log method, used for logging messages to console
   *
   * @param {(string|Number)} msg This is the message to be logged
   *
   * @param {Array<any>} ...args Any additional parameters to be logged to console
   *
   */
  log(msg: string|Number, ...args) {
    if (this.isLogging) {
      if (args.length) {
        console.log(msg, args);
      } else {
        console.log(msg);
      }
    }
  }

  /**
   * Method to toggle logging mode of the service
   *
   * @param {Boolean} enableTrueDisableFalse Logging mode for the service
   */
  enableLogging(enableTrueDisableFalse: Boolean = true) {
    this.isLogging = !!enableTrueDisableFalse;
  }
}
