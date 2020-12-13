import React,{useState,useEffect,useCallback} from 'react'
import { INotice } from "../../../typescript/interfaces"; //todo add interface
import { Loading } from "react-loading-wrapper";
import Swal from "sweetalert2";


import network from '../../../helpers/network'

function Notices() {
    const [notices,setNotices] = useState<INotice[] | null>()
    const [body, setBody] = useState("")
    const [type, setType] = useState("regular")
    const [loading, setLoading] = useState<boolean>(true);

    const classIdPlaceHolder = 1;
    const createdByPlaceHolder = 1;

    const getNotices = useCallback(async () => {
        const { data }: { data: INotice[] } = await network.get(
          `/api/v1/notice/byclss/${classIdPlaceHolder}`
        );
        setLoading(false);
        setNotices(data);
      }, [setLoading]);
    
      useEffect(() => {
        try {
          getNotices();
        } catch (error) {
          Swal.fire("Error Occurred", error.message, "error");
        }
        //eslint-disable-next-line
      }, [getNotices]);
    const sendMessage  = async () => {
      const msg = await network.post(`/api/v1/notice/${classIdPlaceHolder}`,
      {
        classId:classIdPlaceHolder,
        type,
        body,
        createdBy:createdByPlaceHolder,
      })
    }

    return (
        <> 
                <Loading size={30} loading={loading}>

        <div id="post-notice">

        </div>
        </Loading>
        <div id="post-notice">
            <input type="text" onChange={(e) => {
              setBody(e.target.value)
            }}> body</input>
            <input type="text" onChange={(e) => {
              setType(e.target.value)
            }}> type</input>
            <button onClick={sendMessage}> send</button>
        </div>
        </>
    )
}

export default Notices
