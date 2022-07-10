import { Vector } from "./Utils/VectorMath"
import * as VectorMath from "./Utils/VectorMath"

export class BallisticObj {
    constructor (args) {
      this.scale = args.scale
      this.scaleRad = args.rad / args.scale
      this.ballStateDisplay = args.ballStateDisplay
  
      this.state = {
        position: args.position,
        velocityVector: new Vector(0, VectorMath.directions.right),
        envSize: args.envSize
      }
    }
  
    calculatePath() {
      const currPosition = this.state.position
      const currVelocity = this.state.velocityVector
      const gravityAddedVelocity = VectorMath.velocityFromAcceleration(VectorMath.gravity, 10)
      
      let newVelocity = Vector.combineVectors(currVelocity, gravityAddedVelocity)
  
      const newVelocity_components = newVelocity.getVectorComponents()
  
      let newPosition = {
        x: currPosition.x + (newVelocity_components.x * this.scale),
        y: currPosition.y + (newVelocity_components.y * this.scale)
      }
  
      if (this.checkOutOfBounds(newPosition)) {
        [newPosition, newVelocity] = this.bounce(newPosition, newVelocity)
      }
  
      this.ballStateDisplay(newVelocity)
  
  
  
      Object.assign(this.state, {
        velocityVector: newVelocity,
        position: newPosition
      })
    }
  
    bounce(position, velocity) {
      const elasticity = .9
  
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
  
      return [newPosition, new Vector(newVelocity_magnitude, newVelocity_angle)]
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

    draw(context) {
      this.calculatePath()

      context.beginPath()
      
      context.arc(this.state.position.x, this.state.position.y, this.scaleRad, 0, Math.PI * 2, true)
      
      context.fillStyle = "red"

      context.fill()
    }
  }