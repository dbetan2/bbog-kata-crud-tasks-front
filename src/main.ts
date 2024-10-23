import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from '@npm-bbta/bbog-dig-dt-sherpa-lib/loader';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

defineCustomElements();

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
}).catch(err => console.error(err));
