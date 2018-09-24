/**
  * class defining the Authentication Failed error
  * This error is thrown when the api calls to pulse fail with invalid authentication
  * Main reasons are cloudfront cookies missing
  */
export declare class AuthenticationError {
    /**
    * object containing detailed error msg
    */
    originalObj: any;
    /**
    * Flag top check if the user is authenticated or not
    */
    unauthenticated: boolean;
    /**
     * This is the object which contains error message and all other details about the error
     * @param object Any
     */
    constructor(object?: any);
}
