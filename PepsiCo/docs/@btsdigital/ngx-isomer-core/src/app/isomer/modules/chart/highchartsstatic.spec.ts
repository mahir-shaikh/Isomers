import { TestBed, inject } from '@angular/core/testing';
import * as Highcharts from 'highcharts';
import { HighchartsStatic } from './highchartsstatic';

let hcStatic: Highcharts.Static, fixture,
  chartConfig: Highcharts.Options;
describe('HighchartsStatic service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        HighchartsStatic
      ]
    });

    fixture = document.createElement('div');
    chartConfig = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Browser market shares January, 2015 to May, 2015'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:} %',
                    style: {
                        color: 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Brands',
            data: [{
                name: 'Microsoft Internet Explorer',
                y: 56.33
            }, {
                name: 'Chrome',
                y: 24.03,
                sliced: true,
                selected: true
            }, {
                name: 'Firefox',
                y: 10.38
            }, {
                name: 'Safari',
                y: 4.77
            }, {
                name: 'Opera',
                y: 0.91
            }, {
                name: 'Proprietary or Undetectable',
                y: 0.2
            }]
        }]
    };
  });


  it('should be created', inject([HighchartsStatic], (service: HighchartsStatic) => {
    expect(service).toBeTruthy();

    hcStatic = service.getHighchartsStatic();
    chartConfig.chart.renderTo = fixture;
    const chart = hcStatic.chart(chartConfig);
    expect(chart).toBeDefined();
  }));
});
