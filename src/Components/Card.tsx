import React, { useContext, useEffect, useRef, useState } from 'react'

type CardProps = {
    title: string
    body: string
}

const Card: React.FC<CardProps> = (props) => {    
    const [toggled, setToggled] = useState(false);
    
    const handleToggleBody  = () => {
      setToggled(!toggled)
    }
    
    return (<section className="card">
      <h3 className="card__title" onMouseMove={handleToggleBody}>
         {props.title}
      </h3>
      
      {toggled && <article className="card__body">
        {props.body}
      </article>}
    </section>)
}

export default Card
