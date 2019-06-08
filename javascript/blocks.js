export const blocks = {
    basic: (rot) => {
        if (rot % 2 == 0) {
            return [[0,0], [0, rot-1]]
        } else {
            return [[0,0], [rot-2, 0]]
        }
    }
}