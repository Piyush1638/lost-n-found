import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <div className='laptop:h-[200px] laptop:w-[200px] h-[100px] w-[100px] border-b-4 rounded-full animate-spin border-purple-600'/>
    </div>
  )
}

export default Loading