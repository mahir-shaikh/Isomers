import { Component, Input, OnInit, OnChanges, OnDestroy,
  ChangeDetectorRef, SimpleChanges,
  SimpleChange, ChangeDetectionStrategy
} from '@angular/core';
import { TextService } from '../text.service';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { Constants } from '../../../config/constants';
import { Subscription } from 'rxjs/Subscription';

/**
 *
 * Component to display text from content json
 *
 */
@Component({
  selector: 'ism-text-output',
  template: `<span *ngIf="asInnerHtml" [innerHTML]="value"></span><ng-template [ngIf]="!asInnerHtml">{{value}}</ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextOutputComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Input binding for text key
   *
   */
  @Input() key: string;
  /**
   * Input binding for yearRef named range
   *
   */
  @Input() yearRef: string;
  /**
   * Input binding for flag to display text as innerHtml instead of a text node.
   *
   */
  @Input() asInnerHtml = false;
  /**
   * Input binding for sceneID reference from content json
   *
   */
  @Input() sceneId: string;
  /**
   * Text content for the text key in content json.
   *
   */
  value: string;
  /**
   * Subscription for Language loaded emitter.
   *
   */
  private subscriber: Subscription;

  /**
   * Constructor for text-output component
   *
   * @param {TextService} textService {@link TextService} instance
   *
   * @param {CommunicatorService} communicator {@link CommunicatorService} instance
   *
   */
  constructor(private textService: TextService, private communicator: CommunicatorService) { }

  /**
   * Initialize subscribers and component with value from content json
   *
   */
  ngOnInit() {

    this.subscriber = this.communicator
      .getEmitter(Constants.TEXT_ENGINE.LANGUAGE_LOADED)
      .subscribe(() => {
        this.updateText();
      });
    this.updateText();
  }

  /**
   * Update text value from content json
   *
   */
  updateText() {
    this.value = this.textService.getTextForYear(this.key, this.yearRef, this.sceneId) ? this.textService.getTextForYear(this.key, this.yearRef, this.sceneId) : this.key;
  }

  /**
   * Update component when any input bindings are changed
   *
   * @param {SimpleChanges} changes SimpleChanges array
   *
   */
  ngOnChanges(changes: SimpleChanges) {
    const change: SimpleChange = changes['key'];
    if (change.isFirstChange()) {
      return;
    }
    this.updateText();
  }

  /**
   * Destroy any subscriptions when component instance is destroyed
   *
   */
  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }
}
