import * as React from 'react';
import * as ReactDom from 'react-dom';
import {ListItem,IListItemProp} from './ListItem';
import * as pnp from 'sp-pnp-js';
import { IWebPartContext } from '@microsoft/sp-webpart-base';

export interface IListProp extends IListItemProp{
    text:string;
    context:IWebPartContext;
    ListName:string,
    fields?:any[]
}

export interface IListState {
    results:any[];
    loaded?:boolean;
}

export class ListSpfx extends React.Component<IListProp,IListState>{
    constructor(prop:IListProp,context:IWebPartContext){
        super(prop,context);
        this.state = ({
            results:[] as ListItem[],
            loaded:false
        });
    }
    
    private _getListDetails(crntProps:IListProp){
    //  let listFields = [];
    //   pnp.sp.web.lists.getByTitle(crntProps.ListName).fields.get().then((fields) => {
    //     fields.forEach(field => {
    //         listFields.push(field.Title);
    //     });
    //   })
    //   .then(
    //       () => {
              this.setState({
                  results:[{
                    Id:"1",
                    title:crntProps.ListName,
                    fields:[]
                 }]  
              })
    //      });
      
    }

    public componentDidMount(): void {
        this._getListDetails(this.props);
    }

    public render():JSX.Element {
        let listItemReuslts = this.state.results.map(item =>{
          return <ListItem key={item.Id} fields={item.fields} Id={item.Id}></ListItem>;
        });
        return (
            <div>
                {this.props.text} : {this.props.ListName}
                <ul> {listItemReuslts} </ul>
            </div>
        );
    }
}

