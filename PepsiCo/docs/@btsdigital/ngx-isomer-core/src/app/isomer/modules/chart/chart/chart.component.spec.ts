import { async, ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';

import { ChartComponent } from './chart.component';
import { CalcService, TextService, LoggerService, ChartUtilsService, CommunicatorService, StorageService } from '../../../';
import { CalcServiceStub } from '../../../test/calc-service.stub';
import { TextServiceStub } from '../../../test/text-service.stub';
import { StorageServiceStub } from '../../../test/storage-service.stub';
import { HighchartsStatic } from '../highchartsstatic';
import { Constants } from '../../../config/constants';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  let calcService: CalcServiceStub,
    textService: TextServiceStub,
    highchartsStatic: HighchartsStatic,
    commService: CommunicatorService,
    values: Array<any> = [],
    hcSpy: jasmine.Spy;

  const dataRefs = ['tlOutputRainfallP1', 'tlOutputRainfallP2', 'tlOutputRainfallP3',
      'tlOutputRainfallP4', 'tlOutputRainfallP5', 'tlOutputRainfallP6',
      'tlOutputRainfallP7', 'tlOutputRainfallP8', 'tlOutputRainfallP9',
      'tlOutputRainfallP10', 'tlOutputRainfallP11', 'tlOutputRainfallP12'];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartComponent ],
      providers: [
      { provide: CalcService, useClass: CalcServiceStub },
      { provide: TextService, useClass: TextServiceStub },
      { provide: StorageService, useClass: StorageServiceStub },
      LoggerService, ChartUtilsService, CommunicatorService, HighchartsStatic]
    })
    .compileComponents();
  }));

  it('should not be created', () => {
    try {
      fixture = TestBed.createComponent(ChartComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component).toBeTruthy();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  beforeEach(async(() => {
    calcService = TestBed.get(CalcService);
    textService = TestBed.get(TextService);
    highchartsStatic = TestBed.get(HighchartsStatic);
    commService = TestBed.get(CommunicatorService);
    calcService.apiReady = true;
    values = [];
    hcSpy = spyOn(highchartsStatic.getHighchartsStatic(), 'chart').and.callThrough();
    dataRefs.forEach((ref) => {
      const random = Math.random() * 1000000;
      calcService.setValue(ref, random);
      values.push(random);
    });

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
  }));

  it('should be created with basic options', () => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.rangeRef = [['tlOutputRainfallP1', 'tlOutputRainfallP2', 'tlOutputRainfallP3',
    'tlOutputRainfallP4', 'tlOutputRainfallP5', 'tlOutputRainfallP6',
    'tlOutputRainfallP7', 'tlOutputRainfallP8', 'tlOutputRainfallP9',
    'tlOutputRainfallP10', 'tlOutputRainfallP11', 'tlOutputRainfallP12']];
    component.xAxis = { 'categories': ['Cat1', 'Cat2', 'Cat3',
    'Cat4', 'Cat5', 'Cat6', 'Cat7', 'Cat8', 'Cat9',
    'Cat10', 'Cat11', 'Cat12']};
    component.yAxis = {labels: { format: '{value:$0,0a}' }};
    component.seriesOptions = [{type: 'column', 'name': 'TeamName'}];
    component.chartOptions = {'title': {text: 'Test Chart'}, plotOptions:
      { column: {
        dataLabels: { enabled: true, format: '{y:$0,0a}' },
        tooltip: { pointFormat: '{point.y:$0,0a}' }
      }}
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(hcSpy.calls.count()).toBe(1);
    const chartOptions: Highcharts.Options = hcSpy.calls.mostRecent().args[0];
    let counter = 0;
    values.forEach((value, vi) => {
      counter++;
      expect(chartOptions.series[0].data[vi]).toEqual(value);
    });
    expect(counter).toEqual(values.length);
  });

  it('should update on changes', (done: DoneFn) => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.rangeRef = [['tlOutputRainfallP1', 'tlOutputRainfallP2', 'tlOutputRainfallP3',
    'tlOutputRainfallP4', 'tlOutputRainfallP5', 'tlOutputRainfallP6',
    'tlOutputRainfallP7', 'tlOutputRainfallP8', 'tlOutputRainfallP9',
    'tlOutputRainfallP10', 'tlOutputRainfallP11', 'tlOutputRainfallP12']];
    component.xAxis = { 'categories': ['Cat1', 'Cat2', 'Cat3',
    'Cat4', 'Cat5', 'Cat6', 'Cat7', 'Cat8', 'Cat9',
    'Cat10', 'Cat11', 'Cat12']};
    component.yAxis = {labels: { format: '{value:$0,0a}' }};
    component.seriesOptions = [{type: 'column', 'name': 'TeamName'}];
    component.chartOptions = {'title': {text: 'Test Chart'}, plotOptions:
      { column: {
        dataLabels: { enabled: true, format: '{y:$0,0a}' },
        tooltip: { pointFormat: '{point.y:$0,0a}' }
      }}
    };
    fixture.detectChanges();
    component.chartOptions = {
      'title': {'text': 'Test Chart'},
      'plotOptions': {
        'column': {
          'dataLabels': { 'enabled': true, 'format': '{y:$0,0a}' },
          'tooltip': { 'pointFormat': '{point.y:$0,0.00a}' }
        }
      }
    };
    fixture.detectChanges();
    // tick();
    fixture
      .whenStable()
      .then(() => {
        component.ngOnChanges();
        expect(hcSpy.calls.count()).toBe(2);
        const chartOptions: Highcharts.Options = hcSpy.calls.mostRecent().args[0];
        expect(chartOptions.plotOptions.column.tooltip.pointFormat).toBe('{point.y:$0,0.00a}');
        const updateSpy = spyOn(component, 'update').and.callThrough();
        commService.trigger(Constants.MODEL_CALC_COMPLETE);
        expect(updateSpy.calls.count()).toBe(1);
        done();
      });
  });

  it('should render pie chart', () => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.rangeRef = [
      'tlOutputRainfallP1', 'tlOutputRainfallP2', 'tlOutputRainfallP3',
      'tlOutputRainfallP4', 'tlOutputRainfallP5', 'tlOutputRainfallP6',
      'tlOutputRainfallP7', 'tlOutputRainfallP8', 'tlOutputRainfallP9',
      'tlOutputRainfallP10', 'tlOutputRainfallP11', 'tlOutputRainfallP12'
    ];

    component.seriesOptions = [{
      'name': 'Cat1',
      'type': 'pie',
      'data': [
        {name: 'Cat1'}, {name: 'Cat2' }, {name: 'Cat3' },
        {name: 'Cat4' }, {name: 'Cat5'}, {name: 'Cat6'},
        {name: 'Cat7' }, {name: 'Cat8'}, {name: 'Cat9'},
        {name: 'Cat10' }, {name: 'Cat11'}, {name: 'Cat12'}
      ]
    }];
    component.chartOptions = {
      'title': {'text': 'Test Chart'},
      'plotOptions': {
        'pie': {
          'dataLabels': { 'format': '{point.percentage:0.00%:100}'},
          'tooltip': { 'pointFormat': '{point.percentage:0.00%:100}' }
        }
      }
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render solidgauge', () => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.rangeRef = [['tlOutputRainfallP1']];
    component.yAxis = [{
      'title': {
        'y': 95,
        'style': {
          'color': '#000',
          'fontSize': '1.5em',
          'textTransform': 'uppercase'
        }
      },
      'labels': {
        'format': '{value:0,0a}'
      }
    }];
    component.seriesOptions = [{type: 'solidgauge', 'name': 'Cat1', 'dataLabels': { 'format': '{y:0,0a}' } }];
    component.chartOptions = {
      'chart': {
        'marginTop': 0,
        'width': 150,
        'height': 150
      },
      'pane': {
        'center': ['50%', '70%'],
        'size': '83%',
        'startAngle': -125,
        'endAngle': 125,
        'background': [{
          'innerRadius': '100%',
          'outerRadius': '100%',
          'backgroundColor': 'blue',
          'shape': 'arc',
          'borderWidth': 10,
          'borderColor': 'rgba(0,0,0,0.2)'
        }]
      },
      'plotOptions': {
        'solidgauge': {
          'dataLabels': {
            'format': '{y:0,0a}'
          },
          'tooltip': {
            'pointFormat': '<span>\u25CF</span> {series.name}: <b>{point.y:0,0a}</b><br/>'
          }
        }
      }
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render multiple charts', () => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.rangeRef = [
      ['tlOutputRainfallP1', 'tlOutputRainfallP2', 'tlOutputRainfallP3'],
      ['tlOutputRainfallP4', 'tlOutputRainfallP5', 'tlOutputRainfallP6'],
      ['tlOutputRainfallP7', 'tlOutputRainfallP8', 'tlOutputRainfallP9'],
      ['tlOutputRainfallP10', 'tlOutputRainfallP11', 'tlOutputRainfallP12'],
      ['tlOutputRainfallP1', 'tlOutputRainfallP2', 'tlOutputRainfallP3']
      ];
    component.yAxis = {stackLabels: { format: '{total:0,0.00a}'}};
    component.xAxis = {categories: ['Apple', 'Orange', 'Banana']};
    component.seriesOptions = [{
      type: 'stackedcolumn', 'name': 'Cat1'},
      {type: 'stackedcolumn', 'name': 'Cat2'},
      {type: 'stackedcolumn', 'name': 'Cat3'},
      {type: 'stackedcolumn', 'name': 'Cat4'},
      {type: 'line', 'name': 'TeamName1'}
    ];
    component.chartOptions = {
      'title': {'text': 'Test Chart'},
      'plotOptions': {
        'column': {
          'dataLabels': {
            'format': '{y:0,0a}',
          },
          'tooltip': {'pointFormat': '{point.y:0,0a}'} },
        'line': {
          'dataLabels': { 'enabled': false },
          'tooltip': { 'pointFormat': '{point.y:0,0a}'}
        }
      }
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
