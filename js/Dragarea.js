import { Ev } from "./main.js"

export default class Dragarea {

    static count = 0

    static click = false

    static hover = false
    static hoverEle = undefined

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

    setEvent = () => {
        this.ele.addEventListener('mouseover', e => {
            e.preventDefault()
            e.stopPropagation()
    
            // console.log('ホバー！！');
            this.ele.classList.add('hover')
            Dragarea.hover = true
            Dragarea.hoverEle = this
            
        })
        this.ele.addEventListener('mouseleave', e => {
            e.preventDefault()
            e.stopPropagation()
    
            // console.log('ホバー解除！！');
            this.ele.classList.remove('hover')
            Dragarea.hover = false
            Dragarea.hoverEle = undefined
        })


    }
}