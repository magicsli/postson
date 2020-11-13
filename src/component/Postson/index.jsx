import React, { useState, useEffect} from 'react'
import axios from 'axios'
import "./index.css"
import { isLink } from '../../utils/index'
import ReactJson from 'react-json-view'
const initHistory = JSON.parse(localStorage.getItem("historyList"))  || [
    {
        methods:'get',
        url:'https://www.cnblogs.com/onepixel/p/5126046.html'
    }
]

const initSend = {
    methods: 'get',
    url: ''
}

/**
 * 为不同的请求方式设置不同颜色 
 * @param {string} methods 请求方式
 */
function methodsColor(methods) {
    switch (methods) {
        case "get":
            return "green";
        case "post":
            return "rgb(183, 185, 67)";
        default:
            return "black";
    }
}

export default function Postson() {
    const [historyList, setHistoryList] = useState(initHistory);
    const [send, setSend] = useState(initSend);
    const [jsonResulet, serJsonResult] = useState({});
    const handleSend = async () => {
        if (!isLink(send.url)) {
            alert("请输入正确的url");
            console.warn("请输入正确的url");
            return;
        }
        try {
          const result =  await axios[send.methods](send.url);
          // 请求成功, 记录此次记录
          setHistoryList(historyList => {
              return [send, ...historyList]
          })
          // 设置json显示结果
          serJsonResult(result)

        // 保存数据到缓存中
        localStorage.setItem("historyList", JSON.stringify(historyList.slice(0, 12)))

        } catch (error) {
            console.warn(error)
        }

    }

    const handleMethodsChange = (e) => {
        setSend({
            url: send.url,
            methods:e.target.value
          })
    }

    const handleUrlChange = (e) => {
        setSend({
            url: e.target.value,
            methods: send.methods
          })
    }

    const handleResetSend = (index) => {
        setSend(historyList[index])
        serJsonResult({})
    }

    
    return (<div className="postson-container">
      <div className="aside">
          <div className="aside-item-title">
            请求记录
          </div>
          {
            historyList.map((item, index) => (<div className="aside-item" key={index} onClick={() => handleResetSend(index)}>
              <div className="methods" style={{color: methodsColor(item.methods)}}>{item.methods}</div>
              <div className="url">{item.url}</div>
            </div>))
          }
       
      </div>
      <div className="content">
          <div className="request-container">
              <select className='methods-select' value={send.methods} onChange={handleMethodsChange}>
                  <option value="get">get</option>
                  <option value="post">post</option>
                  {/* <option value="put">put</option> */}
                  {/* <option value="delete">delete</option> */}
              </select>
              <input type='url' value={send.url} onChange={handleUrlChange} className="url-input"></input>
              <div className='send-btn' onClick={handleSend}>send</div>
          </div>
          <div className="json-content">
              <ReactJson 
                indentWidth="4" 
                enableClipboard={false}
                displayObjectSize={false} 
                collapsed="3" 
                displayDataTypes={false}
                style={ {minHeight: "100%",padding: "40px", boxSizing: "border-box", outline:"none"}} 
                className="json-box"  theme="summerfruit" src={jsonResulet} />
          </div>
      </div>
    </div>)
}
