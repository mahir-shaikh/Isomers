
export class TextServiceStub {
  textContent: any = {
    GEN: {}
  };
  private _language = 'en';
  isReady = false;

  constructor() { }

  public set language(lang: string) {
    this._language = lang;
  }

  public get language() {
    return this._language;
  }

  public get isApiReady() {
    return this.isReady;
  }

  init(): Promise<any> {
    // initialize GEN scene
    return this.loadLanguage(this.language);
  }

  loadLanguage(lang: string): Promise<any> {
    this.isReady = false;
    return Promise.resolve();
  }

  loadJson(lang?: string): Promise<any> {
    return Promise.resolve();
  }

  getText(key: string, sceneId: string = 'GEN'): string {
    if (!this.isApiReady) {
      return;
    }
    return this.textContent[sceneId][key] || key;
  }

  getTextForYear(key: string, yearRef: string, sceneId?: string): any {
    return this.getText(key, sceneId);
  }

  getScene(sceneId: string): any {
    return this.textContent[sceneId];
  }

  getSceneIds(): string[] {
    return Object.keys(this.textContent);
  }
}
