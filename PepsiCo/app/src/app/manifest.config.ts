// set the configuration for offline isomer

export const manifest = {
    hostName: 'http://localhost',
    eventTitle: 'IsomerTest',
    questionsToSend: [
        { 'questionName': 'AverageBillRate_CRM', 'rangeName': 'tlInputProd1Price' },
        { 'questionName': 'AverageBillRate_HCM', 'rangeName': 'tlInputProd1V2Price' },
        { 'questionName': 'AverageBillRate_Futuria', 'rangeName': 'tlInputProd1V3Price' },
        { 'questionName': 'PracticeGrowthForecast_CRM', 'rangeName': 'tlInputProd1Growth' },
        { 'questionName': 'PracticeGrowthForecast_HCM', 'rangeName': 'tlInputProd1V2Growth' },
        { 'questionName': 'PracticeGrowthForecast_Futuria', 'rangeName': 'tlInputProd1V3Growth' }
    ],
    questionsToReceive: [
        { 'questionName': 'MarketingExpense', 'rangeName': 'tlOutput_tlBusinessA_L37' },
        { 'questionName': 'DevelopmentLevels_CRM', 'rangeName': 'tlInputCompDevBusAV1' },
        { 'questionName': 'DevelopmentLevels_HCM', 'rangeName': 'tlInputCompDevBusAV2' },
        { 'questionName': 'DevelopmentLevels_Futuria', 'rangeName': 'tlInputCompDevBusAV3' },
    ],
    foremanquestionsToRecieve: [],
    trackQuestion: { 'questionName': 'LastYear_CRM', 'rangeName': 'tlOutput_tlBusinessA_H17' }
};
