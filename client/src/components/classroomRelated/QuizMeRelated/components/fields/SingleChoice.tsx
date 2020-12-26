import React from 'react' 
import {Radio,FormGroup, RadioGroup, FormControlLabel,FormControl,FormLabel, FormHelperText} from '@material-ui/core'
import {useForm} from 'react-hook-form'
import { IFormExtended, IFieldExtended ,IFormSingleChoiceField, IOption } from "../../../../../typescript/interfaces";

interface IProps{
  field:IFormSingleChoiceField;
  value:IOption[]|undefined;
  change:(value:any,fieldId:number)=>void;
  disabled:boolean;
}
function SingleChoiceField( {field, value, change,disabled}:IProps ) {
  const {id:fieldId,title,Options} = field
  return <FormControl required variant="outlined" 
    error={!value}
    disabled={disabled} 
    component="fieldset"
  >
    <FormGroup>
    <FormLabel>{title}</FormLabel>
    {/* <FormHelperText>Choose 1</FormHelperText> */}
    <RadioGroup aria-label={title} 
      name={title} 
      >
      {Options.map((
        option,
        index
        ) => {
          const {title,id:optionId} = option
          return (
            <FormControlLabel key={'option'+optionId} 
            label={title}
            onChange={()=>{          
              change([option],fieldId)
            }}
            value={Options[index].id}
            checked={value
              ? value[0].id===optionId
              : false}
              control={
                <Radio 
                inputProps={{
                  name:`Options[${index}]`,
                  checked:value
                  ? value[0].id === Options[index].id
                  : false
                }}
                />
              }
              />
            )
            }
            )}
            </RadioGroup>
    </FormGroup>
  </FormControl>
} 
export default SingleChoiceField; 