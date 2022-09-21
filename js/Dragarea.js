export default class Dragarea {

    static count = 0

    static click = false

    id = 0

    startPoint = {
        x:0,
        y:0
    }
    endPoint = {
        x:0,
        y:0
    }
    ele = undefined

    constructor(){
        this.id = Dragarea.count
    }
}