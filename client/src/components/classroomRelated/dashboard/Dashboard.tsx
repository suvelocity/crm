import React,{useContext} from 'react'
import {AuthContext} from '../../../helpers'
import { IUser } from '../../../typescript/interfaces';
export default function Dashboard() {
    //@ts-ignore
    const {user} = useContext(AuthContext);
    return (
        <div>
            im dashboard
        </div>
    )
}   
