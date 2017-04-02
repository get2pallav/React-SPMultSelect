import * as React from 'react';
import * as ReachDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType
} from '@microsoft/sp-webpart-base';
import { IPropertyPaneMultiSelectPropInternal } from './PropertyPaneMultiselect';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface IPropertyPaneMultiSelectPropState {
    fields?: any[],
    disabled?: boolean,
    text?:string
}
import * as jQuery from 'jquery';

export class PropertyPaneMultiSelectHost extends React.Component<IPropertyPaneMultiSelectPropInternal, IPropertyPaneMultiSelectPropState>{
    private onPropertyChange:Function;
    constructor(prop: IPropertyPaneMultiSelectPropInternal,context:any) {
        super(prop,context);
        SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/multiple-select/1.2.0/multiple-select.min.css");
        this.state = ({
            fields: [],
            disabled: true,
            text:""
        });  
     this.onPropertyChange = this.props.onPropertyPaneFieldChanged.bind(this);
    }

    private _getFeildsData(): Promise<string[]> {
        let flds = ['Title', 'ID'];
        return new Promise<string[]>((resolve) => {
            setTimeout(() => {
                resolve(flds);
                this.setState({
                    disabled: false
                })
            }, 300);
        })
    }

    private _applyMultiSelect(selectControlId: string) {
        SPComponentLoader.loadScript("https://code.jquery.com/jquery-3.2.1.min.js", { globalExportsName: 'jQuery' })
            .then((jQuery: any): void => {
                SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/multiple-select/1.2.0/multiple-select.min.js", { globalExportsName: 'jQuery' })
                    .then(() => {
                        debugger;
                        jQuery("#" + selectControlId+"").multipleSelect({
                            onClose:function(){
                            debugger;
                             jQuery("input[label='Fields']").val(jQuery("#" + selectControlId+"").multipleSelect('getSelects'));
                            // jQuery("input[label='Fields']").change();
                            }
                        });
                    });
            });
    }

    public _propertyChange(propertyPath: string):void{
        debugger;
        this.onPropertyChange(propertyPath,'',jQuery("input[label='Fields']").val());
       // this.props.onPropertyPaneFieldChanged("fields",'','');
    }

    componentDidMount(): void {
        this._getFeildsData().then((flds) => {
            this.setState({
                fields: flds,
                disabled: false
            });
        })
        .then(()=>{
            this._applyMultiSelect(this.props.controlId);
        });
    }

    componentWillReceiveProps?(nextProps: IPropertyPaneMultiSelectPropInternal): void {
        if (!this.state.disabled) {
            this._getFeildsData().then((flds) => {
                this.setState({
                    fields: flds,
                    disabled: false
                });
            });
        }
    }

    render(): JSX.Element {
        const elemOptions = this.state.fields.map((x) => { return <option key={x} value={x}>{x}</option> });
        return (
            <div>
                <input id="hiddenField" type="hidden"></input>
                <select id={this.props.controlId} >
                    {elemOptions}
                </select>
                <a href="#" onClick={this._propertyChange.bind(this,this.props.lable)}>Save</a>
            </div>
        );
    }
}
