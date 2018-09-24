import { Connect } from '../../connect/interfaces';
/**
  * This class is a wrapper for the manifest configuration which will be injected on app initilisation
  */
export declare class ManifestService {
    /**
     * This is a private variable that is used to store the state which is always current
     */
    private _state;
    /**
    * This is a public variable that is used to manipulate the state which is always current
    */
    State: any;
    /**
    * This is a private variable that is used to store the manifest configuration
    */
    private configuration;
    /**
     * This function will set the configuration for the various isomer services
     *
     * @param {Connect.Manifest} config config object typed to Connect.Manifest inteface
     *
     * @return nothing
     */
    setConfig(config: Connect.Manifest): void;
    /**
    * This is a private function which is called internally to check if the configuration has correct structure and no null values
    * that could break the code later
    */
    private validateManifest();
    /**
     *
     * This is a private function which is called internally to check if the configuration has correct structure and no null values
     * that could break the code later
     *
     * @param listName could be either questionsToSend or questionsToRecieve
     */
    private loopQuestions(listName);
    /**
    * This function will set the current state of manifest configuration
    *
    * @param {Connect.Manifest} config config object typed to Connect.Manifest inteface.
    *
    * @return nothing
    */
    SetState(state: Connect.Manifest): void;
    /**
    * This function will get the next state of configuration
    *
    * @return {Connect.Manifest} updated version of config object typed to Connect.Manifest inteface.
    *
    */
    Get(): Connect.Manifest;
}
