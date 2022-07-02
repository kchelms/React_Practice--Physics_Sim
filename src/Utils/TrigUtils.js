const degreesToRad = (deg) => {
    return boundAngle(deg) * Math.PI / 180
  }
  
  const radToDegrees = (rad) => {
    return boundAngle(rad * 180 / Math.PI)
  }

const sin = (angle) => {
    if (angle === 180 || angle === 360)
        return 0

    angle = degreesToRad(angle)

    return Math.sin(angle)
}

const cos = (angle) => {
    if (angle === 90 || angle === 270)
        return 0

    angle = degreesToRad(angle)

    return Math.cos(angle)
}

const getAngle = (y, x) => {
    const rad_result = Math.atan2(y, x)

    return radToDegrees(rad_result)
}

const boundAngle = (angle_deg) => {
    if(angle_deg < 0)
        angle_deg += 360

    else if(angle_deg > 360)
        angle_deg -= 360

    else if(Object.is(angle_deg, -0))
        angle_deg = 180

    return angle_deg
}

export {degreesToRad, radToDegrees, sin, cos, getAngle}