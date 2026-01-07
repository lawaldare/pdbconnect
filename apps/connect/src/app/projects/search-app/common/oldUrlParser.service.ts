import { Injectable }    from '@angular/core';

declare var AjaxSolr: any;
declare var PDBe: any;

@Injectable()
export class OldUrlParserService {

  oldFieldMapping = {
    organism_scientific_name: 'q_organism_name',
    interacting_molecules: 'q_all_molecule_names',
    citation_authors: 'q_all_authors',
    uniprot_accession: 'q_uniprot',
    interpro_name: 'q_all_sequence_family',
    pfam_description: 'q_pfam_description'
  }

  parse(urlParams) {
    let searchParamObj = {};
    urlParams.keys.forEach(paramDetail => {
      let paramDetailArr = paramDetail.split(/:(.+)/);

      if(paramDetailArr.length > 1){

        let paramFieldName = typeof this.oldFieldMapping[paramDetailArr[0]] != 'undefined' ? this.oldFieldMapping[paramDetailArr[0]] : paramDetailArr[0] == 'text'? 'text' : 'q_'+paramDetailArr[0];
        let paramFieldVal = paramDetailArr[1];

        let isValidField = false;
        if(typeof PDBe.SolrApp.searchFields[paramFieldName] != 'undefined') isValidField = true; 
        
        if(typeof searchParamObj[paramFieldName] == 'undefined'){
          searchParamObj[paramFieldName] = [];
        }

        let valArr = [paramFieldVal];

        if(!/^\".+\"$|^\'.+\'$/g.test(paramFieldVal) && /^.+\sOR\s.+$|^.+\sor\s.+$|^.+\sAND\s.+$|^.+\sand\s.+$/g.test(paramFieldVal)){

          if(/^\(.+\)$/.test(paramFieldVal)){
            paramFieldVal = paramFieldVal.substr(1, paramFieldVal.length - 2);
          }

          valArr = paramFieldVal.split(' ');
        }

        for(let vi = 0, vlen = valArr.length; vi < vlen; vi++){

          if(valArr[vi].toUpperCase() == 'AND' || valArr[vi].toUpperCase() == 'OR') continue;

          let fieldValObj:any;
          if(isValidField){
            fieldValObj = this.getCleanedValue(paramFieldName, valArr[vi], PDBe.SolrApp.searchFields[paramFieldName]);
          }else{
  
            fieldValObj = {
              value: valArr[vi],
              condition1: 'AND',
              condition2: 'Equal to'
            };

            let rangeMatch = valArr[vi].match(/\[(.*)\sTO\s(.*)\]/);

            //check for range
            if(rangeMatch !=  null && typeof rangeMatch[1] != 'undefined' && typeof rangeMatch[2] != 'undefined' ){
              fieldValObj.value = rangeMatch[1]+' - '+rangeMatch[2];
              fieldValObj['type'] = 'int';
              fieldValObj.condition2 = '= range'
            }else if(!isNaN(parseInt(valArr[vi]))){
              fieldValObj['type'] = 'int';
              fieldValObj.condition2 = '='
            }
            
          }

          if(typeof valArr[vi - 1] != 'undefined'){
            fieldValObj.condition1 = valArr[vi - 1].toUpperCase();
          }
          
          searchParamObj[paramFieldName].push(fieldValObj);

        }

       
      }else{

        if(paramDetail == 'view'){
          let tabMappings = ['entry', 'macromolecules', 'compounds', 'sequencefam'];
          if(typeof searchParamObj['resultState'] == 'undefined') searchParamObj['resultState'] = {};
          let paramTabIndex = tabMappings.indexOf(urlParams.params[paramDetail]);

          searchParamObj['resultState']['tabIndex'] = 0;
          if(typeof paramTabIndex != 'undefined' && paramTabIndex > -1){
            searchParamObj['resultState']['tabIndex'] = paramTabIndex
          }
        }else if(paramDetail == 'sort'){
          if(typeof searchParamObj['resultState'] == 'undefined') searchParamObj['resultState'] = {};
          searchParamObj['resultState']['sortBy'] = urlParams.params[paramDetail].replace('+', ' ');
        }else if(paramDetail == 'page'){
          if(typeof searchParamObj['resultState'] == 'undefined') searchParamObj['resultState'] = {};
          searchParamObj['resultState']['paginationIndex'] = parseInt(urlParams.params[paramDetail]);
        }
      
      }
    });

    return searchParamObj;
  }


  getCleanedValue(paramFieldName, paramFieldVal, paramFieldData){

    let cleanSlectedVal = {
      value: paramFieldVal,
      condition1: 'AND'
    };

    if(typeof paramFieldData.value != 'undefined'){
      cleanSlectedVal['condition2'] = 'Equal to';
    }

    //check for submitFilter
    if(paramFieldData.submitFilter == 'processAssemblyType'){
      let polymerNameDict = {
        'monomer': '1', 'dimer': '2', 'trimer' : '3', 'tetramer': '4', 'pentamer' : '5', 'hexamer' : '6',
        'heptamer': '7', 'octamer': '8', 'nonamer': '9', 'decamer': '10'
      }

      if(typeof polymerNameDict[paramFieldVal] != 'undefined'){
        cleanSlectedVal.value = polymerNameDict[cleanSlectedVal.value]
      }else{
        cleanSlectedVal.value = cleanSlectedVal.value.split('-mer')[0];
      }

    }else if(paramFieldData.type == 'int' || paramFieldData.type == 'float'){
      let rangeMatch = paramFieldVal.match(/\[(.*)\sTO\s(.*)\]/);

      //check for range
      if(rangeMatch !=  null && typeof rangeMatch[1] != 'undefined' && typeof rangeMatch[2] != 'undefined' ){
        cleanSlectedVal.value = rangeMatch[1]+' - '+rangeMatch[2];
      }else{
        cleanSlectedVal.value = paramFieldVal;
        cleanSlectedVal['condition2'] = '=';
      }

    }else{
      // if(paramFieldName != 'text') cleanSlectedVal['condition2'] = 'Equal to';

      if(paramFieldName == 'entry_authors' || paramFieldName == 'all_authors'){
        cleanSlectedVal.value = cleanSlectedVal.value.replace(',','');
        cleanSlectedVal.value = cleanSlectedVal.value.replace('.','');
      }
    }

    
    return cleanSlectedVal;

    
  }

}