import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
	IPropertyPaneField,
	PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-webpart-base';
import PropertyPaneSPFieldDisplay,{IFieldPropInternal} from './SPFieldSelectionControl';

export interface IFieldProp{
    title:string,
    targetProperty?: string;  
    ListName:string,
    field?:Promise<string[]>,
    onChange?:Function,
    onRender?(elem: HTMLElement): void;
    onDispose?(elem: HTMLElement): void;
    disabled?:Boolean
}

class PropertyPaneSPFieldBuilder implements IPropertyPaneField<IFieldPropInternal>{
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IFieldPropInternal;

  private title:string;
  private disabled:Boolean;
  private ListName:string;
  private field:Promise<string[]>;
  private onChange:Function;
  
   
   public constructor(targetProperty:string,prop:IFieldPropInternal){
       debugger;
        this.properties = prop;
        this.ListName = prop.ListName;
        this.field = prop.field;
        this.title = prop.title;
        this.disabled = prop.disabled;
        this.properties.onRender = this.render,
        this.properties.onDispose = this.dispose  

        this.onChange = prop.onChange;
        this.targetProperty = prop.targetProperty;
    }

    private render(elm:Element):void{
        
        const element:React.ReactElement<IFieldPropInternal> = React.createElement(PropertyPaneSPFieldDisplay,{
            title:this.title,
            ListName:this.ListName,
            targetProperty:this.targetProperty,
            field:this.field,
            onChange:this.onChange,
            onRender:this.render,
            onDispose:this.dispose,
            disabled:this.disabled
        });

        ReactDom.render(element, elm);
    }
  
    private dispose(elem: HTMLElement): void {}
}

export function PropertyPaneSPField(targetProperty:string,properties: IFieldProp):IPropertyPaneField<IFieldPropInternal>{
     var newProperties: IFieldPropInternal = {
         title:properties.title,
         disabled:properties.disabled,
         targetProperty:targetProperty,
         ListName:properties.ListName,
         field:properties.field,
         onChange:properties.onChange,
         onDispose: null,
         onRender: null
    };
    return new PropertyPaneSPFieldBuilder(targetProperty,properties);
}