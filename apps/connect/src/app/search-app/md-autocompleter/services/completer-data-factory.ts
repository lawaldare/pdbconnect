// import { LocalData } from './local-data';
// import { RemoteData } from './remote-data';
// import { HttpClient } from '@angular/common/http';

// export function localDataFactory() {
//   return () => {
//     return new LocalData();
//   };
// }

// export function remoteDataFactory(http: HttpClient) {
//   return () => {
//     return new RemoteData(http);
//   };
// }

// export const LocalDataFactoryProvider = {
//   provide: LocalData,
//   useFactory: localDataFactory,
// };
// export const RemoteDataFactoryProvider = {
//   provide: RemoteData,
//   useFactory: remoteDataFactory,
//   deps: [HttpClient],
// };

import { InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalData } from './local-data';
import { RemoteData } from './remote-data';

export const LOCAL_DATA_FACTORY = new InjectionToken<() => LocalData>('LOCAL_DATA_FACTORY', {
  providedIn: 'root',
  factory: () => () => new LocalData(),
});

export const REMOTE_DATA_FACTORY = new InjectionToken<() => RemoteData>('REMOTE_DATA_FACTORY', {
  providedIn: 'root',
  factory: () => {
    const http = inject(HttpClient);
    return () => new RemoteData(http);
  },
});
