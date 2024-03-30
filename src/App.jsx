
import { useEffect} from 'react'
import * as d3 from 'd3'
import './App.css'

function App() {
  const width = 900
  const height = 600
  const radius = 5
  const margins = {
    bottom: 30,
    left: 60,
  }


  useEffect(() => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then((response) => response.json()).then((data) => {

      const xScale = d3.scaleTime()
      .domain([d3.min(data, d => new Date().setFullYear(d['Year'])), d3.max(data, d=> new Date().setFullYear(d['Year']))])
      .range([0,width - margins.left])

      const yScale = d3.scaleTime()
      .domain([d3.min(data, d => new Date().setMinutes(d['Time'].split(':')[0],d['Time'].split(':')[1])), d3.max(data, d=> new Date().setMinutes(d['Time'].split(':')[0],d['Time'].split(':')[1]))])
      .range([height - margins.bottom, 0])

      const scaleDataX = d3.scaleTime()
      .domain([d3.min(data, d => new Date().setFullYear((d['Year']))), d3.max(data, d=> new Date().setFullYear((d['Year'])))])
      .range([margins.left,width])
      
      const scaleDataY = d3.scaleTime()
      .domain([d3.min(data, d => new Date().setMinutes(d['Time'].split(':')[0],d['Time'].split(':')[1])), d3.max(data, d=> new Date().setMinutes(d['Time'].split(':')[0],d['Time'].split(':')[1]))])
      .range([height - margins.bottom, 0])

      d3.select('#x-axis')
      .attr("transform", `translate(${margins.left},${height - margins.bottom})`)
      .call(d3.axisBottom(xScale))     
  
      d3.select('#y-axis')
      .attr("transform", `translate(${margins.left},${0})`)
      .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S')))     

      d3.select('svg')
      .selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('r',radius)
      .attr('cx', d => scaleDataX(new Date().setFullYear(d['Year'])))
      .attr('cy', d => scaleDataY(new Date().setMinutes(d['Time'].split(':')[0],d['Time'].split(':')[1])))
      .attr('data-xvalue', d => (d['Year']))
      .attr('data-yvalue', d => new Date(d['Year'],0,0,0,d['Time'].split(':')[0],d['Time'].split(':')[1]))
      .attr('fill', d => d['Doping'] == '' ? 'orange' : 'blue' )


    })
    

  }, [])


  return (
    <>
      <h1 id="title">Doping in Professional Bicycle Racing</h1>
      <svg width={width} height={height}>
        <g id='x-axis'></g> 
        <g id='y-axis'></g> 
      </svg>
      <svg width={240} height={50} id='legend'>
        <circle fill='orange' cx={10} cy={35} r={radius} id='no-doping'></circle>
        <text x={25} y={40}>No doping allegations</text>
        <circle fill='blue'cx={10} cy={15} r={radius} id='doping'></circle>
        <text x={25} y={20}>Riders with doping allegations</text>
      </svg>
    </>
  )
}

export default App
