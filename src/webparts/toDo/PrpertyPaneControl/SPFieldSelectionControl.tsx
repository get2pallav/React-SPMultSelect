import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import { IFieldProp } from './SPFieldsSelectionField';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as jQuery from 'jquery';

export interface IFieldPropInternal extends IFieldProp {
}

export interface IFieldPropState {
    fields?: any[];
    disabled?:boolean
}

export default class PropertyPaneSPFieldDisplay extends React.Component<IFieldPropInternal, IFieldPropState>{
    private onCe: Function;
    constructor(prop: IFieldPropInternal) {
        super(prop);
        SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/multiple-select/1.2.0/multiple-select.min.css");
        this.state = ({
            fields: [],
            disabled:true

        });
        this.onCe = this.props.onChange.bind(this);
    }

    private _getAndSetFeilds(): void {
        let options = [];
        this.props.field.then((allFields) => {
            allFields.forEach((x) => {
                options.push(x);
            })
        }).then(() => {
            this.setState({
                fields: options,
                disabled:false
            });
        })
            .then(
            () => {
                SPComponentLoader.loadScript("https://code.jquery.com/jquery-3.2.1.min.js", { globalExportsName: 'jQuery' })
                    .then((jQuery: any): void => {
                        SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/multiple-select/1.2.0/multiple-select.min.js", { globalExportsName: 'jQuery' })
                            .then(() => {
                                jQuery('#my-select').multipleSelect({
                                    onClose: function (event) {
                                        jQuery("#hiddenField").val(jQuery('#my-select').multipleSelect('getSelects'));
                                    }
                                });
                            });
                    });
            }
            );
    }
    public componentDidMount(): void {
        if (!this.props.disabled) {
            this._getAndSetFeilds();
        }
    }
    public componentWillReceiveProps(nextProps: IFieldPropInternal): void {
		if (nextProps.ListName !== this.props.ListName) {
           this._getAndSetFeilds();
		}
    }

    public onChange(): void {
        this.onCe();
    }

    public render(): JSX.Element {
        let options = this.state.fields.map((field) => { return <option key={field} value={field} selected>{field}</option>; });
        return (
            <div>
                <h1 className='ms-font-xxl'>{this.props.title}</h1>
                <select id="my-select">
                    {options}
                </select>
                <a href="#" onClick={this.onChange.bind(this)}>Save</a>
            </div>
        );
    }
}