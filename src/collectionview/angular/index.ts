// External
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { CollectionViewComponent, TemplateKeyDirective } from './collectionview-comp';
export { CollectionViewComponent, TemplateKeyDirective } from './collectionview-comp';

@NgModule({
    declarations: [CollectionViewComponent, TemplateKeyDirective],
    exports: [CollectionViewComponent, TemplateKeyDirective],
    schemas: [NO_ERRORS_SCHEMA],
})
export class CollectionViewModule {}
