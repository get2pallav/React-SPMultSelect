declare interface ISpListRenderStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'spListRenderStrings' {
  const strings: ISpListRenderStrings;
  export = strings;
}
