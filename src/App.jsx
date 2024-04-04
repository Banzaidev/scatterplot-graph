
import { useEffect, useState} from 'react'
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
  const [toopltip, setTooltip] = useState({
    'nationality': '',
    'doping': '',
    'name': '',
    'xvalue': '',
    'position':{
      'x':'',
      'y':''
    }
  })


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
      .attr('name', d=> (d['Name']))
      .attr('doping', d=> (d['Doping']))
      .attr('nationality', d=> d['Nationality'])
      .attr('fill', d => d['Doping'] == '' ? 'orange' : 'blue' )
    })
    
  }, [])
  
  function overDot(event){
    if(event.target.classList[0] == ('dot')){
      let nationality = event.target.getAttribute('nationality')
      let doping = event.target.getAttribute('doping')
      let name = event.target.getAttribute('name')
      let xvalue = event.target.getAttribute('data-xvalue')
      setTooltip({
        'name': name,
        'nationality': nationality,
        'doping': doping,
        'xvalue' : xvalue,
        'position': {
          'x': event.clientX,
          'y': event.clientY
        }

      })
    }
   

  }
  function mouseOut(e){
    if(e.target.classList[0] == 'dot'){
      setTooltip({name: '', nationality: '', doping: '', xvalue: '', position:{'x':'', 'y': ''}})
    }
  }


  return (
    <>
      <h1 id="title">Doping in Professional Bicycle Racing</h1>
      <div id='graph'>
        <svg onMouseOut={mouseOut} onMouseOver={overDot} width={width} height={height}>
          <g id='x-axis'></g> 
          <g id='y-axis'></g> 
        </svg>
        <svg width={240} height={50} id='legend'>
          <circle fill='orange' cx={10} cy={35} r={radius} id='no-doping'></circle>
          <text x={25} y={40}>No doping allegations</text>
          <circle fill='blue'cx={10} cy={15} r={radius} id='doping'></circle>
          <text x={25} y={20}>Riders with doping allegations</text>
        </svg>
      </div>

      
      
        {toopltip.name != '' ?
          <div style={{transform: `translate(${toopltip.position.x}px,${toopltip.position.y >= (660 / 2) ? toopltip.position.y - 700: toopltip.position.y - 700}px)`}} data-year={toopltip.xvalue} id='tooltip'>
            <p>{toopltip.name} : {toopltip.nationality}</p>
            <p>Year: {toopltip.xvalue}</p>
            <p>{toopltip.doping}</p>
          </div>
          :
          <div  data-year={toopltip.xvalue} id='tooltip' hidden></div>
        }
        <h4 id='author'>By <a target='_blank' rel='noopener noreferrer' href="https://github.com/Banzaidev">Banzaidev</a></h4>
    </>
  )
}

export default App
