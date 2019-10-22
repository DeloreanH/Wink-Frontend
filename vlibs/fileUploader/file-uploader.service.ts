import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpEventType
} from '@angular/common/http';

import { File, FileEntry, IFile } from '@ionic-native/file/ngx';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { BaseService } from '../base';
import { Routes } from 'src/app/modelos/routes.enum';

@Injectable()
export class FileUploaderService {
  private observer: Subscriber<any>;
  private subUpload$: Subscription;

  private serviceURL: string;

  constructor(
    private baseService: BaseService,
    private file: File,
    private http: HttpClient
  ) {
    this.serviceURL = `${this.baseService.getURL()}Containers`;
  }

  public upload(filePath: string): Observable<any> {
    return new Observable<any>(observer => {
      this.observer = observer;

      this.resolverFile(filePath);

      return {
        unsubscribe: () => {
          this.subUpload$.unsubscribe();
        }
      };
    });
  }

  private async resolverFile(filePath: string) {
    try {
      const fileEntry = (await this.file.resolveLocalFilesystemUrl(
        filePath
      )) as FileEntry;
      const file = await this.parseFileEntry(fileEntry);
      const formData = await this.readFile(file);
      this.uploadImageData(formData).subscribe((response: HttpEvent<any>) => {
        this.observer.next(response);

        switch (response.type) {
          case HttpEventType.Response: {
            this.observer.complete();
            break;
          }
        }
      });
    } catch (error) {
      this.observer.error(error);
    }
  }

  private parseFileEntry(fileEntry: FileEntry): Promise<IFile> {
    return new Promise(async (resolve, reject) => {
      try {
        fileEntry.file(file => {
          resolve(file);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private async readFile(file: IFile): Promise<FormData> {
    return new Promise(async (resolve, reject) => {
      try {
        const reader = new FileReader();

        reader.onloadend = () => {
          const formData = new FormData();
          const imgBlob = new Blob([reader.result], {
            type: file.type
          });

          formData.append('file', imgBlob, file.name);

          resolve(formData);
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  private uploadImageData<T = any>(
    formData: FormData
  ): Observable<HttpEvent<T>> {
    const req = new HttpRequest(
      'POST',
      `${Routes.BASE}/${this.baseService.getAuthUserId()}/upload`,
      formData,
      {
        reportProgress: true,
        headers: this.baseService.httpHeaders
      }
    );

    return this.http.request(req);
  }
}
