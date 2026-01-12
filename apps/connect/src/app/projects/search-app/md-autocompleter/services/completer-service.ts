import { Injectable, Inject } from '@angular/core';

import { LocalData } from './local-data';
import { RemoteData } from './remote-data';
import { Observable } from 'rxjs';
import { LOCAL_DATA_FACTORY, REMOTE_DATA_FACTORY } from './completer-data-factory';

@Injectable({ providedIn: 'root' })
export class CompleterService {
  constructor(
    @Inject(LOCAL_DATA_FACTORY) private localDataFactory: () => LocalData,
    @Inject(REMOTE_DATA_FACTORY) private remoteDataFactory: () => RemoteData
  ) {}

  public local(data: any[] | Observable<any>, searchFields = '', titleField = ''): LocalData {
    const localData = this.localDataFactory();
    return localData.data(data).searchFields(searchFields).titleField(titleField);
  }

  public remote(url: string, searchFields = '', titleField = ''): RemoteData {
    const remoteData = this.remoteDataFactory();
    return remoteData.remoteUrl(url).searchFields(searchFields).titleField(titleField);
  }
}
