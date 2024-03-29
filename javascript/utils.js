const state = {
  DEFAULT:0,
  SETTLING:1,
  PAUSE:2,
}
/*
POSSIBLE STATES:
0 - DEFAULT,  player can move this block left+right
1 - SETTLING, unresponsive while board goes through combos/falling blocks
2 - PAUSE,    generic unresponsive - used for game over screen, etc
*/

const blocks = {
/* A block should take arguments: colors: Array, rot: number, and should output:
        return [ [x, y, color], [...], ... ]
*/
  basic: (colors, rot) => {
    /* Rotation defines a step clockwise from the bottom of the basic block;
      rotation numbers demonstrated below, X as origin:
            [0]
         [1][X][3]
            [2]
      For odd rotations, (1 - 2) will provide the x offset -1, and (3 - 2) will provide the x offset 1
      For even rotations, (0 - 1) will provide the y offset -1, and (2 - 1) will provide the y offset 1
    */

    if (rot % 2 == 0) {
      return [[0, 0, colors[0]], [0, rot-1, colors[1]]]
    } else {
      return [[0, 0, colors[0]], [rot-2, 0, colors[1]]]
    }
  }

}

const rotTests = {
  basic: (newRot, oldRot=newRot) => {
    const tests = [
      [ [0, 0] ],                  // Rotation 0, index 0
      [ [0, 0], [1, 0], [0, -1], [1, -1] ], // Rotation 1, index 1
      [ [0, 0], [0, -1] ],         // Rotation 2, index 2
      [ [0, 0], [-1, 0], [0, -1], [-1, -1] ] // Rotation 3, index 3
    ]

    return tests[newRot];         // Returned to the board
  }
}

const mod = (x, n) => (x % n + n) % n;
