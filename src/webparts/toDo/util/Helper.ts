import * as pnp from 'sp-pnp-js';

export class SPHelperStatic {
    public GetLists():Promise<string[]>{
        debugger;
        let listArray = [];
        return new Promise<string[]>(
            (resolve) =>{
                pnp.sp.web.lists.get().then((list)=>{
                debugger;
                   if(!list.Hidden)
                   {
                      listArray.push(list.Title);
                   }
                })
                .then(
                    () => {
                        resolve(listArray);
                });
            });
    }

    public GetFields(listName:string):Promise<string[]>{
        let listFields = [];
        return new Promise<string[]>((resolve) => {
            pnp.sp.web.lists.getByTitle(listName).fields.get().then((fields) => {
            fields.forEach(field => {
                listFields.push(field.Title);
            });
        })
        .then(
            ()=>{ resolve(listFields)
            }) 
        });
    }
}

const SPHelper:SPHelperStatic = new SPHelperStatic();
export default SPHelper;    