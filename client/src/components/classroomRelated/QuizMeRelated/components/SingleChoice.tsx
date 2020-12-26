import React from 'react' 
import {Radio,FormGroup, RadioGroup, FormControlLabel,FormControl,FormLabel, FormHelperText} from '@material-ui/core'
import {useForm} from 'react-hook-form'
import { IFormExtended, IFieldExtended ,IFormSingleChoiceField, IOption } from "../../../../typescript/interfaces";

interface IProps{
  field:IFormSingleChoiceField,
  value:IOption|undefined,
  change:(value:any,fieldId:number)=>void
}
function SingleChoiceField( {field, value, change}:IProps ) {
  const {id:fieldId,title,Options} = field
  return <FormControl required variant="outlined" 
    error={!value} 
    component="fieldset"
  >
    <FormGroup>
    <FormLabel>{title}</FormLabel>
    <FormHelperText>Choose at least 1</FormHelperText>
    <RadioGroup aria-label={title} 
      name={title} 
      >
      {Options.map((
        {
          title,id:optionId
        },
        index
        ) => (
          <FormControlLabel key={'option'+optionId} 
          label={title}
          onChange={()=>{          
            change(optionId,fieldId)
          }}
          value={Options[index].id}
          checked={value===optionId}
          control={
            <Radio 
            inputProps={{
              name:`Options[${index}]`,
              checked:value
                ? value.id === Options[index].id
                : false
            }}
            />
            }
            />
          )
        )}
      </RadioGroup>
    </FormGroup>
  </FormControl>
} 
export default SingleChoiceField; 