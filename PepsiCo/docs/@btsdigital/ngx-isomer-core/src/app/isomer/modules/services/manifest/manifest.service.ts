
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Connect } from '../../connect/interfaces';



/**
  * This class is a wrapper for the manifest configuration which will be injected on app initilisation
  */
@Injectable()
export class ManifestService {
  /**
   * This is a private variable that is used to store the state which is always current
   */
  private _state: BehaviorSubject<Connect.Manifest>;
  /**
  * This is a public variable that is used to manipulate the state which is always current
  */
  public State: any;
  /**
  * This is a private variable that is used to store the manifest configuration
  */
  private configuration: Connect.Manifest;

  /**
   * This function will set the configuration for the various isomer services
   *
   * @param {Connect.Manifest} config config object typed to Connect.Manifest inteface
   *
   * @return nothing
   */
  public setConfig(config: Connect.Manifest): void {
    this.configuration = config;
    this.validateManifest();
    this._state = <BehaviorSubject<Connect.Manifest>>new BehaviorSubject(this.configuration);
    this.State = this._state.asObservable();
  }

  /**
  * This is a private function which is called internally to check if the configuration has correct structure and no null values
  * that could break the code later
  */
  private validateManifest(): void {
    if (this.configuration.config.questionsToSend && this.configuration.config.questionsToReceive) {
      this.loopQuestions('questionsToSend');
      this.loopQuestions('questionsToReceive');
    } else {
      throw new Error('Both config.questionsToSend and config.questionsToReceive must be present in manifest');
    }
    if (!this.configuration.config.hostName || !this.configuration.config.eventTitle) {
      throw new Error('config.hostName and config.eventTitle must both be present in the manifest');
    }
  }

  /**
   *
   * This is a private function which is called internally to check if the configuration has correct structure and no null values
   * that could break the code later
   *
   * @param listName could be either questionsToSend or questionsToRecieve
   */
  private loopQuestions(listName): void {
    const list = listName === 'questionsToSend' ? this.configuration.config.questionsToSend : this.configuration.config.questionsToReceive;
    list.forEach((q, i) => {
      if (!q.questionName || !q.rangeName) {
        throw new Error('Manifest inconsistency found at config.' + listName + ' at index: ' + i + ' (Missing rangeName or questionName)');
      }
    });
    for (const i of Object.keys(list)) {
      const q = list[i];
      if (!q.questionName || !q.rangeName) {
        throw new Error('Manifest inconsistency found at config.' + listName + ' at index: ' + i + ' (Missing rangeName or questionName)');
      }
    }
  }

  /**
  * This function will set the current state of manifest configuration
  *
  * @param {Connect.Manifest} config config object typed to Connect.Manifest inteface.
  *
  * @return nothing
  */
  SetState(state: Connect.Manifest): void {
    this._state.next(state);
  }

  /**
  * This function will get the next state of configuration
  *
  * @return {Connect.Manifest} updated version of config object typed to Connect.Manifest inteface.
  *
  */
  Get(): Connect.Manifest {
    return this._state.getValue();
  }

}






















