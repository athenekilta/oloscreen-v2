import React, {useEffect, useState} from 'react'
import './progress.css'

const ProgressBar = ({screen}) => {
      return (
        <div className='progress' style={{position: 'fixed'}}>
          <div className='color'>
          </div>
        </div>
      );
}

export default ProgressBar