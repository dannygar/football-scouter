import React from 'react'
import { ISignificance, SignificanceProps } from '../Models/SignificanceModel'

type SignificanceItemProps = SignificanceProps & {
    updateSignificance: (significance: ISignificance) => void
    deleteSignificance: (_id: string) => void
}

const Significance: React.FC<SignificanceItemProps> = ({ significance, updateSignificance, deleteSignificance }) => {
  const checkSignificance: string = significance.status ? `line-through` : ''
  return (
    <div className='Card'>
      <div className='Card--text'>
        <h1 className={checkSignificance}>{significance.time}</h1>
        <div className='Card--text'>
            <p className={checkSignificance}>{significance.advTeam}</p>
            <p className={checkSignificance}>{significance.sigType}</p>
            <p className={checkSignificance}>{significance.position}</p>
            <h3 className={checkSignificance}>{significance.significance}</h3>
        </div>
      </div>
      <div className='Card--button'>
        <button
          onClick={() => updateSignificance(significance)}
          className={significance.status ? `hide-button` : 'Card--button__done'}
        >
          Edit
        </button>
        <button
          onClick={() => deleteSignificance(significance.id)}
          className='Card--button__delete'
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Significance
