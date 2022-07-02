import './App.css';
import {React , Component} from 'react';
import * as Vector from './Utils/VectorMath'

//debugger

const directions = {
  up:     90,
  down:   270,
  left:   180,
  right:  0
}

//Comment to check GitHub login again

class Ball extends Component {
  constructor (props) {
    super(props)

    this.scaleRad = props.rad / props.scale

    this.state = {
      position: {x: 0, y: 0},
      velocityVector: new Vector.Vector(0, directions.right),
      envSize: null
    }
  }

  componentDidMount() {
    setInterval(()=>{this.calculatePath()}, this.props.time)

    this.setEnvSize()
  }

  setEnvSize() {
    const viewBox = document.getElementsByClassName('ViewBox')[0]
    const vbStyle = getComputedStyle(viewBox)

    this.setState({      
      envSize: {
        x: parseInt(vbStyle.width),
        y: parseInt(vbStyle.height)
      },

      position: {
        x: (parseInt(vbStyle.width) / 2),
        y: (parseInt(vbStyle.height) / 2)
      }
    })
  }

  calculatePath() {
    const currPosition = this.state.position
    const currVelocity = this.state.velocityVector
    const gravityAddedVelocity = Vector.velocityFromAcceleration(this.props.gravity, this.props.time)
    
    let newVelocity = Vector.Vector.combineVectors(currVelocity, gravityAddedVelocity)

    const newVelocity_components = newVelocity.getVectorComponents()

    let newPosition = {
      x: currPosition.x + (newVelocity_components.x * this.props.scale),
      y: currPosition.y + (newVelocity_components.y * this.props.scale)
    }

    if (this.checkOutOfBounds(newPosition)) {
      [newPosition, newVelocity] = this.bounce(newPosition, newVelocity)
    }

    this.props.ballStateDisplay(newVelocity)



    this.setState({
      velocityVector: newVelocity,
      position: newPosition
    })
  }

  bounce(position, velocity) {
    const elasticity = this.props.elasticity

    let newPosition = Object.assign({}, position)
    let newVelocity_magnitude = velocity.magnitude
    let newVelocity_angle = velocity.angle

    const [xOut, yOut] = [
      this.checkAxisOutOfBounds(position.x, this.state.envSize.x), 
      this.checkAxisOutOfBounds(position.y, this.state.envSize.y)
    ]

    if(xOut) {
      newPosition.x = this.calcBouncePosition(position.x, this.state.envSize.x)
      newVelocity_magnitude *= elasticity

      newVelocity_angle *= -1
      newVelocity_angle += 180
    }

    if(yOut) {
      newPosition.y = this.calcBouncePosition(position.y, this.state.envSize.y)
      newVelocity_magnitude *= elasticity

      newVelocity_angle *= -1 
    }

    return [newPosition, new Vector.Vector(newVelocity_magnitude, newVelocity_angle)]
  }

  calcBouncePosition(axisPos, axisBound) {
    const bounceDirection = this.checkAxisOutOfBounds(axisPos, axisBound)

    return (bounceDirection > 0 ? 0 : axisBound) + (bounceDirection * this.scaleRad)
  }

  checkOutOfBounds(position) {
    return (
      this.checkAxisOutOfBounds(position.x, this.state.envSize.x) || 
      this.checkAxisOutOfBounds(position.y, this.state.envSize.y)
    )
  }

  checkAxisOutOfBounds(axisPos, axisBound) {
    return (axisPos - this.scaleRad < 0) - (axisPos + this.scaleRad > axisBound)
  }

  render() {
    const ballState = {
      position: 'absolute',
      bottom: (this.state.position.y - this.scaleRad) + 'px',
      left:   (this.state.position.x - this.scaleRad) + 'px',
      height: this.scaleRad * 2 + 'px',
      width: this.scaleRad * 2 + 'px',
      background: this.props.color,
      border: '2px solid pink',
      borderRadius: '50%'
    }

    return (
      <span id='Ball' style={ballState}></span>
    )
  }
}

class Environment extends Component {
  render() {   
    const timeSlice = 1000 / this.props.framerate
    return (
      <div className="ViewBox">
        <Ball 
          gravity={this.props.gravity} 
          rad={20} 
          color={'red'} 
          elasticity={0.9} 
          scale={this.props.scale} 
          time={timeSlice}
          ballStateDisplay={this.props.ballStateDisplay}
        />
      </div>
    );
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
      gravity: new Vector.Vector(100, directions.up),
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
      <div>
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
