import React from 'react'
import FoodItem from './FoodItem'

function CalorieList( { foodList , removeItem, addOne, date } ) {

  const filteredList = foodList.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate.toDateString() === date.toDateString();
  });

  if (!Array.isArray(foodList)) {
    return <div className='searchPlaceholder'>No food items to display</div>
  }
  function handleRemove(itemId){
    removeItem(itemId)
  }
  function handlePlus(itemId){
    addOne(itemId)
  }
  return (
    filteredList.map(item => {
      return <FoodItem key={item.id} 
      item={item}
      removeItem={() => handleRemove(item.id)}
      addOne={() => handlePlus(item.id)}/>
    })
  )
}

export default CalorieList