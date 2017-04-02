import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps,
    IWebPartContext
} from '@microsoft/sp-webpart-base';
import {PropertyPaneMultiSelectHost} from './PropertyPaneMultiselectDef';

export interface IPropertyPaneMultiSelectProp {
    lable: string,
    controlId:string,
    context:IWebPartContext
    properties: any,
    key?: string,
    onSave():void
    onPropertyPaneFieldChanged(propertyPath:string,oldValue:any,newValue:any):void
}

export interface IPropertyPaneMultiSelectPropInternal extends IPropertyPaneCustomFieldProps {
    lable: string,
    controlId:string,
    context:IWebPartContext,
    targetProperty: string,
    onRender(elem: HTMLElement): void,
    onDispose(elem: HTMLElement): void,
    properties: any,
    key: string,
    onSave():void
    onPropertyPaneFieldChanged(propertyPath:string,oldValue:any,newValue:any):void
}

export class PropertyPaneMultiSelectBuilder implements IPropertyPaneField<IPropertyPaneMultiSelectPropInternal>{
    public properties: IPropertyPaneMultiSelectPropInternal;
    public targetProperty: string;
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    private elem: HTMLElement;

    private controlId:string;
    private onSave:()=>void;
    private onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => void;
    private lable: string;
    private customProperties: any;
    private key: string;
    private context:IWebPartContext;
    
    constructor(usertargetProperty: string, prop: IPropertyPaneMultiSelectPropInternal) {
       this.properties = prop;
		this.properties.onDispose = this.dispose;
		this.properties.onRender = this.render;

        this.targetProperty = prop.targetProperty;
        this.lable = prop.lable;
        this.key = prop.key;
        this.onSave = prop.onSave;
        this.onPropertyPaneFieldChanged = prop.onPropertyPaneFieldChanged;
        this.context = prop.context;
    }

    // public render(): void {
    //     debugger;
    //     if (!this.elem) {
    //     return;
    //     }

    //     this.onRender(this.elem);
    // }
    public render(elm:Element): any {
        //    if (!this.elem) {
        //     this.elem = elem;
        //     }
        const elemMiltiSelect:React.ReactElement<IPropertyPaneCustomFieldProps> = React.createElement(PropertyPaneMultiSelectHost,{
            key:this.key,
            onSave:this.onSave,
            lable:this.lable,
            controlId:this.controlId,
            properties:this.properties,
            targetProperty:this.targetProperty,
            onRender:this.render,
           onDispose: this.dispose,
           onPropertyPaneFieldChanged:this.onPropertyPaneFieldChanged,
           context:this.context,
        })

        ReactDOM.render(elemMiltiSelect,elm)
    }
    private dispose(elem: HTMLElement): void {}

}

export function PropertyPaneMultiSelect(targetProperty: string, prop: IPropertyPaneMultiSelectProp): IPropertyPaneField<IPropertyPaneMultiSelectPropInternal> {
    debugger;
    const properties: IPropertyPaneMultiSelectPropInternal = {
        lable: prop.lable,
        controlId:prop.controlId,
        targetProperty: targetProperty,
        properties: prop.properties,
        key: prop.key,
        onRender: null,
        onDispose: null,
        onSave:prop.onSave,
        onPropertyPaneFieldChanged:prop.onPropertyPaneFieldChanged,
        context:prop.context,
    }
    return new PropertyPaneMultiSelectBuilder(targetProperty, properties)
}