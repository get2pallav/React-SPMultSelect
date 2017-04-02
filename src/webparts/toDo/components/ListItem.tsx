import * as React from 'react';
import * as ReactDom from 'react-dom';

export interface IListItemProp {
    title?:string,
    Id?:string,
    fields?:any[]
} 

export class ListItem extends React.Component<IListItemProp,{}>{
    constructor(prop:IListItemProp){
        super(prop);
    }

    public render():JSX.Element{
        let tbHeader=
        this.props.fields.map(fl =>{
          return <td><strong>{fl}</strong></td>
        });        
        return (
            <table>
            <tr>{tbHeader}</tr>
            </table>
        );
    }
}