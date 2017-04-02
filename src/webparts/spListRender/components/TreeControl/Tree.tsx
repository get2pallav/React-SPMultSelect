import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Persona,PersonaPresence } from 'office-ui-fabric-react';
import {ITreeProp} from './ITreeProp';

export class PersonContact extends React.Component<ITreeProp,void>{
    constructor(prop:ITreeProp){
        super(prop);
    }

    public render():JSX.Element{
        const examplePersona = {
      //  imageUrl: TestImages.personaFemale,
        imageInitials: 'AL',
        primaryText: 'Annie Lindqvist',
        secondaryText: 'Software Engineer',
        tertiaryText: 'In a meeting',
        optionalText: 'Available at 4:00pm'
        };

        return(
            <Persona {...examplePersona} presence={PersonaPresence.online} />
        )
    }
}