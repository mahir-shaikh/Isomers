/**
 * Logger service to log information to console
 *
 */
export declare class LoggerService {
    /**
     * Internal status flag for whether the service is logging to console or not
     *
     */
    private isLogging;
    /**
     * Constructor for initializing the service
     *
     */
    constructor();
    /**
     * Log method, used for logging messages to console
     *
     * @param {(string|Number)} msg This is the message to be logged
     *
     * @param {Array<any>} ...args Any additional parameters to be logged to console
     *
     */
    log(msg: string | Number, ...args: any[]): void;
    /**
     * Method to toggle logging mode of the service
     *
     * @param {Boolean} enableTrueDisableFalse Logging mode for the service
     */
    enableLogging(enableTrueDisableFalse?: Boolean): void;
}
