import React, { useEffect, useRef } from 'react'
import { 
    Chart, 
    CategoryScale,
    LineController, 
    TimeScale, 
    LinearScale, 
    PointElement, 
    LineElement,
    BarController,
    BarElement,
} from 'chart.js';

Chart.register(
    BarElement,
    BarController,
    CategoryScale,
    LineController, 
    TimeScale, 
    LinearScale, 
    PointElement,
    LineElement)

function CalorieChart({ calorieData, calorieLimit }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
  
    useEffect(() => {
      const ctx = chartRef.current.getContext('2d');
      const dates = Object.keys(calorieData);
      dates.sort((a, b) => new Date(a) - new Date(b))
      const calories = dates.map(date => calorieData[date]);
  
      const data = {
        labels: dates,
        datasets: [
          {
            label: 'Calories Consumed Over Time',
            data: calories,
            backgroundColor: 'white', 
            borderColor: 'black', 
            borderWidth: 1,
          },
          {
            type: 'line',
            label: 'Calorie Limit',
            data: dates.map(() => calorieLimit),
            backgroundColor: 'transparent',
            borderColor: 'red',
            borderWidth: 1,
            borderDash: [4, 4],
          },
        ],
      };
  
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: Math.max(...calories, calorieLimit) + 500,
          },
        },
      };
      
  
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
  
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options,
      });
    }, [calorieData, calorieLimit]);
  
    return <canvas className='canvasChart' ref={chartRef}></canvas>;
}

export default CalorieChart