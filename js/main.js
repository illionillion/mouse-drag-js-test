"use strict"

import Dragarea from "./Dragarea.js"

const dragList = {}

const Ev = {
    down: 'ontouchstart' in document ? 'touchstart': 'mousedown',
    move: 'ontouchmove' in document ? 'touchmove': 'mousemove',
    up: 'ontouchend' in document ? 'touchend': 'mouseup',
}

export { Ev }

const output = document.getElementById('output')
const screen = document.getElementById('screen')
const list = document.getElementById('list')

window.addEventListener('DOMContentLoaded', e => {

    screen.addEventListener(Ev.move, pointerMove, {passive: false})
    list.addEventListener(Ev.move, e => {
        output.classList.add('hidden')
    }, {passive: false})
    output.addEventListener(Ev.move, e => {
        // console.log(e);
        e.preventDefault()
        e.stopPropagation()
    })

    screen.addEventListener(Ev.down, e => {
        // console.log('クリック開始');

        // if (Dragarea.hover) {
        //     Dragarea.click = true
        //     return
        // }

        const draareaobj = new Dragarea()

        Dragarea.click = true
        draareaobj.startPoint.x = e.pageX || e.changedTouches[0].pageX
        draareaobj.startPoint.y = e.pageY || e.changedTouches[0].pageY

        // ここで要素生成・DOMにマウント
        const ele = document.createElement('div')
        ele.className='dragarea'
        screen.appendChild(ele)
        draareaobj.ele = ele

        dragList[Dragarea.count] = draareaobj
        // console.log(dragList[Dragarea.count]);
        
    })
    screen.addEventListener(Ev.up, e => {
        // console.log('クリック終了');
        // if (Dragarea.hover) {
        //     Dragarea.click = false
        //     return
        // }

        const draareaobj = dragList[Dragarea.count]

        Dragarea.click = false
        draareaobj.endPoint.x = e.pageX || e.changedTouches[0].pageX
        draareaobj.endPoint.y = e.pageY || e.changedTouches[0].pageY
        draareaobj.setEvent()

        Dragarea.count++
        console.log(dragList);

        const liEle = document.createElement('li')
        liEle.innerHTML = `No.${draareaobj.id}<br/>${JSON.stringify(draareaobj.startPoint)}<br/>${JSON.stringify(draareaobj.endPoint)}`
        list.querySelector('ul').appendChild(liEle)
    })

})

/**
 * カーソルにポインター追従
 * @param {MouseEvent} e 
 */
const pointerMove = e => {

    e.preventDefault()
    e.stopPropagation()

    output.classList.remove('hidden')

    if ((!e.pageX || !e.pageY) && !e.changedTouches) {
        return
    }
    
    const pageX = e.pageX || e.changedTouches[0].pageX
    const pageY = e.pageY || e.changedTouches[0].pageY

    // console.log(pageX);
    
    output.style.transform = `translate(${pageX + 10}px, ${pageY + 10}px)`
    output.innerHTML = `X:${pageX}, Y:${pageY}`
    
    
    // const draareaobj = !Dragarea.hover ? dragList[Dragarea.count] : Dragarea.hoverEle
    const draareaobj = dragList[Dragarea.count]
    if (Dragarea.click) {
        const x = pageX > draareaobj.startPoint.x ? draareaobj.startPoint.x : pageX
        const width = pageX > draareaobj.startPoint.x ? pageX - draareaobj.startPoint.x : draareaobj.startPoint.x - pageX
        const y = pageY > draareaobj.startPoint.y ? draareaobj.startPoint.y : pageY
        const height = pageY > draareaobj.startPoint.y ? pageY - draareaobj.startPoint.y : draareaobj.startPoint.y - pageY
        // console.log('ドラッグ中');
        // console.log(percentW(width)+"%");
        // console.log(percentH(height)+"%");
        draareaobj.ele.style.transform = `translate(${x}px, ${y}px)` // 開始位置
        draareaobj.ele.style.width = (width) + 'px'
        draareaobj.ele.style.height = (height) + 'px'
        // if (!Dragarea.hover) {
        //     draareaobj.ele.style.width = (width) + 'px'
        //     draareaobj.ele.style.height = (height) + 'px'
        // }
        output.innerHTML = `X:${pageX}, Y:${pageY}, Width:${width}, Height:${height}`
    }
}

const percentWX = wx => {
    return wx / screen.clientWidth * 100
}
const percentHY = hy => {
    return hy / screen.clientHeight * 100
}