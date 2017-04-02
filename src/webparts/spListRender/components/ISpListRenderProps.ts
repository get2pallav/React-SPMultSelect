export interface ISpListRenderProps {
  description: string;
  listItems?:ISpListItem[];
}

export interface ISpListItem{
  ID:string | number;
  valueArray:{field:string,value:string};
}