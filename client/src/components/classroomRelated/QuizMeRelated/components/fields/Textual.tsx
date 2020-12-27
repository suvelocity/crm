import React from 'react' 
import {TextField,FormGroup,InputLabel,FormControl} from '@material-ui/core'
import {useForm} from 'react-hook-form'
import { IFormExtended, IFieldExtended ,IFormTextField } from "../../../../../typescript/interfaces";

interface IProps{
  field:IFormTextField;
  value:string;
  change:(value:any,fieldId:number)=>void;
  disabled:boolean;
}

function TextualField( {field, value, change,disabled}:IProps ):JSX.Element {
  const {id,title} = field
  return (
  <section>
    <label htmlFor={`field ${id}`}>{title}</label>
      <TextField
        required
        disabled={disabled}
        autoComplete="off"
        style={{
          width:'80%'
        }}
        inputProps={{
          name:`field ${id}`,
        }}
        value={value||''}
        margin="dense"
        fullWidth
        onChange={(e)=>{
          const {value} = e.target
          change(value.trim().length?value:'',id)
        }}
        variant="outlined"
        />
  </section>
  )
} 
export default TextualField; 