import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  static Parse(data: string): any {
    try {
      const dataParse = JSON.parse(data);
      return dataParse;
    } catch (error) {
      return null;
    }
  }

  static Stringify(data: any): string {
    try {
      const parseData = JSON.stringify(data);

      return parseData;
    } catch (error) {
      return null;
    }
  }

  static GetItem<T = any>(key: string, parse = false): T {
    const storage = localStorage.getItem(key);

    if (parse && storage) {
      const storageParse = StorageService.Parse(storage);
      return storageParse;
    } else {
      return storage as any;
    }
  }

  static SetItem(key: string, data: any): void {
    if (typeof data === 'object') {
      data = StorageService.Stringify(data);
    }

    localStorage.setItem(key, data);
  }

  static SetNotReplace(key: string, data: any): void {
    if (StorageService.GetItem(key) === null) {
      StorageService.SetItem(key, data);
    }
  }

  public get apiAuthorization(): string {
    return StorageService.GetItem('userData');
  }
}
