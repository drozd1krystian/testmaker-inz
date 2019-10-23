import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'searchFilter'})
export class SearchFilterPipe implements PipeTransform {
    transform(value: any, search: string, prop = null): any {
         if  (!search) {return value; }
         return value.filter(function(item) {
            for(let property in item){
              if (item[property] === null){
                continue;
              }
              if(item[property].toString().toLowerCase().includes(search.toLowerCase())){
                return true;
              }
            }
            return false;
          });
        }
};