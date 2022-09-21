"use strict"

import Dragarea from "./Dragarea.js"

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

const dragList = {}

const Ev = {
    down: 'ontouchstart' in document ? 'touchstart': 'mousedown',
    move: 'ontouchmove' in document ? 'touchmove': 'mousemove',
    up: 'ontouchend' in document ? 'touchend': 'mouseup',
}

const output = document.getElementById('output')
// const dragarea = document.getElementById('dragarea')
let dragarea = document.getElementById('dragarea')


window.addEventListener('DOMContentLoaded', e => {

    document.addEventListener(Ev.move, pointerMove, {passive: false})

    document.addEventListener(Ev.down, e => {
        // console.log('クリック開始');

        const draareaobj = new Dragarea()

        Dragarea.click = true
        draareaobj.startPoint.x = e.pageX || e.changedTouches[0].pageX
        draareaobj.startPoint.y = e.pageY || e.changedTouches[0].pageY

        // ここで要素生成・DOMにマウント
        const ele = document.createElement('div')
        ele.className='dragarea '
        document.body.appendChild(ele)
        draareaobj.ele = ele

        // dragarea.classList.remove('hidden')
        dragList[Dragarea.count] = draareaobj
        // console.log(dragList[Dragarea.count]);
        
    })
    document.addEventListener(Ev.up, e => {
        // console.log('クリック終了');

        const draareaobj = dragList[Dragarea.count]

        Dragarea.click = false
        draareaobj.endPoint.x = e.pageX || e.changedTouches[0].pageX
        draareaobj.endPoint.y = e.pageY || e.changedTouches[0].pageY

        
        // dragarea.classList.add('hidden')
        // dragList[Dragarea.count].ele.style.transform = `translate(${0}px, ${0}px)` // 開始位置
        // dragList[Dragarea.count].ele.style.width = (0) + 'px'
        // dragList[Dragarea.count].ele.style.height = (0) + 'px'
        
        Dragarea.count++
        console.log(dragList);
    })

})

/**
 * カーソルにポインター追従
 * @param {MouseEvent} e 
 */
const pointerMove = e => {

    e.preventDefault()

    if ((!e.pageX || !e.pageY) && !e.changedTouches) {
        return
    }
    
    const pageX = e.pageX || e.changedTouches[0].pageX
    const pageY = e.pageY || e.changedTouches[0].pageY
    
    output.style.transform = `translate(${pageX + 10}px, ${pageY + 10}px)`
    output.innerHTML = `X:${pageX}, Y:${pageY}`
    
    
    const draareaobj = dragList[Dragarea.count]
    if (Dragarea.click) {
        const x = pageX > draareaobj.startPoint.x ? draareaobj.startPoint.x : pageX
        const width = pageX > draareaobj.startPoint.x ? pageX - draareaobj.startPoint.x : draareaobj.startPoint.x - pageX
        const y = pageY > draareaobj.startPoint.y ? draareaobj.startPoint.y : pageY
        const height = pageY > draareaobj.startPoint.y ? pageY - draareaobj.startPoint.y : draareaobj.startPoint.y - pageY
        // console.log('ドラッグ中');
        dragList[Dragarea.count].ele.style.transform = `translate(${x}px, ${y}px)` // 開始位置
        dragList[Dragarea.count].ele.style.width = (width) + 'px'
        dragList[Dragarea.count].ele.style.height = (height) + 'px'
        output.innerHTML = `X:${pageX}, Y:${pageY}, Width:${width}, Height:${height}`
    }
}