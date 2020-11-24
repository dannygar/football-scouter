import React, { useEffect, useState } from 'react'
import SignificanceItem from './Components/SignificanceItem'
import AddSignificance from './Components/AddSignificance'
import { getSignificances, addSignificance, updateSignificance, deleteSignificance } from './API/APIs'
import { ISignificance } from './Models/SignificanceModel'

const App: React.FC = () => {
  const [significances, setSignificances] = useState<ISignificance[]>([])

  useEffect(() => {
    fetchSignificances()
  }, [])

  const fetchSignificances = (): void => {
    getSignificances()
    .then(({ data: { significances } }: ISignificance[] | any) => setSignificances(significances))
    .catch((err: Error) => console.log(err))
  }

 const handleSaveSignificance = (e: React.FormEvent, formData: ISignificance): void => {
   e.preventDefault()
   addSignificance(formData)
   .then(({ status, data }) => {
    if (status !== 201) {
      throw new Error('Error! Significance not saved')
    }
    setSignificances(data.significances)
  })
  .catch((err) => console.log(err))
}

  const handleUpdateSignificance = (significance: ISignificance): void => {
    updateSignificance(significance)
    .then(({ status, data }) => {
        if (status !== 200) {
          throw new Error('Error! Significance not updated')
        }
        setSignificances(data.significances)
      })
      .catch((err) => console.log(err))
  }

  const handleDeleteSignificance = (_id: string): void => {
    deleteSignificance(_id)
    .then(({ status, data }) => {
        if (status !== 200) {
          throw new Error('Error! Significance not deleted')
        }
        setSignificances(data.significances)
      })
      .catch((err) => console.log(err))
  }

  return (
    <main className='App'>
      <h1>Chelsea vs Barcelona, February, 21, 2021</h1>
      <AddSignificance saveSignificance={handleSaveSignificance} />
      {significances.map((significance: ISignificance) => (
        <SignificanceItem
          key={significance.id}
          updateSignificance={handleUpdateSignificance}
          deleteSignificance={handleDeleteSignificance}
          significance={significance}
        />
      ))}
    </main>
  )
}

export default App
