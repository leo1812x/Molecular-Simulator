//* function to simulate motion under constant acceleration using the Stormer-Verlet method.
// pos: Initial position of the object (assumed to be positive for simulation).
// acc: Constant acceleration acting on the object.
// dt: Time step for each iteration of the simulation.
export function stormerVerlet(pos: number, acc: number, dt: number): [number, number] {
    // Initialize previous position with the initial position.
    let prevPos: number = pos;
    // Initialize time variable to track the elapsed time of the simulation.
    let time: number = 0.0;
    // Initialize velocity variable. Velocity is initially zero since the object starts from rest.
    let vel: number = 0.0;
  
    // Continue the simulation until the object's position is non-positive,
    // indicating it has reached or passed the origin (or a defined threshold).
    while (pos > 0.0) {
      // Increment time by the time step to simulate the passage of time.
      time += dt;
      // Temporary variable to store the current position before updating.
      const tempPos: number = pos;
      // Update the position based on the Stormer-Verlet integration method.
      // New position is calculated based on the previous and current positions,
      // acceleration, and the square of the time step.
      pos = pos * 2 - prevPos + acc * dt * dt;
      // Update previous position for the next iteration.
      prevPos = tempPos;
  
      // Update velocity. Since acceleration is constant,
      // velocity is updated linearly with time.
      vel += acc * dt;
    }
  
    // Return the total time of the simulation and the final velocity of the object.
    return [time, vel];
  }
  