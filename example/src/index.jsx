import React from 'react'
import ReactDOM from 'react-dom/client'

import '@shopify/polaris/build/esm/styles.css'

import PolarisExample from './PolarisExample'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <PolarisExample />
  </React.StrictMode>,
)
