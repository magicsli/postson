import React, { useState, useEffect } from 'react'
import "./index.css"
const initHistory = [
    {
        methods:'get',
        url:'https://www.cnblogs.com/onepixel/p/5126046.html'
    }
]

/**
 * 为不同的请求方式设置不同颜色 
 * @param {string} methods 请求方式
 */
function methodsColor(methods) {
    switch (methods) {
        case "get":
            return "green";
        case "post":
            return "yellow";
        default:
            return "black";
    }
}

export default function Postson() {
    const [count, setCount] = useState(0);
    const [historyList, setHistoryList] = useState(initHistory);
    return (<div className="postson-container" onClick={() => setCount(count + 1)}>
      <div className="aside">
          <div className="aside-item-title">
            请求记录
          </div>
          {
            historyList.map(item => (<div className="aside-item">
              <div className="methods" style={{color: methodsColor(item.methods)}}>{item.methods}</div>
              <div className="url">{item.url}</div>
            </div>))
          }
       
      </div>
      <div className="content">
          <div className="request-container">
              <select className='methods-select'>
                  <option>get</option>
                  <option>post</option>
                  <option>put</option>
              </select>
              <input type='url' className="url-input"></input>
          </div>
      </div>
    </div>)
}
