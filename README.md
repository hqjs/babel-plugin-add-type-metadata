# babel-plugin-add-type-metadata
Add types metadata

# Installation
```sh
npm install hqjs@babel-plugin-add-type-metadata
```

# Transformation
Plugin adds type metadata to classes to help Angular e.g.
```ts
...
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  constructor(private messageService: MessageService) { }

  ...
}
```

will turn into
```ts
...
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  static "ctorParameters"() {
    return [{
      "type": HeroService
    }];
  }

  constructor(private messageService: MessageService) { }

  ...
}
```

that works nice with decorator plugin.
