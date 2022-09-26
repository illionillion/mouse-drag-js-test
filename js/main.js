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
const listTemplate = document.getElementById('list-item-template')

window.addEventListener('DOMContentLoaded', e => {

    screen.addEventListener(Ev.move, pointerMove, {passive: false})
    list.addEventListener(Ev.move, e => {
        output.classList.add('hidden')
    }, {passive: false})
    // output.addEventListener(Ev.move, e => {
    //     console.log(e);
    //     e.preventDefault()
    //     e.stopPropagation()
    // })

    screen.addEventListener(Ev.down, e => {

        console.log('クリック開始');
        if(Dragarea.click) return
        if (Dragarea.hover) {
            Dragarea.click = true
            Dragarea.drag = true
            Dragarea.position.x = e.pageX || e.changedTouches[0].pageX
            Dragarea.position.y = e.pageY || e.changedTouches[0].pageY
            Dragarea.hoverEle.ele.classList.add('current')
            // console.log(Dragarea.hoverEle);

            return
        }

        const dragareaobj = new Dragarea()

        Dragarea.click = true
        dragareaobj.startPoint.x = e.pageX || e.changedTouches[0].pageX
        dragareaobj.startPoint.y = e.pageY || e.changedTouches[0].pageY

        // ここで要素生成・DOMにマウント
        const ele = document.createElement('div')
            const handleEle = document.createElement('div')
            handleEle.className = 'dragarea-handle'
            ele.appendChild(handleEle)
        ele.className='dragarea'
        screen.appendChild(ele)
        dragareaobj.ele = ele
        dragareaobj.handleEle = handleEle

        dragList[Dragarea.count] = dragareaobj
        // console.log(dragList[Dragarea.count]);
        
    })
    screen.addEventListener(Ev.up, e => {
        console.log('クリック終了');
        const dragareaobj = dragList[Dragarea.count]
        if (Dragarea.hover || !dragareaobj) {
            Dragarea.click = false
            Dragarea.drag = false
            Dragarea.position.x = 0
            Dragarea.position.y = 0
            Dragarea.handledrag = false
            Dragarea?.hoverEle?.ele.classList.remove('current')
            // console.log(dragareaobj);
            
            return
        }
        Dragarea.click = false
        
        dragareaobj.endPoint.x = e.pageX || e.changedTouches[0].pageX - dragareaobj.startPoint.x
        dragareaobj.endPoint.y = e.pageY || e.changedTouches[0].pageY - dragareaobj.startPoint.y
        dragareaobj.setEvent()

        Dragarea.count++
        // console.log(dragList);

        // const liEle = document.createElement('li')
        console.dir(listTemplate);
        const liEle = listTemplate.content.cloneNode(true)
        // console.dir(liEle.querySelector('input.xpx'));
        liEle.querySelector('.li-number').innerHTML = dragareaobj.id
        list.querySelector('ul').appendChild(liEle)
        // dragareaobj.liele = liEle
        dragareaobj.liele = list.querySelectorAll(`ul li`)[dragareaobj.id]
        dragareaobj.setListEle()
        dragareaobj.setListEvent()
    })

})

/**
 * カーソルにポインター追従
 * @param {MouseEvent} e 
 */
const pointerMove = e => {

    // e.preventDefault()
    // e.stopPropagation()

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
        // console.log(x+":"+y);
        dragareaobj.ele.style.transform = `translate(${x}px, ${y}px)` // 開始位置
        dragareaobj.ele.style.width = (width) + 'px'
        dragareaobj.ele.style.height = (height) + 'px'
        output.innerHTML = `X:${pageX}, Y:${pageY}, Width:${width}, Height:${height}`

    } else if(Dragarea.click && Dragarea.drag && dragareaobj){
        // console.log('ドラッグ中');

        // console.log(pageX);
        // console.log(dragareaobj.endPoint.x);
        // console.log(pageY);
        // console.log(dragareaobj.endPoint.y);
        const abx = pageX - Dragarea.position.x // マウスが動いた差分計算
        const aby = pageY - Dragarea.position.y
        Dragarea.position.x = pageX // 差分比較位置更新
        Dragarea.position.y = pageY
        const style = window.getComputedStyle(dragareaobj.ele);
        const matrix = new WebKitCSSMatrix(style.transform); // 実際のtranslateのXY値取得
        dragareaobj.endPoint.x += abx // 差分反映 // いらない？
        dragareaobj.endPoint.y += aby

        // console.log(Dragarea.handledrag);
        if (Dragarea.handledrag) {
            // console.log('疑似要素');

            // const width = pageX - dragareaobj.startPoint.x
            // const height = pageY - dragareaobj.startPoint.y
            const width = parseInt(dragareaobj.ele.style.width.replace('px','')) + abx
            const height = parseInt(dragareaobj.ele.style.height.replace('px','')) + aby

            dragareaobj.ele.style.width = (width) + 'px'
            dragareaobj.ele.style.height = (height) + 'px'    
            output.innerHTML = `X:${pageX}, Y:${pageY}, Width:${width}, Height:${height}`
            dragareaobj.setListEle()

            return
        }
        
        dragareaobj.startPoint.x = matrix.m41 + abx // 差分反映
        dragareaobj.startPoint.y = matrix.m42 + aby
        const x = dragareaobj.startPoint.x
        const y = dragareaobj.startPoint.y

        dragareaobj.ele.style.transform = `translate(${x}px, ${y}px)` // 開始位置
        dragareaobj.setListEle()

        // console.log('hover');
    }
}

const percentWX = wx => {
    return wx / screen.clientWidth * 100
}
const percentHY = hy => {
    return hy / screen.clientHeight * 100
}