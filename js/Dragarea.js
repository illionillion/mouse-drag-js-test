import { Ev } from "./main.js"

export default class Dragarea {

    static count = 0

    static click = false

    static hover = false
    static hoverEle = undefined
    static drag = false
    static position = {
        x:0,
        y:0
    }

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
    liele = undefined

    constructor(){
        this.id = Dragarea.count
    }

    down = e => {
        if(!Dragarea.hover) return

        console.log('ホバー時ダウン');
        Dragarea.click = true
        Dragarea.drag = true
        Dragarea.position.x = e.pageX || e.changedTouches[0].pageX
        Dragarea.position.y = e.pageY || e.changedTouches[0].pageY

    }

    up = e => {
        if(!Dragarea.hover) return

        Dragarea.click = false
        Dragarea.drag = false
        Dragarea.position.x = 0
        Dragarea.position.y = 0
    }

    setEvent = () => {
        this.ele.addEventListener('mouseover', e => {
            e.preventDefault()
            e.stopPropagation()
            if(Dragarea.drag) return

            
            console.log('ホバー！！');
            this.ele.classList.add('hover')
            Dragarea.hover = true
            Dragarea.hoverEle = this
            
        })
        this.ele.addEventListener('mouseleave', e => {
            e.preventDefault()
            e.stopPropagation()
            if(Dragarea.drag) return
            
            console.log('ホバー解除！！');
            this.ele.classList.remove('hover')
            // Dragarea.hoverEle.classList.remove('current')

            Dragarea.hover = false
            Dragarea.hoverEle = undefined
            // this.ele.addEventListener(Ev.up, this.down)
        })
        // this.ele.addEventListener(Ev.down, this.down)


    }
}