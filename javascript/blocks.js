/* A block should take in an array of colors and it's rotation, and should output an array of
    arrays representing the segments of a block, containing an x, y and color value:
        return [ [x, y, color], [...], ... ]
*/
const blocks = {

    basic: (colors, rot) => {
        /* Rotation defines a step counter-clockwise from the bottom of the basic block
            rotation numbers demonstrated below, X as origin:
                   [2]
                [1][X][3]
                   [0]
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
