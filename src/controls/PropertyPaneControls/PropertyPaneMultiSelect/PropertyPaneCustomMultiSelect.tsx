import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Dropdown, Spinner } from 'office-ui-fabric-react';
import {
    IPropertyPaneCustomFieldProps,
    IWebPartContext
} from "@microsoft/sp-webpart-base";
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as jQuery from 'jquery';

export interface IMultiSelectProp {
    label: string;
    selectKey: string | number;
    disable: boolean;
    stateKey: string;
    webpartContext: IWebPartContext
    fields: string[];
    listName: string;
}
export interface IMultiSelectState {
    loaded: boolean;
    selectedFields: string;
}

export class MultiSelect extends React.Component<IMultiSelectProp, IMultiSelectState>{
    private contextWebPart:IWebPartContext;
    constructor(prop: IMultiSelectProp) {
        super(prop);
        SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/multiple-select/1.2.0/multiple-select.min.css");
        this.state = ({
            loaded: false,
            selectedFields: ""
        });
        this.contextWebPart = prop.webpartContext;
    }

    public componentDidMount(): void {
        this.loadOptions(this.props.fields.length);
    }

    public componentWillReceiveProps(nextProps: IMultiSelectProp): void {
        if (nextProps.listName !== this.props.listName || this.props.disable != nextProps.disable) {
            this.loadOptions(nextProps.fields.length);
        }
    }
    private loadOptions(arrayLength: number): void {
        if (arrayLength > 0) {
            this.setState({
                loaded: true,
                selectedFields: ""
            });
            this._applyMultiSelect(this.props.selectKey.toString());
        }
    }
    private _applyMultiSelect(selectControlId: string) {
        SPComponentLoader.loadScript("https://code.jquery.com/jquery-3.2.1.min.js", { globalExportsName: 'jQuery' })
            .then((jQuery: any): void => {
                SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/multiple-select/1.2.0/multiple-select.min.js", { globalExportsName: 'jQuery' })
                    .then(() => {
                        jQuery("#" + selectControlId + "").multipleSelect({
                            width: "100%",
                            onClose: function () {
                                 jQuery("#hiddenField").val(jQuery("#" + selectControlId+"").multipleSelect('getSelects'));
                            }
                        });
                    });
            });
    }
    private onSave(selectControlId: string): void {
    }
    public render(): JSX.Element {
        const loading: JSX.Element = this.props.disable && this.props.listName != undefined ? <div><Spinner label={'Loading options...'} /></div> : <div />;

        const elemOptins: JSX.Element[] = this.props.fields.length ==  0? [<option width="100%">Loading....</option>] : this.props.fields.map((field) => { return <option key={field} value={field}>{field}</option> });
        const disabled: boolean = !this.state.loaded || this.props.disable;
        return (
            <div>
                <input id="hiddenField" type="hidden"></input>
                {
                    (() => {
                        if (typeof this.props.listName !== 'undefined') {
                            return (
                                <div>
                                    <label className="ms-Label">{this.props.label}</label>
                                    <select id={this.props.selectKey.toString()} disabled={disabled} width="100%">
                                        {elemOptins}
                                    </select>
                                    <a href="#" onClick={this.onSave.bind(this, this.props.selectKey.toString())}>Save</a>
                                     { loading }
                                </div>)
                        }
                    })()
                }
            </div>
        );

    }
}

