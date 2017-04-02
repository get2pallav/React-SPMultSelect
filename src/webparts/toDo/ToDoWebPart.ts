import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';

import * as strings from 'toDoStrings';

import { IToDoWebPartProps } from './IToDoWebPartProps';
import { ListSpfx, IListProp } from './components/ListSpfx';
import PropertyPaneSPFieldDisplay, { IFieldPropInternal } from './PrpertyPaneControl/SPFieldSelectionControl';
import { PropertyPaneSPField } from './PrpertyPaneControl/SPFieldsSelectionField';
import * as $ from 'jquery';
import SPHelper from './util/Helper';
import * as pnp from 'sp-pnp-js';

export default class ToDoWebPart extends BaseClientSideWebPart<IToDoWebPartProps> {
  private _options: IPropertyPaneDropdownOption[] = [];
  public render(): void {

    const element2: React.ReactElement<IListProp> = React.createElement(ListSpfx, {
      context: this.context,
      text: this.properties.description,
      ListName: this.properties.listName,
    });
    ReactDom.render(element2, this.domElement);
    console.log(this.properties.field);
  }

  private _getListDetails(): Promise<string[]> {
    return SPHelper.GetFields(this.properties.listName);
  }

  private _onChange(): void {
    debugger;
    alert($("#hiddenField").val());
   console.log(this.properties.field);
  }
  protected onPropertyPaneConfigurationStart(): void {

 this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'listName');    
    pnp.sp.web.lists.get().then((lists) => {
      lists.map((list) => {
        if (!list.Hidden) {
          this._options.push({
            key: list.Title,
            text: list.Title
          });
        }
      });
    })
      .then(() => {
        this.context.propertyPane.refresh();
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        if(this.properties.listName)
        {
          $(".ms-Dropdown-title").text(this.properties.listName);
        }
        this.render();
      })
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
                // PropertyPaneTextField('listName',{
                //   label:'List Name'
                // }),
                PropertyPaneDropdown('listName', {
                  label: 'List Name',
                  options: this._options
                }),
                PropertyPaneSPField('field',{
                  title: 'List Fields',
                  ListName: this.properties.listName,
                  field: this._getListDetails(),
                  onChange: this._onChange,
                  disabled: true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
