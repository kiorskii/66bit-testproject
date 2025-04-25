import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './reset.css'
import './index.css'
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';  


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={ruRU} theme={{ token: { colorPrimary: '#1677ff' } }}>
    <App />
  </ConfigProvider>,
)
