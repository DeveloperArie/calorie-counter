import React, { useState, useRef, useEffect } from 'react'
import CalorieList from "./Components/CalorieList"
import CalorieChart from './Components/CalorieChart'
import {v4 as uuidv4} from 'uuid'
import axios from 'axios'
import Calendar from 'react-calendar'


const LOCAL_STORAGE_KEY = 'calorieApp.foodItems'

function App() {
  const [foodItems, setFoodItems] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [searchedItem, setSearchedItem] = useState(null)
  const [calorieLimit, setCalorieLimit] = useState('')
  const [date, setDate] = useState(new Date())
  const [calorieData, setCalorieData] = useState({})
  const addItemRef = useRef()
  
  const onChange = date => {
    setDate(date)
    console.log(date)
  }
  
  const handleChange = (e) => {
    setSearchedItem(null)
    setInputValue(e.target.value)
  }
  const handleLimitChange = (e) => {
    setCalorieLimit(e.target.value)
  }

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if(storedItems) setFoodItems(storedItems)
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(foodItems))
  }, [foodItems])

  useEffect(() => {
    const savedCalorieData = localStorage.getItem('calorieData');
    if (savedCalorieData) {
      setCalorieData(JSON.parse(savedCalorieData));
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('calorieData', JSON.stringify(calorieData));
  }, [calorieData])

  async function handleSearchItem(){
    const searchTerm = addItemRef.current.value
    if (searchTerm === '') return 
    
    try{
      const response = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${searchTerm}`, {
        mode: 'no-cors',
        headers: {
          'X-Api-Key': '896eE0pfqm8x/IMWuA5nuA==5T3zlawYzHP3vxTF'
        }
    })

    const foodItem = {
        id: uuidv4(),
        name: response.data.items[0].name,
        calories: response.data.items[0].calories,
        originalCalories: response.data.items[0].calories
    }

    console.log('Search Term:', searchTerm)
    console.log('Retrieved Food Item:', foodItem)

    setSearchedItem(foodItem)
    addItemRef.current.value = ''
    } 
    
    catch(error){
      console.log(error)
    }
  }
  
  
  function handleAddItem(){
    if (searchedItem) {
      const newItem = { ...searchedItem, date: date.toDateString() }
      setFoodItems((prevFoodItems) => [...prevFoodItems, newItem])
      setSearchedItem(null)
      setInputValue('')
      setCalorieData((prevCalorieData) => {
        const updatedCalorieData = { ...prevCalorieData };
        const currentDate = date.toDateString();
  
        if (updatedCalorieData[currentDate]) {
          updatedCalorieData[currentDate] += newItem.calories;
        } else {
          updatedCalorieData[currentDate] = newItem.calories;
        }
  
        return updatedCalorieData
      })
    }
  }

  function handleRemove(itemId) {
    setFoodItems((prevFoodItems) => {
      const itemToRemove = prevFoodItems.find((item) => item.id === itemId);
  
      const updatedFoodItems = prevFoodItems.filter((item) => item.id !== itemId);
  
      if (itemToRemove && itemToRemove.date) {
        setCalorieData((prevCalorieData) => {
          const updatedData = { ...prevCalorieData };
          updatedData[itemToRemove.date] -= itemToRemove.calories;
  
          return updatedData;
        });
      }
  
      return updatedFoodItems;
    });
  }
  function handlePlus(itemId){
    setFoodItems((prevFoodItems) =>
    prevFoodItems.map((item) => {
      if (item.id === itemId) {
        const updatedItem = {
          ...item,
          calories: item.calories + item.originalCalories,
          clickCount: item.clickCount ? item.clickCount + 1 : 1,
        };

        setCalorieData((prevCalorieData) => {
          const updatedCalorieData = { ...prevCalorieData };
          const currentDate = new Date(item.date).toDateString();

          if (updatedCalorieData[currentDate]) {
            updatedCalorieData[currentDate] += item.originalCalories;
          } else {
            updatedCalorieData[currentDate] = item.originalCalories;
          }

          return updatedCalorieData;
        });

        return updatedItem;
      }
      return item;
    })
  );
  }
  const handleDayClick = (day, calories) => {
    setCalorieData((prevCalorieData) => ({
      ...prevCalorieData,
      [day.toDateString()]: calories,
    }));
  };

  const totalCalories = foodItems.reduce((total, item) => total + item.calories, 0)

  function handleReset() {
    setFoodItems([])
    setCalorieData({})
    setCalorieLimit('')
  }
  

  return (
    <div className='appContainer'>
      <div className='title'>
            <h1>CALORIE TRACKER</h1>
      </div>
      <div className='dataContainer'>
        <div className='calandar'>
          <Calendar 
          onChange={onChange} 
          value={date} 
          className={'react-calandar'}
          onDayClick={handleDayClick}/>
        </div>
        
        <div className='cList'>
          <div className='listTitle'>Items added:</div>
          <CalorieList key={foodItems.length}
          foodList={foodItems}
          removeItem={handleRemove}
          addOne={handlePlus}
          date={date}/>
        </div>

        <div className="calorieChart">
          <CalorieChart 
          calorieData={calorieData}
          calorieLimit={calorieLimit}/>
        </div>
      </div>
        <div className='inputContainer'>
          <div className='searchContainer'>
            <div className='cLimit'>
              <input
                className='limitInput input'
                type="number"
                placeholder="Enter your calorie limit:"
                value={calorieLimit}
                onChange={handleLimitChange}
              />
            </div>
            <div className='inputAndBtn'>
              <input ref={addItemRef}
              className='searchInput input' 
              placeholder="Search a food item"
              type="text" 
              onChange={handleChange}
              value={inputValue} />
              <button className='searchBtn btn' onClick={handleSearchItem}>Search Item</button>
            </div>
        </div>
        {searchedItem && (
            <div className='searchedItem'>
              {searchedItem.name} ({searchedItem.calories} calories)
              <button className='addBtn btn' onClick={handleAddItem}>Add Item</button>
            </div>
          )}
      </div>
      <div className='footer'>
        
        <div className='cDetails'>
          <div>
            Calories Limit: {calorieLimit}
          </div>
          <div>
            Total calories: {totalCalories}
          </div>
          <div>
            Calories Left: {calorieLimit - totalCalories}
          </div>
        </div>
        <button className='resetBtn btn' onClick={handleReset}>Reset</button>
      </div>
    </div> 
  )
}

export default App
