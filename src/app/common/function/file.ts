import { IFile } from '@ionic-native/file/ngx';
import { Observable } from 'rxjs';

export const ReadFile = (file: IFile | File, toBase64 = false) =>
  new Observable<FileReader>((observer) => {
    const reader = new FileReader();

    reader.onerror = (error) => {
      reader.abort();
      observer.error(error);
    };

    reader.onloadend = () => {
      if (reader.readyState === 2) {
        observer.next(reader);
      }

      observer.complete();
    };

    if (!toBase64) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsDataURL(file);
    }
  });
