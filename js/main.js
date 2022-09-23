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
        if(Dragarea.click) return
        if (Dragarea.hover) {
            Dragarea.click = true
            Dragarea.drag = true
            Dragarea.position.x = e.pageX || e.changedTouches[0].pageX
            Dragarea.position.y = e.pageY || e.changedTouches[0].pageY
            console.log(Dragarea.hoverEle);
            Dragarea.hoverEle.ele.classList.add('current')

            return
        }

        const dragareaobj = new Dragarea()

        Dragarea.click = true
        dragareaobj.startPoint.x = e.pageX || e.changedTouches[0].pageX
        dragareaobj.startPoint.y = e.pageY || e.changedTouches[0].pageY

        // ここで要素生成・DOMにマウント
        const ele = document.createElement('div')
        ele.className='dragarea'
        screen.appendChild(ele)
        dragareaobj.ele = ele

        dragList[Dragarea.count] = dragareaobj
        // console.log(dragList[Dragarea.count]);
        
    })
    screen.addEventListener(Ev.up, e => {
        // console.log('クリック終了');
        const dragareaobj = dragList[Dragarea.count]
        if (Dragarea.hover || !dragareaobj) {
            Dragarea.click = false
            Dragarea.drag = false
            Dragarea.position.x = 0
            Dragarea.position.y = 0
            Dragarea?.hoverEle?.ele.classList.remove('current')
            
            return
        }
        Dragarea.click = false
        
        dragareaobj.endPoint.x = e.pageX || e.changedTouches[0].pageX
        dragareaobj.endPoint.y = e.pageY || e.changedTouches[0].pageY
        dragareaobj.setEvent()

        Dragarea.count++
        console.log(dragList);

        const liEle = document.createElement('li')
        liEle.innerHTML = `No.${dragareaobj.id}<br/>${JSON.stringify(dragareaobj.startPoint)}<br/>${JSON.stringify(dragareaobj.endPoint)}`
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
    
    
    const dragareaobj = !Dragarea.drag ? dragList[Dragarea.count] : Dragarea.hoverEle
    // console.log(dragareaobj);
    // const dragareaobj = dragList[Dragarea.count]
    if (Dragarea.click && !Dragarea.drag && dragareaobj) {
        const x = pageX > dragareaobj.startPoint.x ? dragareaobj.startPoint.x : pageX
        const width = pageX > dragareaobj.startPoint.x ? pageX - dragareaobj.startPoint.x : dragareaobj.startPoint.x - pageX
        const y = pageY > dragareaobj.startPoint.y ? dragareaobj.startPoint.y : pageY
        const height = pageY > dragareaobj.startPoint.y ? pageY - dragareaobj.startPoint.y : dragareaobj.startPoint.y - pageY
        // console.log('ドラッグ中');
        // console.log(percentW(width)+"%");
        // console.log(percentH(height)+"%");
        console.log(x+":"+y);
        dragareaobj.ele.style.transform = `translate(${x}px, ${y}px)` // 開始位置
        dragareaobj.ele.style.width = (width) + 'px'
        dragareaobj.ele.style.height = (height) + 'px'
        output.innerHTML = `X:${pageX}, Y:${pageY}, Width:${width}, Height:${height}`
    } else if(Dragarea.click && Dragarea.drag && dragareaobj){
        
        console.log(Dragarea.hoverEle);

        const abx = pageX - Dragarea.position.x
        const aby = pageY - Dragarea.position.y
        Dragarea.position.x = pageX
        Dragarea.position.y = pageY
        Dragarea.hoverEle.startPoint.x += abx
        Dragarea.hoverEle.startPoint.y += aby
        const x = Dragarea.hoverEle.startPoint.x
        const y = Dragarea.hoverEle.startPoint.y

        dragareaobj.ele.style.transform = `translate(${x}px, ${y}px)` // 開始位置

        // console.log('hover');
    }
}

const percentWX = wx => {
    return wx / screen.clientWidth * 100
}
const percentHY = hy => {
    return hy / screen.clientHeight * 100
}