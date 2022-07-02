import * as Trig from './TrigUtils.js'

const velocityFromAcceleration = (accVector, millis) => {
    return new Vector(
      accVector.magnitude * millis / 1000,
      accVector.angle
    )
}
  
  class Vector {			
    constructor(magnitude, angle, d = 1) {
			if(Object.is(angle, -0))
				console.log(angle)

			

      this.magnitude = magnitude
			this.angle = angle			
			this.d = d
    }
  
    static getVectorFromComponents(x, y, d = 1) {
      const magnitude = Math.sqrt(x * x + y * y)
      const angle = Trig.getAngle(y, x)
  
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
  
      const xComp = Trig.cos(angle) * magnitude
      const yComp = Trig.sin(angle) * magnitude
      
      return {x: xComp, y: yComp}
    }
  }

  export { Vector, velocityFromAcceleration }