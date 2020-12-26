import React from 'react' 
import {Checkbox,FormGroup,FormControlLabel,FormControl,FormLabel, FormHelperText} from '@material-ui/core'
import {useForm} from 'react-hook-form'
import { IFormExtended, IFieldExtended ,IFormMultipleChoiceField, IOption } from "../../../../typescript/interfaces";

interface IProps{
  field:IFormMultipleChoiceField,
  value:IOption[]|undefined,
  change:(value:any,fieldId:number)=>void
}
function MultipleChoiceField( {field, value, change}:IProps ) {
  const {id:fieldId,title,Options} = field
  return <FormControl required variant="outlined" 
    error={value?value.length===0:true} 
    component="fieldset"
  >
    <FormGroup>
    <FormLabel>{title}</FormLabel>
    <FormHelperText>Choose at least 1</FormHelperText>
    {Options.map((
      {
        title,id:optionId
      },
      index
      ) => (
        <FormControlLabel key={'option'+optionId} 
        label={title}
        control={
          <Checkbox 
            checked={value instanceof Array
            ? value.includes(Options[index])
            :false
          }
          inputProps={{name:`Options[${index}]`}}
          onChange={(e)=>{
            const {checked} = e.target
            const newValue =value 
            ? value.slice()
            : []
            if(checked){
              newValue.push(Options[index])
              change(newValue,fieldId)
            }else{
              change(
                newValue.filter(({id})=>id!==optionId),
                fieldId
              )
            }
          }}
          />
        }
        />
      )
    )}
    </FormGroup>
  </FormControl>
} 
export default MultipleChoiceField; 