import { Module }  from '@nestjs/common';
import { AiService } from './ai.service';
import { PlacesModule } from '../places/places.module';
import { EventsModule } from '../events/events.module';


@Module({
    providers: [AiService],
    exports: [AiService],
    imports: [PlacesModule, EventsModule],

})
export class AiModule {}