import { Language } from '../interfaces/Language';

export class LanguageService {
  async getLanguage(): Promise<Language[]> {
    const res: Response = await fetch('http://127.0.0.1:5000/languages', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const json: string = await res.text();

    return JSON.parse(json);
  }

  async transDetect(source: string, target: string, q: string): Promise<any> {
    
    const res: Response = await fetch('http://127.0.0.1:5000/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: q,
        source: source,
        target: target,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    
    const json: string = await res.text();

    return JSON.parse(json);
  }
}
