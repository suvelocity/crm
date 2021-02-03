// @flow
// import * as React from 'react';
import React, {useState} from "react";
import { MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { filterStudentObject, SelectInputsV2 } from "../typescript/interfaces";
import { useLocation } from 'react-router-dom'
import {camelCaseToWords} from './studentRelated/AddStudent';

interface Props {
  array: SelectInputsV2[];
  callbackFunction: Function;
  filterObject: filterStudentObject;
  widthPercent: number;
}
export const FiltersComponents = ({
  array,
  filterObject,
  callbackFunction,
  widthPercent,
}: Props) => {
  const location = useLocation();
  const determineWhatToSet = (by: string, value: any) => {
    // if(by === 'Job Status'){
    //   return callbackFunction({...filterObject, JobStatus: value})
    // }
    return callbackFunction( {...filterObject, [by]: value});
  };
  return (
    <div style={{ display: "flex", width: `${widthPercent}%` }}>
      {array.map((item: SelectInputsV2) => (
        <FormControl
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: `${100 / array.length}%`,
          }}
        >
          {item.singleOption && <InputLabel
            id={`demo-simple-select-label${item.filterBy}`}
          >{item.label || camelCaseToWords(item.filterBy)}</InputLabel>}
          <Select 
            multiple={!item.singleOption}
            labelId={`demo-simple-select-label${item.filterBy}`}
            style={{ height: "100%", width: "60%" }} 
            defaultValue={item.singleOption ? "" : [""]}
            onChange={(e) => {
              if(item.singleOption){
                return determineWhatToSet(item.filterBy, e.target.value)
              }
              const value = e.target.value as string | string[] | undefined;
              if(value && typeof value === "object"){
                if(value.filter(val => val != "").length === 0){
                  return determineWhatToSet(item.filterBy, [""])
                }
                return determineWhatToSet(item.filterBy, value.filter(val => val != ""))
              }
              return determineWhatToSet(item.filterBy, [""])
            }}
          >
            {
              !item.singleOption ?
              <MenuItem value="" disabled>{item.label || camelCaseToWords(item.filterBy)}</MenuItem>
              :
              <MenuItem value="רגיל" >{
                "רגיל"
              }</MenuItem>
            }
            {(item.filterBy === "JobStatus" && location.pathname !== "/process/all") &&  (
              <MenuItem value={"None"}>No Process</MenuItem>
            )}
            {/* {labelOptions.map((val: {name: string, id: string}) => (
              <MenuItem value={val.id}>{val.name}</MenuItem>
            ))} */}
            {item.possibleValues.map((val: {name: string, id?: number | string}) => (
              <MenuItem value={val.id || val.name}>{val.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </div>
  );
};
