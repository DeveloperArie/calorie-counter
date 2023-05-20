import React from 'react'

function FoodItem( { item, removeItem, addOne } ) {

  function handleRemove(itemId){
    removeItem(itemId)
  }
  function handlePlus(itemId){
    addOne(itemId)
  }
  return (
    <div className='singleItemContainer'>
        <span>{item.clickCount ? `${item.clickCount + 1} *` : '1 *'} </span>
        {item.name + ': '}
        {item.calories + ' calories'}
        <button className='itemBtn1' onClick={handlePlus}>+</button>
        <button className='itemBtn2' onClick={handleRemove} >x</button>
    </div>
  )
}

export default FoodItem