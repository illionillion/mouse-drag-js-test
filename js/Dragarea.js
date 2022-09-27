import { Ev, list, screen } from "./main.js"

export default class Dragarea {

    static count = 0

    static click = false

    static hover = false
    static hoverEle = undefined
    static drag = false
    static handledrag = false
    static position = {
        x:0,
        y:0
    }
    static dragList = {}

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
    handleEle = undefined

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

        this.handleEle.addEventListener(Ev.down, e => {
            Dragarea.handledrag = true
        })
        this.handleEle.addEventListener(Ev.up, e => {
            Dragarea.handledrag = false
        })
        // this.ele.addEventListener(Ev.down, this.down)

        // console.log(getComputedStyle(this.ele, "::after"));

    }

    setListEle = () => {
        // console.dir(this.liele.querySelector);
        // console.dir(this.liele);
        // console.dir(this.liele.querySelector('input.xpx'));
        this.liele.querySelector('.li-number').innerHTML = this.id
        this.liele.querySelector('.xpx').value = this.startPoint.x
        this.liele.querySelector('.ypx').value = this.startPoint.y
        this.liele.querySelector('.wpx').value = this.ele.style.width.replace('px','')
        this.liele.querySelector('.hpx').value = this.ele.style.height.replace('px','')
        // this.liele.innerHTML = `No.${this.id}<br/>${JSON.stringify(this.startPoint)}<br/>{"w":${this.ele.style.width.replace('px','')}, "h"${this.ele.style.height.replace('px','')}}`
        
    }
    
    setListEvent = () => {
        this.liele.querySelector('.xpx').addEventListener('input', this.upDateVal)
        this.liele.querySelector('.ypx').addEventListener('input', this.upDateVal)
        this.liele.querySelector('.wpx').addEventListener('input', this.upDateVal)
        this.liele.querySelector('.hpx').addEventListener('input', this.upDateVal)
        this.liele.querySelector('.delete-button').addEventListener('click', this.deleteObj)
    }

    deleteObj = () => {
        // console.log('delete!!');
        screen.removeChild(this.ele)
        console.log(this.liele);
        list.querySelector('ul').removeChild(this.liele)
    }

    upDateVal = e => {
        const type = e.target.dataset.pxType
        const val = e.target.value
        // console.log(type);
        // console.log(val);

        switch (type) {
            case 'x':
                this.startPoint.x = val
                this.ele.style.transform = `translate(${val}px, ${this.startPoint.y}px)` // 開始位置
                break;
            case 'y':
                this.startPoint.y = val
                this.ele.style.transform = `translate(${this.startPoint.x}px, ${val}px)` // 開始位置
                break;
            case 'w':
                this.endPoint.x = val
                this.ele.style.width = (val) + 'px'
                break;
            case 'h':
                this.endPoint.y = val
                this.ele.style.height = (val) + 'px'    
                break;
        
            default:
                break;
        }
    }
}