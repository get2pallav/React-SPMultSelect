declare interface ISpListUiStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'spListUiStrings' {
  const strings: ISpListUiStrings;
  export = strings;
}
