import './App.css';
import {React , Component} from 'react';
import * as Vector from './Utils/VectorMath'
import {BallisticObj} from './BallisticObj'

function ViewBox(props) {
  return (
    <canvas
      id='canvas'
      width={props.canvasWidth}
      height={props.canvasWidth * 5/8}
      style={{display: "block", border: "1px solid black", margin: "auto", marginTop: "10px"}}
    />
  )
}

class Environment extends Component {
  componentDidMount() {
    const canvas = document.getElementById('canvas')
    const canvasContext = canvas.getContext('2d')

    

    this.ball = new BallisticObj({
      position: {x: canvas.width / 2, y: canvas.height / 2},
      rad: 10,
      scale: 1,
      ballStateDisplay: this.props.ballStateDisplay,
      envSize: {x: canvas.width, y: canvas.height}
    })

    setInterval(()=>{
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)
      
      canvasContext.fillStyle = "lightgray"
      canvasContext.fillRect(0, 0, canvas.width, canvas.height)

      this.ball.draw(canvasContext)
    
    }, 20)
  }

  render() {
    return (
      <ViewBox canvasWidth={window.innerWidth * .5} />
    )
  }
}

function BallInfoTable(props) {
  const ballAngle = props.ballVector.angle.toFixed(1) + "\u00B0"
  const ballSpeed = props.ballVector.magnitude.toFixed(1) + " m/s"
  
  const rowTitleStyle = {
    textAlign: "right", 
    paddingRight: "20px"
  }
  
  return (
    <div>
      <h4>Ball Trajectory</h4>
      <table>
        <tbody>
          <tr>
            <td style={rowTitleStyle} >
              Path Angle:
            </td>

            <td>
              {ballAngle}
            </td>
          </tr>

          <tr>
            <td style={rowTitleStyle}>
              Speed:
            </td>
            
            <td>
              {ballSpeed}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const directions = {
  up:     90,
  down:   270,
  left:   180,
  right:  0
}

function GravityButtons (props) {
  let buttons = Object.keys(directions).map((direction, i) => (
      <div key={"dir_btn_" + i}>
        <input 
          id={direction} 
          type={"radio"} 
          name="gravDir" 
          value={directions[direction]} 
          onClick={props.gravityChangeMethod} 
        />

        <label htmlFor={direction} >{direction}</label>
      </div>
  ))

  return(
    <div>
      <h4>Gravity Direction</h4>
      {buttons}
    </div>
  )
}

function InfoBox(props) {
  const boxStyle = {
    margin: "30px", 
    padding: "20px", 
    background: "tan", 
    color: "white",
    
  }

  const infoStyle = {
    display: "flex", 
    gap: "1rem",
    alignItems: "flex-start"
  }

  return (
    <div style={boxStyle}>
      <h3>Sim Info</h3>
      <div style={infoStyle}>
        <BallInfoTable ballVector={props.ballVector}/>
        <GravityButtons gravityChangeMethod={props.setGravityDirection}/>
      </div>
    </div>
  )
}

class Simulator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      gravity: Vector.gravity,
      scale: 2,
      framerate: 150,
      ballVector: new Vector.Vector(0,0)
    }
  }

  setBallStateDisplay = (vector) => {
    this.setState({ballVector: vector})
  }

  setGravityDirection = (evt) => {
    const direction = parseInt(evt.target.value, 10)

    this.setState({gravity: new Vector.Vector(10, direction)})
  }

  render() {
    return  (
      <div className='App'>
        <Environment 
          gravity={this.state.gravity} 
          scale={this.state.scale} 
          framerate={this.state.framerate}
          ballStateDisplay={this.setBallStateDisplay}
        />

        <InfoBox 
          ballVector={this.state.ballVector}
          setGravityDirection={this.setGravityDirection}
        />
      </div>
      )
  }
}

export default Simulator;
