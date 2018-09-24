import { TestBed, inject } from '@angular/core/testing';

import { ChartUtilsService } from './chart-utils.service';
import { CalcServiceStub } from '../../test/calc-service.stub';
import { TextServiceStub } from '../../test/text-service.stub';
import { CalcService, TextService, CommunicatorService, LoggerService } from '../../';
import { Defaults } from './defaults';
import { ChartComponent } from './chart/chart.component';
import { HighchartsStatic } from './highchartsstatic';

let calcService: CalcServiceStub;
let textService: TextServiceStub;
let values: Array<number>,
  component: ChartComponent, fixture;

const dataRefs = ['tlOutputRainfallP1', 'tlOutputRainfallP2', 'tlOutputRainfallP3',
  'tlOutputRainfallP4', 'tlOutputRainfallP5', 'tlOutputRainfallP6',
  'tlOutputRainfallP7', 'tlOutputRainfallP8', 'tlOutputRainfallP9',
  'tlOutputRainfallP10', 'tlOutputRainfallP11', 'tlOutputRainfallP12', 'tlOutputRainfallP13'];
describe('ChartUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartComponent],
      providers: [
        CommunicatorService, LoggerService, HighchartsStatic,
        ChartUtilsService,
        { provide: CalcService, useClass: CalcServiceStub },
        { provide: TextService, useClass: TextServiceStub }
      ]
    })
      .compileComponents();
    values = [];
    calcService = TestBed.get(CalcService);
    textService = TestBed.get(TextService);
    dataRefs.forEach((ref) => {
      const random = Math.random() * 1000000;
      calcService.setValue(ref, random);
      values.push(random);
    });
    calcService.setValue('tlOutputRainfallP13', 'HCM');

    textService.isReady = true;

    textService.textContent.GEN = {
      'Cat1': 'Category 1',
      'Cat2': 'Category 2',
      'Cat3': 'Category 3',
      'Cat4': 'Category 4',
      'Cat5': 'Category 5',
      'Cat6': 'Category 6',
      'Cat7': 'Category 7',
      'Cat8': 'Category 8',
      'Cat9': 'Category 9',
      'Cat10': 'Category 10',
      'Cat11': 'Category 11',
      'Cat12': 'Category 12'
    };
  });


  it('should be created', inject([ChartUtilsService], (service: ChartUtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return correct data for pie charts', inject([ChartUtilsService], (service: ChartUtilsService) => {
    const dataPoints = [
      { name: 'Cat1' }, { name: 'Cat2' }, { name: 'Cat3' },
      { name: 'Cat4' }, { name: 'Cat5' }, { name: 'Cat6' },
      { name: 'Cat7' }, { name: 'Cat8' }, { name: 'Cat9' },
      { name: 'Cat10' }, { name: 'Cat11' }, { name: 'Cat12' },
      { name: 'tlOutputRainfallP13' }
    ];
    let data = service.getDataForPieChart(dataRefs, dataPoints);

    expect(data).toBeDefined();
    expect(data[0].name).toBe('Category 1');
    expect(data[0].y).toBe(values[0]);

    // To get value from CalcService
    expect(data[12].name).toBe('HCM');

    data = service.getDataForPieChart(dataRefs);

    expect(data).toBeDefined();
    expect(data[0]).toBe(values[0]);

    data = service.getDataForPieChart(null);
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  }));

  it('should return correct data for other charts', inject([ChartUtilsService], (service: ChartUtilsService) => {
    const data = service.getDataForChart(dataRefs);

    expect(data).toBeDefined();
    expect(data[0]).toBe(values[0]);
  }));

  it('should return chart defaults', inject([ChartUtilsService], (service: ChartUtilsService) => {
    let defaultOpts = service.getDefaultsFor([Defaults.Bar, Defaults.StackedBar]);
    expect(defaultOpts.plotOptions.bar).toBeDefined();
    expect(defaultOpts.plotOptions.series.stacking).toBe('normal');

    defaultOpts = service.getDefaultsFor([Defaults.Column, Defaults.StackedColumn]);
    expect(defaultOpts.plotOptions.column).toBeDefined();
    expect(defaultOpts.plotOptions.column.stacking).toBe('normal');

    defaultOpts = service.getDefaultsFor([Defaults.Pie, Defaults.Donut]);
    expect(defaultOpts.plotOptions.pie).toBeDefined();

    defaultOpts = service.getDefaultsFor([Defaults.Heatmap]);
    expect(defaultOpts.plotOptions.series).toBeDefined();

    defaultOpts = service.getDefaultsFor([Defaults.Line, Defaults.Scatter]);
    expect(defaultOpts.plotOptions.scatter).toBeDefined();
    expect(defaultOpts.plotOptions.line).toBeDefined();

    defaultOpts = service.getDefaultsFor([Defaults.SolidGauge]);
    expect(defaultOpts.plotOptions.solidgauge).toBeDefined();

    defaultOpts = service.getDefaultsFor([Defaults.Legend]);
    expect(defaultOpts.legend).toBeDefined();

    defaultOpts = service.getDefaultsFor([]);
    expect(Object.keys(defaultOpts).length).toBeDefined(0);
  }));


  it('should return chart svg from charts object', inject([ChartUtilsService], (service: ChartUtilsService) => {
    // expect(service).toBeTruthy();/
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.rangeRef = [['tlOutputRainfallP1', 'tlOutputRainfallP2', 'tlOutputRainfallP3',
      'tlOutputRainfallP4', 'tlOutputRainfallP5', 'tlOutputRainfallP6',
      'tlOutputRainfallP7', 'tlOutputRainfallP8', 'tlOutputRainfallP9',
      'tlOutputRainfallP10', 'tlOutputRainfallP11', 'tlOutputRainfallP12']];
    component.xAxis = {
      'categories': ['Cat1', 'Cat2', 'Cat3',
        'Cat4', 'Cat5', 'Cat6', 'Cat7', 'Cat8', 'Cat9',
        'Cat10', 'Cat11', 'Cat12']
    };
    component.yAxis = { labels: { format: '{value:$0,0a}' } };
    component.seriesOptions = [{ type: 'column', 'name': 'TeamName' }];
    component.chartOptions = {
      'title': { text: 'Test Chart' }, plotOptions:
        {
          column: {
            dataLabels: { enabled: true, format: '{y:$0,0a}' },
            tooltip: { pointFormat: '{point.y:$0,0a}' }
          }
        }
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const svgData = service.getChartAsImageURI(component.chart);
    expect(svgData).toBeDefined();
  }));

});
