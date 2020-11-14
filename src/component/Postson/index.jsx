import React, { useState, useEffect} from 'react'
import axios from 'axios'
import "./index.css"
import { isLink } from '../../utils/index'
import ReactJson from 'react-json-view'
const initHistory = JSON.parse(localStorage.getItem("historyList"))  || [
    {
        methods:'get',
        url:'https://www.cnblogs.com/onepixel/p/5126046.html',
        data: [{ id:0,  key:'', des: '', value:''  }]
    }
]

const initSend = () => ({
    methods: 'get',
    url: '',
    data: [ { id:0, key:'', des: '', value:'' } ], // 需要传递的数据
})

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
            let data = {}
            send.data.forEach(item => {
                data[item.key] = item.vlaue
            })
          const result =  await axios[send.methods](send.url, data);
          // 请求成功, 记录此次记录
          setHistoryList(historyList => {
              return [send, ...historyList]
          })
          // 设置json显示结果
          serJsonResult(result)

        // 保存数据到缓存中 (只保留前12个)
        localStorage.setItem("historyList", JSON.stringify(historyList.slice(0, 12)))

        } catch (error) {
            console.warn(error)
        }

    }

    const handleMethodsChange = (e) => {
        setSend({
            ...send,
            methods:e.target.value
          })
    }

    const handleUrlChange = (e) => {
        setSend({
            ...send,
            url: e.target.value,
          })
    }

    /**
     * 重置history中的请求历史
     * @param {number} index 需要恢复的history的索引
     */
    const handleResetSend = (index) => {
        setSend(historyList[index])
        serJsonResult({})
    }

    /**
     * 
     * @param {event} e input事件对象
     * @param {number} index 修改的data的索引
     * @param {string} keyName 需要修改的键值
     */
    const handleParamsChange = (e, index) => {
        setSend(send => {
            send.data[index][e.target.name] = e.target.value
            return {...send}
        })
    }

   const handleAddParams = (index) => { 
        setSend(send => {
            console.log(send.data)

            send.data.unshift({ id:index+1, key:'', des: '', value:'' })
            console.log(send.data)

            return {...send}
        })
    }

   
    console.log("????")


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
          <div className="params-container">
              <div>
                  <div className="params-title">query/body</div>
                  <div className="params-flex">
                      <div>key</div>
                      <div>value</div>
                      <div>DESCRIPTION</div>
                  </div>
              </div>
              {
                send.data.map((item, index) => (<div className="params-flex" key={item.id} >
                    <div> 
                        <input  value={send.data[index].key} onChange={e => handleParamsChange(e, index)}  type="text" name='key' placeholder="请输入key"/>
                    </div>
                    <div>
                        <input value={send.data[index].value} onChange={e => handleParamsChange(e, index)} type="text" name='value' placeholder="请输入value"/>
                    </div>
                    <div className="params-handle">
                        <input  value={send.data[index].des} onChange={e => handleParamsChange(e, index)} type="text" name='des' placeholder="请输入字段描述"/>
                        <span style={{color:"#F56C6C"}}>删除</span>
                        <span onClick={ () => handleAddParams(index)} style={{color:"#67C23A"}}>添加</span>
                    </div>
                </div>))
              }
           
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
