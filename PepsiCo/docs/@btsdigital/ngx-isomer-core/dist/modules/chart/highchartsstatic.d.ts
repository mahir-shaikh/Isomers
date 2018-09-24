import * as Highcharts from 'highcharts';
/**
 * HighchartsStatic library to provide highcharts instance with extra modules and plugins
 *
 */
export declare class HighchartsStatic {
    /**
     * Highcharts instance
     *
     */
    private _highchartsStatic;
    /**
     * HighchartsStatic service constructor
     *
     * We extend the highcharts instance with modules and plugins when we instantiate this service
     *
     */
    constructor();
    /**
     * Returns a reference to _highchartsStatic member
     *
     * @return {Highcharts.Static}
     *
     */
    getHighchartsStatic(): Highcharts.Static;
}
