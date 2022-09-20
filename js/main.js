"use strict"

const setting = {
    click: false,
    startPoint: {
        x:0,
        y:0
    },
    endPoint: {
        x:0,
        y:0
    }
}

const Ev = {
    down: 'ontouchstart' in document ? 'touchstart': 'mousedown',
    move: 'ontouchmove' in document ? 'touchmove': 'mousemove',
    up: 'ontouchend' in document ? 'touchend': 'mouseup',
}

const output = document.getElementById('output')
const dragarea = document.getElementById('dragarea')


window.addEventListener('DOMContentLoaded', e => {

    // document.addEventListener('mousemove', pointerMove)
    document.addEventListener(Ev.move, pointerMove, {passive: false})

    document.addEventListener(Ev.down, e => {
        // console.log('クリック開始');
        setting.click = true
        setting.startPoint.x = e.pageX || e.changedTouches[0].pageX
        setting.startPoint.y = e.pageY || e.changedTouches[0].pageY
        dragarea.classList.remove('hidden')
        
    })
    document.addEventListener(Ev.up, e => {
        // console.log('クリック終了');
        setting.click = false
        setting.endPoint.x = e.pageX || e.changedTouches[0].pageX
        setting.endPoint.y = e.pageY || e.changedTouches[0].pageY
        dragarea.classList.add('hidden')
        dragarea.style.transform = `translate(${0}px, ${0}px)` // 開始位置
        dragarea.style.width = (0) + 'px'
        dragarea.style.height = (0) + 'px'

    })

})

/**
 * カーソルにポインター追従
 * @param {MouseEvent} e 
 */
const pointerMove = e => {

    e.preventDefault()

    const pageX = e.pageX || e.changedTouches[0].pageX
    const pageY = e.pageY || e.changedTouches[0].pageY

    output.style.transform = `translate(${pageX + 10}px, ${pageY + 10}px)`
    output.innerHTML = `X:${pageX}, Y:${pageY}`
    
    const x = pageX > setting.startPoint.x ? setting.startPoint.x : pageX
    const width = pageX > setting.startPoint.x ? pageX - setting.startPoint.x : setting.startPoint.x - pageX
    const y = pageY > setting.startPoint.y ? setting.startPoint.y : pageY
    const height = pageY > setting.startPoint.y ? pageY - setting.startPoint.y : setting.startPoint.y - pageY
    
    if (setting.click) {
        // console.log('ドラッグ中');
        dragarea.style.transform = `translate(${x}px, ${y}px)` // 開始位置
        dragarea.style.width = (width) + 'px'
        dragarea.style.height = (height) + 'px'
        output.innerHTML = `X:${pageX}, Y:${pageY}, Width:${width}, Height:${height}`
    }
}