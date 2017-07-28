// External
import {
  NO_ERRORS_SCHEMA,
  NgModule,
} from "@angular/core";

import { GridViewComponent } from "./grid-view-comp";

@NgModule({
  declarations: [
    GridViewComponent,
  ],
  exports: [
    GridViewComponent,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ],
})
export class GridViewModule {
}
