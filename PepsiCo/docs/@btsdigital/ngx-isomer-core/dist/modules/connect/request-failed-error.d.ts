/**
* class defining the Request Failed error
* This is thrown when the http request call fails
* reason could be an http error or netwrok error
*/
export declare class RequestFailedError {
    /**
    * Flag top check if error is thrown after api call was success or it threw before getting connectivity
    */
    success: boolean;
    /**
    * Any error messages associated with the error
    */
    message: string;
    /**
     * This is any object which would send the error message and any details related to the error
     * @param res Any
     * */
    constructor(res: any);
}
