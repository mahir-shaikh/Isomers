import { OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { TextService } from '../text.service';
import { CommunicatorService } from '../../services/communicator/communicator.service';
/**
 *
 * Component to display text from content json
 *
 */
export declare class TextOutputComponent implements OnInit, OnChanges, OnDestroy {
    private textService;
    private communicator;
    /**
     * Input binding for text key
     *
     */
    key: string;
    /**
     * Input binding for yearRef named range
     *
     */
    yearRef: string;
    /**
     * Input binding for flag to display text as innerHtml instead of a text node.
     *
     */
    asInnerHtml: boolean;
    /**
     * Input binding for sceneID reference from content json
     *
     */
    sceneId: string;
    /**
     * Text content for the text key in content json.
     *
     */
    value: string;
    /**
     * Subscription for Language loaded emitter.
     *
     */
    private subscriber;
    /**
     * Constructor for text-output component
     *
     * @param {TextService} textService {@link TextService} instance
     *
     * @param {CommunicatorService} communicator {@link CommunicatorService} instance
     *
     */
    constructor(textService: TextService, communicator: CommunicatorService);
    /**
     * Initialize subscribers and component with value from content json
     *
     */
    ngOnInit(): void;
    /**
     * Update text value from content json
     *
     */
    updateText(): void;
    /**
     * Update component when any input bindings are changed
     *
     * @param {SimpleChanges} changes SimpleChanges array
     *
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Destroy any subscriptions when component instance is destroyed
     *
     */
    ngOnDestroy(): void;
}
