import { Injectable }    from '@angular/core';

@Injectable()
export class ParamProcessingService {

  //Function to clean/encode special characters in the URL
  fixedEncodeURIComponent(str: string) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  escapeSplChars(str: string) {
    return str.replace(/(!|"|\&\&|\|\||\{|\}|\[|\]|\^|\~|\*|\+|\-|\/|\\|\?|\(|\)|:)/g, function($1, $2) {
      return "\\" + $2;
    });
  }

  escapeSpaces(str: string) {
    return str.replace(/\s+/g, function($1, $2) {
      return "\\" + $1;
    });
  }

  //Function to process Date range param
  createDateRangeParam(fieldData: any){
    let dateRangeVal:string = '';

    if(fieldData.alias.length > 1) dateRangeVal = '(';

    fieldData.alias.forEach((fieldName, fieldIndex) => {

      let isoDateVal1 = (typeof fieldData.selectedValue == "string") ? fieldData.selectedValue : new Date(fieldData.selectedValue).toISOString();
      let isoDateVal2: any;
      if(fieldData.relation == '= range' || fieldData.relation == '!= range'){
        isoDateVal2 = (typeof fieldData.rangeValue2 == "string") ? fieldData.rangeValue2 : new Date(fieldData.rangeValue2).toISOString();
      }

      if(isoDateVal1 > isoDateVal2){
        var tempval1 = isoDateVal1;
        isoDateVal1 = isoDateVal2;
        isoDateVal2 = tempval1;

        var tempval2 = fieldData.selectedValue;
        fieldData.selectedValue = fieldData.rangeValue2;
        fieldData.rangeValue2 = tempval2;
      }

      if(fieldIndex > 0) dateRangeVal += ' OR ';

      switch (fieldData.relation){
          case '= range' :
              dateRangeVal += fieldName + ':["' + isoDateVal1 + '" TO "' + isoDateVal2 + '+1DAY"]';
              break;
          case '!= range' :
              dateRangeVal += '-' + fieldName + ':["' + isoDateVal1 + '" TO "' + isoDateVal2 + '+1DAY"]';
              break;
          case '=' :
              dateRangeVal += fieldName + ':["' + isoDateVal1 + '" TO "' + isoDateVal1 +'+1DAY"]';
              break;
          case '>=' :
              dateRangeVal += fieldName + ':["' + isoDateVal1 + '" TO * ]';
              break;
          case '<=' :
              dateRangeVal += fieldName + ':[ * TO "' + isoDateVal1 + '" ]';
              break;
          case '!=' :
              dateRangeVal += '-' + fieldName + ':["' + isoDateVal1 + '" TO "' + isoDateVal1 +'+1DAY"]';
              break;
        }

    });

    if(fieldData.alias.length > 1) dateRangeVal += ')';

    return dateRangeVal;
  }

  //Function to create number param
  createNumberParam(fieldData: any){
    let paramVal:string = '';

    if(fieldData.alias.length > 1) paramVal = '(';

    fieldData.alias.forEach((fieldName, fieldIndex) => {

      //Swap range values if in correct order
      if((fieldData.relation == '= range' || fieldData.relation == '!= range') && (fieldData.selectedValue > fieldData.rangeValue2)){
        var tempval1 = fieldData.selectedValue;
        fieldData.selectedValue = fieldData.rangeValue2;
        fieldData.rangeValue2 = tempval1;
      }

      if(fieldIndex > 0) paramVal += ' OR ';

      switch (fieldData.relation){
          case '= range' :
              paramVal += fieldName + ':[' + fieldData.selectedValue + ' TO ' + fieldData.rangeValue2 + ']';
              break;
          case '!= range' :
              if(fieldData.alias.length > 1){
                if(fieldIndex == 0) paramVal = '-'+paramVal;
              }else{
                paramVal += '-';
              }
              paramVal += fieldName + ':[' + fieldData.selectedValue + ' TO ' + fieldData.rangeValue2 + ']';
              break;
          case '=' :
              paramVal += fieldName + ':' + fieldData.selectedValue;
              break;
          case '>=' :
              paramVal += fieldName + ':[' + fieldData.selectedValue + ' TO *]';
              break;
          case '<=' :
              paramVal += fieldName + ':[* TO ' + fieldData.selectedValue + ']';
              break;
          case '!=' :
              paramVal += '-' + fieldName + ':' + fieldData.selectedValue;
              break;
        }

      });

      if(fieldData.alias.length > 1) paramVal += ')';

      return paramVal;
  }

  //Funtion to process Parameter value
  processParamValue(fieldData: any): string{
    let value: string
    let cleanSlectedVal: string;
    //if space in text
    if(fieldData.valueType == 'fastaSequence' || fieldData.valueType == 'phmmerSequence'){
      // remove carriage return and spaces
      value = fieldData.selectedValue.replace(/\s+/g, '').trim();
      value = value.replace(/(\r\n|\n|\r)/gm,'');
      return this.fixedEncodeURIComponent(value);

    } else {
    
      if(/\s+/g.test(fieldData.selectedValue)){
        //if containes replace space with * and remove quotes
        if(fieldData.relation == 'Contains'){
          
          cleanSlectedVal = this.escapeSplChars(fieldData.selectedValue);
          
          if(fieldData.alias[0] != 'text') cleanSlectedVal = cleanSlectedVal.replace(/\s/g, '*');

        }else if(fieldData.relation == 'Starts with' || fieldData.relation == 'Ends with'){
          
          cleanSlectedVal = this.escapeSpaces(fieldData.selectedValue);

        }else{

          //if start and end with quote do nothing
          if(/^\"*\"$|^\'*\'$/g.test(fieldData.selectedValue)){
            cleanSlectedVal = fieldData.selectedValue;
          }else{
            cleanSlectedVal = '"'+fieldData.selectedValue+'"';
          }

        }

      }else{
        cleanSlectedVal = fieldData.selectedValue;
      }

      //check for value type
      if(fieldData.valueType == 'yn'){

        value = fieldData.alias[0]+':y';
        if(cleanSlectedVal == 'n') value = '-'+fieldData.alias[0]+':y';
        
      }
      //check for submitFilter
      else if(fieldData.submitFilter == 'processAssemblyType'){
          let polymerNameDict = {
            1: 'monomer', 2: 'dimer', 3: 'trimer', 4: 'tetramer', 5: 'pentamer', 6: 'hexamer',
            7: 'heptamer', 8: 'octamer', 9: 'nonamer', 10: 'decamer'
          }

          if(typeof polymerNameDict[cleanSlectedVal] != 'undefined'){
            cleanSlectedVal = polymerNameDict[cleanSlectedVal]
          }else{
            cleanSlectedVal = cleanSlectedVal+'-mer'
          }

          value = fieldData.alias[0]+':'+cleanSlectedVal;
      }

      //fieldData.selectedValue = /\s/g.test(fieldData.selectedValue) ? '"'+fieldData.selectedValue+'"' : fieldData.selectedValue;
      else if((fieldData.type == 'string' || fieldData.type == 'largeString') && fieldData.valueType != 'fastaSequence' && fieldData.valueType != 'phmmerSequence'){

        //Escape round brackets
        // cleanSlectedVal = cleanSlectedVal.replace(/\(/g, '\\\(').replace(/\)/g, '\\\)');

        if(fieldData.alias.length > 1){
            value = '('+fieldData.alias.join(':*'+cleanSlectedVal+' OR ')+':*'+cleanSlectedVal+'*)';
          }else{
            value = fieldData.alias[0]+':';
            if((fieldData.relation == 'Contains' && fieldData.alias[0] != 'text') || fieldData.relation == 'Ends with') value += '*';
            value += cleanSlectedVal;
            if((fieldData.relation == 'Contains' && fieldData.alias[0] != 'text') || fieldData.relation == 'Starts with') value += '*';

            if(fieldData.relation == 'Contains' && fieldData.alias[0] == 'text') value = '(' + value + '*~5 OR ' + value + '~5)';
          }

      }else if(fieldData.type == 'date'){
        value = this.createDateRangeParam(fieldData);
      }else if(fieldData.type == 'int' || fieldData.type == 'float'){
        value = this.createNumberParam(fieldData);
      }

      return this.fixedEncodeURIComponent(value);
    }

  }


  

}