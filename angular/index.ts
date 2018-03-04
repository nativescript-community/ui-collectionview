// External
import {
  NO_ERRORS_SCHEMA,
  NgModule,
} from "@angular/core";

import { GridViewComponent, TemplateKeyDirective } from "./grid-view-comp";

@NgModule({
  declarations: [
    GridViewComponent,
    TemplateKeyDirective,
  ],
  exports: [
    GridViewComponent,
    TemplateKeyDirective,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class GridViewModule {
}
