"use strict"

const Ev = {
    down: 'ontouchstart' in document ? 'touchstart': 'mousedown',
    move: 'ontouchmove' in document ? 'touchmove': 'mousemove',
    up: 'ontouchend' in document ? 'touchend': 'mouseup',
}

class DragArea {
    id = undefined
    start = {
        x:0,
        y:0
    }
    end = {
        x:0,
        y:0
    }
    width = 0
    height = 0

    dragEle = undefined
    handleEle = undefined

    static moveFlag = false
    static resizeFlag = false
    static nowInstance = undefined
    static dragCount = 0
    static dragArray = []

    constructor(x, y){
        this.id = DragArea.dragCount++
        this.start.x = x
        this.start.y = y
    }

    /**
     * ドラッグでサイズ変更
     */
    dragResize = (moveX, moveY) => {
        console.log('dragResize');
        // 動いた分取得
        // const moveX = e.movementX
        // const moveY = e.movementY

        this.width += moveX
        this.height += moveY

        this.dragEle.style.width = `${this.width}px`
        this.dragEle.style.height = `${this.height}px`
        
        
        // const x = pageX > dragareaobj.startPoint.x ? dragareaobj.startPoint.x : pageX
        // const width = pageX > dragareaobj.startPoint.x ? pageX - dragareaobj.startPoint.x : dragareaobj.startPoint.x - pageX
        // const y = pageY > dragareaobj.startPoint.y ? dragareaobj.startPoint.y : pageY
        // const height = pageY > dragareaobj.startPoint.y ? pageY - dragareaobj.startPoint.y : dragareaobj.startPoint.y - pageY
        
    }
    
    dragMove = (moveX, moveY) => {
        this.start.x += moveX
        this.start.y += moveY
        this.end.x += moveX
        this.end.y += moveY
        
        this.dragEle.style.left = `${this.start.x}px`
        this.dragEle.style.top = `${this.start.y}px`

    }
}

const output = document.getElementById('output')
const screen = document.getElementById('screen')
const screenFrame = document.getElementById('img-frame')
const screenImg = document.getElementById('img-frame').getElementsByTagName('img')[0]
const list = document.getElementById('list')
const listTemplate = document.getElementById('list-item-template')
const imgInput = document.getElementById('img-input')

export { Ev, output, screen, screenImg, list }

const init = () => {
    // マウス動いた時
    screenImg.addEventListener(Ev.move, pointerMove, {passive: true})
    // マウスクリック時
    screenImg.addEventListener(Ev.down, pointerDown)
    // マウスクリック解除時
    screenImg.addEventListener(Ev.up, pointerUp)
    
}

/**
 * マウスを動かした時
 * @param {MouseEvent} e 
 */
const pointerMove = e => {
    console.log('pointerMove');

    output.classList.remove('hidden')

    // マウスがundefinedになる時の対処法
    if ((!e.offsetX || !e.offsetY)) {
        return
    }

    // 画像上のX:Yを取得
    const offsetX = e.offsetX
    const offsetY = e.offsetY

    // outputの一番右端の座標
    const outputX = offsetX + 10 + output.clientWidth < screenImg.clientWidth ? offsetX + 10 : offsetX - output.clientWidth - 10
    // const outputX = offsetX//offsetX + 10 + output.clientWidth < screenImg.clientWidth ? offsetX + 10 : offsetX - output.clientWidth - 10
    // outputの一番右下の座標
    const outputY = offsetY + 10 + output.clientHeight < screenImg.clientHeight ? offsetY + 10 : offsetY - output.clientHeight - 10
    // const outputY = offsetY//offsetY + 10 + output.clientHeight < screenImg.clientHeight ? offsetY + 10 : offsetY - output.clientHeight - 10
    
    // outputが画面外に行かないようにする
    output.style.transform = `translate(${outputX}px, ${outputY}px)`
    output.innerHTML = `X:${offsetX}, Y:${offsetY}`

    // if (DragArea.resizeFlag && !DragArea.moveFlag) {
    if (DragArea.resizeFlag) {
        const nowInstance = DragArea.nowInstance
        nowInstance.dragResize(e.movementX, e.movementY)
    }
    // if (!DragArea.resizeFlag && DragArea.moveFlag) {
    if (DragArea.moveFlag) {
        const nowInstance = DragArea.nowInstance
        nowInstance.dragMove(e.movementX, e.movementY)
        
    }

    // そのほか
    // console.log(e.clientX + ":" + e.clientY);
    // console.log(e.screenX + ":" + e.screenY);
    // console.log(e.movementX + ":" + e.movementY);
    // console.log(e.pageX + ":" + e.offsetY);

}

/**
 * マウスクリック時
 * @param {MouseEvent} e 
 */
const pointerDown = e => {
    // マウスがundefinedになる時の対処法
    if ((!e.offsetX || !e.offsetY)) {
        return
    }
    if (DragArea.resizeFlag) {
        return
    }

    DragArea.resizeFlag = true

    // 画像上のX:Yを取得
    const offsetX = e.offsetX
    const offsetY = e.offsetY

    const count = DragArea.dragCount
    const dragarea = new DragArea(offsetX, offsetY)
    DragArea.dragArray[count] = dragarea
    DragArea.nowInstance = dragarea

    console.log(offsetX + " : " + offsetY);

    // ここで要素生成・DOMにマウント
    const dragEle = document.createElement('div')
    // 初期位置設定
    dragEle.style.left = `${offsetX}px`
    dragEle.style.top = `${offsetY}px`
    
    
    const handleEle = document.createElement('div')
    handleEle.className = 'dragarea-handle'
    
    handleEle.innerHTML = dragarea.id
    dragEle.appendChild(handleEle)
    dragEle.className='dragarea'
    screenFrame.appendChild(dragEle)
    dragarea.dragEle = dragEle
    dragarea.handleEle = handleEle
}

const pointerUp = e => {
    if ((!e.offsetX || !e.offsetY)) {
        return
    }

    DragArea.resizeFlag = false

    // 画像上のX:Yを取得
    const offsetX = e.offsetX
    const offsetY = e.offsetY

    const nowInstance = DragArea.nowInstance

    nowInstance.end.x = offsetX
    nowInstance.end.y = offsetY

    nowInstance.handleEle.addEventListener(Ev.down, e => {
        if (DragArea.moveFlag) {
            return
        }
        DragArea.resizeFlag = true
        DragArea.nowInstance = nowInstance
    })
    nowInstance.handleEle.addEventListener(Ev.up, e => {
        DragArea.resizeFlag = false
    })
    nowInstance.dragEle.addEventListener(Ev.down, e => {
        if (DragArea.resizeFlag) {
            return
        }
        DragArea.moveFlag = true
        DragArea.nowInstance = nowInstance
    })
    nowInstance.dragEle.addEventListener(Ev.up, e => {
        DragArea.moveFlag = false
    })
    
}

window.addEventListener('load', init)