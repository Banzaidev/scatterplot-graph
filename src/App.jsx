
import { useEffect} from 'react'
import * as d3 from 'd3'
import './App.css'

function App() {
  const width = 900
  const height = 600
  const margins = {
    bottom: 30,
    left: 50,
  }


  useEffect(() => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then((response) => response.json()).then((data) => {

      const xScale = d3.scaleTime().domain([d3.min(data, d => new Date().setFullYear(d['Year'])), d3.max(data, d=> new Date().setFullYear(d['Year']))]).range([0,width - margins.left ])
      const yScale = d3.scaleLinear().domain([d3.min(data, d => d['Seconds']), d3.max(data, d=> d['Seconds'])]).range([height - margins.bottom, 0])

      d3.select('#root')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
  
      d3.select('svg').append('g')
      .attr('id', 'x-axis')
      .attr("transform", `translate(${margins.left},${height - margins.bottom})`)
      .call(d3.axisBottom(xScale))      
  
      d3.select('svg').append('g')
      .attr('id', 'y-axis')
      .attr("transform", `translate(${margins.left},${0})`)
      .call(d3.axisLeft(yScale))      

    })
    

  }, [])



  return (
    <>
      <h1 id="title">Doping in Professional Bicycle Racing</h1>
    </>
  )
}

export default App
