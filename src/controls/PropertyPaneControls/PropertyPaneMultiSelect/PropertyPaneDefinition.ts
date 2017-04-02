import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps,
    IWebPartContext
} from '@microsoft/sp-webpart-base';
import { IMultiSelectProp, MultiSelect } from './PropertyPaneCustomMultiSelect';

export interface IProperyPaneMultiSelectProp {
    label: string;
 ///   loadOptions: () => Promise<string[]>;
    fields:string[];
    onPropertyChange: (propertyPath: string, newValue: any) => void;
    selectedKey: string | number;
    disabled?: boolean;
    webpartContext: IWebPartContext;
    listName:string;
}
export interface IPropertyPaneMultiSelectPropInternal extends IPropertyPaneCustomFieldProps, IProperyPaneMultiSelectProp { }

export class PropertyPaneMultiSelectBuilder implements IPropertyPaneField<IPropertyPaneMultiSelectPropInternal>{
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IPropertyPaneMultiSelectPropInternal;
    private elem: HTMLElement;

    private label: string;
    private fields:string[];
    private listName:string;
    private loadOptions: Function;
    private selectedKey: string | number;
    private disabled: boolean;
    private webpartContext: IWebPartContext;

    constructor(targetProperty: string, prop: IPropertyPaneMultiSelectPropInternal) {
        this.targetProperty = targetProperty;
        this.properties = prop;
        this.properties.onRender = this.onRender.bind(this);
        this.properties.onDispose = prop.onDispose;

        this.label = prop.label;
      //  this.loadOptions = prop.loadOptions.bind(this);
        this.selectedKey = prop.selectedKey;
        this.onPropertyChange = prop.onPropertyChange;
        this.disabled = prop.disabled;
        this.webpartContext = prop.context;
        this.fields = prop.fields;
        this.listName = prop.listName;
    }

    public onRender(elem: HTMLElement): void {
        const elemControl: React.ReactElement<IMultiSelectProp> = React.createElement(MultiSelect, {
            label: this.label,
            selectKey: this.selectedKey,
            disable: this.disabled,
            stateKey: new Date().toString(),
         //   loadOptions: this.loadOptions.bind(this),
            webpartContext: this.webpartContext,
            fields:this.fields,
            listName:this.listName
        });

        ReactDom.render(elemControl, elem);
    }
    private onPropertyChange(propertyPath: string, newValue: any): void {
        this.properties.onPropertyChange(propertyPath, newValue);
    }
}

export function PropertyPaneMultiSelect(targetProperty: string, prop: IProperyPaneMultiSelectProp): IPropertyPaneField<IPropertyPaneMultiSelectPropInternal> {
    const properties: IPropertyPaneMultiSelectPropInternal = {
        label: prop.label,
        disabled: prop.disabled,
     //   loadOptions: prop.loadOptions,
        onPropertyChange: prop.onPropertyChange,
        onRender: null,
        onDispose: null,
        selectedKey: prop.selectedKey,
        key: null,
        webpartContext: prop.webpartContext,
        fields:prop.fields,
        listName:prop.listName
    };

    return new PropertyPaneMultiSelectBuilder(targetProperty, properties);

}