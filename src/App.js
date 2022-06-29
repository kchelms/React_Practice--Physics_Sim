import './App.css';
import {React , Component} from 'react';

debugger

const directions = {
  up:     ((1/2) * Math.PI),
  down:   ((3/2) * Math.PI),
  left:   2 * Math.PI,
  right:  Math.PI
}

//Comment to check GitHub login

class Ball extends Component {
  constructor (props) {
    super(props)

    this.scaleRad = props.rad / props.scale

    this.state = {
      position: {x: 0, y: 0},
      velocityVector: new Vector(0.001, directions.right),
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
    const gravityAddedVelocity = velocityFromAcceleration(this.props.gravity, this.props.time)
    
    let newVelocity = Vector.combineVectors(currVelocity, gravityAddedVelocity)

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

    const [xOut, yOut] = [this.checkXOutOfBounds(position), this.checkYOutOfBounds(position)]

    if(xOut) {
      newPosition.x = (position.x - (2 * (position.x % this.state.envSize.x))) * elasticity
      newVelocity_magnitude *= elasticity

      newVelocity_angle *= -1
    }

    if(yOut) {
      newPosition.y = (position.y - (2 * (position.y % this.state.envSize.y))) * elasticity
      newVelocity_magnitude *= elasticity

      newVelocity_angle *= -1 
    }

    return [newPosition, new Vector(newVelocity_magnitude, newVelocity_angle)]
  }

  checkOutOfBounds(position) {
    return (this.checkXOutOfBounds(position) || this.checkYOutOfBounds(position))
  }

  checkXOutOfBounds(position) {
    return (position.x + this.scaleRad > this.state.envSize.x) - (position.x - this.scaleRad < 0)
  }

  checkYOutOfBounds(position) {
    return (position.y + this.scaleRad > this.state.envSize.y) - (position.y - this.scaleRad < 0)
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

class Vector {
  constructor(magnitude, angle) {
    this.magnitude = magnitude
    this.angle = angle
  }

  static getVectorFromComponents(x, y) {
    const magnitude = Math.sqrt(x * x + y * y)
    const angle =  Math.atan(y/x)

    return new Vector(magnitude, angle)
  }

  static combineVectors(vector_a, vector_b) {
    const vector_a_components = vector_a.getVectorComponents()
    const vector_b_components = vector_b.getVectorComponents()

    const combinedVectorComponents = {
      x: vector_a_components.x + vector_b_components.x,
      y: vector_a_components.y + vector_b_components.y
    }

    return Vector.getVectorFromComponents(combinedVectorComponents.x, combinedVectorComponents.y)
  }

  getVectorComponents() {
    const [magnitude, angle] = [this.magnitude, this.angle]

    return {x: magnitude * Math.cos(angle), y: magnitude * Math.sin(angle)}
  }
}

const velocityFromAcceleration = (accVector, millis) => {
  return new Vector(
    accVector.magnitude * millis / 1000,
    accVector.angle
  )
}

const degreesToRad = (deg) => {
  return deg * Math.PI / 180
}

const radToDegrees = (rad) => {
  return rad * 180 / Math.PI
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

class Simulator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      gravity: new Vector(10, directions.down),
      scale: 2,
      framerate: 100,
      ballVector: new Vector(0,0)
    }
  }

  setBallStateDisplay = (vector) => {
    this.setState({ballVector: vector})
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

        <div style={{margin: "30px", padding: "20px", background: "tan", color: "white"}}>
          <h3>Ball State</h3>
          <table>
            <tbody>
              <tr>
                <td style={{textAlign: "right", paddingRight: "20px"}} >
                  <p>Path Angle:</p>
                </td>

                <td>
                  <p>{radToDegrees(this.state.ballVector.angle).toFixed(1)} &deg;</p>
                </td>
              </tr>

              <tr>
                <td style={{textAlign: "right", paddingRight: "20px"}}>
                  <p>Speed:</p>
                </td>
                
                <td>
                  <p>{this.state.ballVector.magnitude.toFixed(1)} m/s</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      )
  }
}

export default Simulator;
