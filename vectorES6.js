class Vector {
    constructor(vector) {
      try {
        this.coordinates = [...vector];
        if (this.coordinates.length === 0) {
          throw 'The coordinates must be nonempty';
        }
        this.dimension = vector.length;
      } catch(e) {
        console.log(e)
      }
    }

    isEqual = (otherVector) => {
      return this.coordinates.reduce((accumulator, coord, index) => {
        if (accumulator === false) {
          return false;
        } else {
          return (coord === otherVector.coordinates[index])
        }
      }, true)
    }

    plus = (otherVector) => {
      if (otherVector.coordinates.length !== this.coordinates.length) {
        console.log('Vectors must be the same length')
        return
      }
      return new Vector(this.coordinates.map((coordinate, index) => coordinate + otherVector.coordinates[index]));
    }

    minus = (otherVector) => {
      if (otherVector.coordinates.length !== this.coordinates.length) {
        console.log('Vectors must be the same length')
        return
      }
      return new Vector(this.coordinates.map((coordinate, index) => coordinate - otherVector.coordinates[index]));
    }

    log = () => {
      console.log("Vector: " + this.coordinates);
    }

    timesScalar = (c) => {
      return new Vector(this.coordinates.map((coordinate) => c*coordinate ));
    }

    magnitude = () => {
      const squaredCoords = this.coordinates.map((coordinate) => coordinate * coordinate)
      const sumofSquaredCoords = squaredCoords.reduce((accumulator, squaredCoord) => {
        return accumulator + squaredCoord
      }, 0)
      return Math.pow(sumofSquaredCoords, 0.5);
    }

    normalized = () => {
      try {
        const magnitude = this.magnitude();
        if (magnitude !== 0) {
          return this.timesScalar(1/magnitude);
        }
        throw 'Cannot normalize the zero vector'
      } catch(e) {
        console.log(e)
      }
    }

    dot = (otherVector) => {
      const multipliedCoords = this.coordinates.map((coordinate, index) => (
        coordinate * otherVector.coordinates[index]
      ))
      return multipliedCoords.reduce((accumulator, coord) => {
        return accumulator + coord
      }, 0)
    }

    angleWith = (otherVector, isRad = true) => {
      const u1 = this.normalized();
      const u2 = otherVector.normalized();
      const radAngle = Math.acos(u1.dot(u2));
      // const dotProduct = this.dotProduct(otherVector);
      // const magnitude = this.magnitude();
      // const otherMagnitude = otherVector.magnitude();
      const degreesPerRadian = 180 / Math.PI
      return isRad
        ? radAngle
        : radAngle * degreesPerRadian
    }

    isZero = (tolerance=1e-10) => {
      return this.magnitude() < tolerance
    }

    isParallel = (otherVector, tolerance=1e-10) => {
      if (this.isZero() || otherVector.isZero()) {
        return true
      }
      const scalar = otherVector.coordinates[0] / this.coordinates[0];
      const scaledVector = this.timesScalar(scalar);
      return scaledVector.isEqual(otherVector);
    }

    isOrthogonal = (otherVector, tolerance=1e-10) => {
      if (this.isZero() || otherVector.isZero()) {
        return true
      }
      return Math.abs(this.dot(otherVector)) < tolerance
    }

    projectionOntoBase = (baseVector) => {
      const unitBase = baseVector.normalized();
      const vDotUnitBase = this.dot(unitBase);
      return unitBase.timesScalar(vDotUnitBase);

    }

    componentOrthogonalToBase = (baseVector) => {
      const projectionOntoBase = this.projectionOntoBase(baseVector);
      return this.minus(projectionOntoBase);
    }

    cross = (otherVector) => {
      const [x1, y1, z1] = this.coordinates;
      const [x2, y2, z2] = otherVector.coordinates;
      const newCoordinates = [ y1*z2 - y2*z1 , -(x1*z2 - x2*z1), x1*y2 - x2*y1 ];
      return new Vector(newCoordinates);
    }

    areaParallelogramWith = (otherVector) => {
      const crossProductVector = this.cross(otherVector);
      return crossProductVector.magnitude();
    }

    areaTriangleWith = (otherVector) => {
      return this.areaParallelogram(otherVector)/2;
    }



}

const v = new Vector([1.671, -1.012, -0.318])
const c = new Vector([7.41]);
const w = new Vector([-8.223, 0.878])

v.minus(c).coordinates
