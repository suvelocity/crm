// @flow
// import * as React from 'react';
import React, {useState} from "react";
import { MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { filterStudentObject, SelectInputs } from "../typescript/interfaces";
import { useLocation } from 'react-router-dom'

interface Props {
  array: SelectInputs[];
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
    if(by === 'Job Status'){
      return callbackFunction({...filterObject, JobStatus: value})
    }
    return callbackFunction( {...filterObject, [by]: value});
  };
  return (
    <div style={{ display: "flex", width: `${widthPercent}%` }}>
      {array.map((item: SelectInputs) => (
        <FormControl
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: `${100 / array.length}%`,
          }}
        >
          {/* <InputLabel
            id={`demo-simple-select-label${item.filterBy}`}
          >{`${item.filterBy}`}</InputLabel> */}
          <Select multiple
            labelId={`demo-simple-select-label${item.filterBy}`}
            style={{ height: "100%", width: "60%" }} 
            defaultValue={[""]}
            onChange={(e) => {
              const value = e.target.value as string[] | undefined;
              if(value){
                if(value.filter(val => val != "").length === 0){
                  return determineWhatToSet(item.filterBy, [""])
                }
                return determineWhatToSet(item.filterBy, value.filter(val => val != ""))
              }
              return determineWhatToSet(item.filterBy, [""])
            }}
          >
            <MenuItem value="" disabled>{item.filterBy}</MenuItem>
            {(item.filterBy === "Job Status" && location.pathname !== "/process/all") &&  (
              <MenuItem value={"None"}>No Process</MenuItem>
            )}
            {item.possibleValues.map((value: string) => (
              <MenuItem value={value}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </div>
  );
};
