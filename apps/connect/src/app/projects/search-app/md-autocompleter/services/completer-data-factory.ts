import { LocalData } from './local-data';
import { RemoteData } from './remote-data';
import { HttpClient } from '@angular/common/http';

export function localDataFactory() {
  return () => {
    return new LocalData();
  };
}

export function remoteDataFactory(http: HttpClient) {
  return () => {
    return new RemoteData(http);
  };
}

export const LocalDataFactoryProvider = {
  provide: LocalData,
  useFactory: localDataFactory,
};
export const RemoteDataFactoryProvider = {
  provide: RemoteData,
  useFactory: remoteDataFactory,
  deps: [HttpClient],
};
