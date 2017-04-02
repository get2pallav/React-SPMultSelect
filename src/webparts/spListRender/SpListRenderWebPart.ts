import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneLabel,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';

import * as pnp from 'sp-pnp-js';
import * as strings from 'spListRenderStrings';
import SpListRender from './components/SpListRender';
import { ISpListRenderProps,ISpListItem } from './components/ISpListRenderProps';
import { ISpListRenderWebPartProps } from './ISpListRenderWebPartProps';
import { PropertyPaneMultiSelect } from '../../controls/PropertyPaneControls/PropertyPaneMultiSelect/PropertyPaneDefinition'
import { Dropdown, Spinner } from 'office-ui-fabric-react';
import {PersonContact} from './components/TreeControl/Tree';
import {ITreeProp} from './components/TreeControl/ITreeProp';
import * as jQuery from 'jquery';

export default class SpListRenderWebPart extends BaseClientSideWebPart<ISpListRenderWebPartProps> {

  private _listOptions: IPropertyPaneDropdownOption[] = [];
  private _fields: string[] = [];
  private _selectedList: string;
  private _listDropDownDisabled: boolean = true;
  private _listFieldDropDownDisabled: boolean = true;

  public render(): void {
    const isFieldsAvilable = jQuery("#hiddenField").val() == "" || jQuery("#hiddenField").val() == undefined ? false:true;

    if(isFieldsAvilable){
        SPHelper.GetItems(this.properties.Lists,jQuery("#hiddenField").val());
    }

    const element: React.ReactElement<ISpListRenderProps> = React.createElement(
      SpListRender,
      {
        description: this.properties.description
      }
    );
    const element2: React.ReactElement<ITreeProp> = React.createElement(
      PersonContact,
      {
        lable:"hi"
      }
    );

    ReactDom.render(element, this.domElement);
  //   ReactDom.render(element2, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  private _loadOptions(listName: string): Promise<string[]> {
    if (this.properties.Lists == "") {
      return Promise.resolve();
    }
    return SPHelper.GetFields(listName);
  }
  protected onPropertyPaneConfigurationStart(): void {
    debugger;
    this._listDropDownDisabled = !(this._listOptions.length >= 0);
    if ((this._listOptions.length > 0)) { return; }

    this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'List Names..');
    SPHelper.GetLists()
      .then((lists: string[]) => {
        lists.map((list) => { this._listOptions.push({ key: list, text: list }); })
        this._listDropDownDisabled = false;
        this.context.propertyPane.refresh();
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
      });
  }
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    debugger;
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    if (propertyPath == "Lists" && newValue && newValue != oldValue) {
        this._fields = [];
        this._listFieldDropDownDisabled = true;
        this._selectedList = this.properties.Lists;
        this.context.propertyPane.refresh();
        this._loadOptions(this.properties.Lists)
          .then((items: string[]) => {
            this._fields = items;
            this._listFieldDropDownDisabled = false;
            this.context.propertyPane.refresh();
          });
    }
  }
  private _onPropertyChange(propertyPath: string, newValue: any): void {
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
                PropertyPaneDropdown('Lists', {
                  label: "Lists",
                  options: this._listOptions,
                  disabled: this._listDropDownDisabled
                }),
                PropertyPaneMultiSelect('fields', {
                  disabled: this._listFieldDropDownDisabled,
                  label: "List Fields",
                  //   loadOptions: this._loadOptions,
                  onPropertyChange: this._onPropertyChange,
                  selectedKey: 'sp-fields',
                  webpartContext: this.context,
                  fields: this._fields,
                  listName: this._selectedList
                })
              ]
            }
          ]
        }
      ]
    };
  }
	protected onPropertyPaneConfigurationComplete() {
    debugger;
    this.render();
	}
}

export class SPHelper {
  public static GetLists(): Promise<string[]> {
    const _lists = [];
    return new Promise<string[]>((resolve) => {
      pnp.sp.web.lists.get().then((allLists) => {
        allLists.forEach((x) => { _lists.push(x.Title) });
        resolve(_lists);
      });
    });
  }
  public static GetFields(listName: string): Promise<string[]> {
    const _fields = [];
    return new Promise<string[]>((resolve) => {
      pnp.sp.web.lists.getByTitle(listName).fields.filter("ReadOnlyField eq false and Hidden eq false").get().then((allFields) => {
        allFields.forEach((x) => { _fields.push(x.Title) });
        resolve(_fields);
      });
    });
  }
  public static GetItems(listName:string,fields:string):Promise<ISpListItem[]>{
    const _itemArray:ISpListItem[] = [];
    return new Promise<ISpListItem[]>((resolve)=>{
        const fieldArry:string[] = fields.split(',');
        let pnpFields:string ="";
        fieldArry.forEach(x => {pnpFields = pnpFields + "\"" + x + "\","});
        pnpFields = pnpFields.substring(1,pnpFields.length - 2);

        pnp.sp.web.lists.getByTitle(listName).items.select("*").top(5).get().then((items:any[])=>{
            console.log(items);
            items.forEach((item)=>{
            })
            resolve(_itemArray);
        });
    });
  }
}
