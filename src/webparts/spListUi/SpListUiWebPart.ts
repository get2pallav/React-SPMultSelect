import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import *  as $ from 'jquery';

import * as strings from 'spListUiStrings';
import SpListUi from './components/SpListUi';
import { ISpListUiProps } from './components/ISpListUiProps';
import { ISpListUiWebPartProps } from './ISpListUiWebPartProps';
import { PropertyPaneMultiSelect } from './CustomPropertyPane/PropertyPaneMultiselect';

export default class SpListUiWebPart extends BaseClientSideWebPart<ISpListUiWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISpListUiProps> = React.createElement(
      SpListUi,
      {
        description: this.properties.description,
        fields: this.properties.fields
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  public onSave(): void {
    //   this.properties.fields =  $("input[label='Fields']").val();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    debugger;
    this.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    this.properties.fields = undefined;
    this.onPropertyPaneFieldChanged('fields', "", this.properties.fields);

    // debugger;
    // super.onPropertyPaneFieldChanged("SPfields",oldValue,newValue);
    //  this.c  ontext.propertyPane.refresh();

  }
  
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('fields', {
                  label: 'Fields'
                  // disabled:true
                }),
                PropertyPaneMultiSelect('SPfields', {
                  lable: "fields",
                  controlId: "fld-select",
                  properties: this.properties,
                  onSave: this.onSave,
                  onPropertyPaneFieldChanged: this.onPropertyPaneFieldChanged,
                  context: this.context
                })
              ]
            }
          ]
        }
      ]
    };
  }

}
