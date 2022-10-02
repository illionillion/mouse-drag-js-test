"use strict"

import Dragarea from "./Dragarea.js"

const Ev = {
    down: 'ontouchstart' in document ? 'touchstart': 'mousedown',
    move: 'ontouchmove' in document ? 'touchmove': 'mousemove',
    up: 'ontouchend' in document ? 'touchend': 'mouseup',
}

const output = document.getElementById('output')
const screen = document.getElementById('img-frame')
const list = document.getElementById('list')
const listTemplate = document.getElementById('list-item-template')
const imgInput = document.getElementById('img-input')

export { Ev, output, screen, list }

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

    imgInput.addEventListener('change', e => {
        console.dir(imgInput.value);
        console.dir(imgInput.files[0]);
        const file = imgInput.files[0]
        const reader = new FileReader()
        if (file) {
            reader.addEventListener('load', e => {
                const imgEle = document.createElement('img')
                imgEle.src = e.target.result
                // imgEle.addEventListener(Ev.move, e => {e.preventDefault();e.stopPropagation()})
                screen.appendChild(imgEle)
                console.log(e.target.result);
            })
            reader.readAsDataURL(file)
        }
    })

    screen.addEventListener(Ev.down, e => {

        console.log('クリック開始');
        if(Dragarea.click) return
        if (Dragarea.hover) {
            Dragarea.click = true
            Dragarea.drag = true
            Dragarea.position.x = e.offsetX || e.changedTouches[0].offsetX
            Dragarea.position.y = e.offsetY || e.changedTouches[0].offsetY
            Dragarea.hoverEle.ele.classList.add('current')
            // console.log(Dragarea.hoverEle);

            return
        }

        const dragareaobj = new Dragarea()

        Dragarea.click = true
        dragareaobj.startPoint.x = e.offsetX || e.changedTouches[0].offsetX
        dragareaobj.startPoint.y = e.offsetY || e.changedTouches[0].offsetY
        console.log(e.offsetX);
        console.log(e.offsetY);
        // ここで要素生成・DOMにマウント
        const ele = document.createElement('div')
            const handleEle = document.createElement('div')
            handleEle.className = 'dragarea-handle'
            handleEle.innerHTML = dragareaobj.id
            ele.appendChild(handleEle)
        ele.className='dragarea'
        screen.appendChild(ele)
        dragareaobj.ele = ele
        dragareaobj.handleEle = handleEle

        Dragarea.dragList[Dragarea.count] = dragareaobj
        // console.log(Dragarea.dragList[Dragarea.count]);
        
    })
    screen.addEventListener(Ev.up, e => {
        console.log('クリック終了');
        const dragareaobj = Dragarea.dragList[Dragarea.count]
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
        
        dragareaobj.endPoint.x = e.offsetX || e.changedTouches[0].offsetX - dragareaobj.startPoint.x
        dragareaobj.endPoint.y = e.offsetY || e.changedTouches[0].offsetY - dragareaobj.startPoint.y
        dragareaobj.setEvent()

        Dragarea.count++
        // console.log(Dragarea.dragList);

        // const liEle = document.createElement('li')
        // console.dir(listTemplate);
        const liEle = listTemplate.content.cloneNode(true)
        // console.dir(liEle.querySelector('input.xpx'));
        // console.log(liEle.querySelector('li'));
        liEle.querySelector('li').dataset.dragId = dragareaobj.id
        // liEle.querySelector('.li-number').innerHTML = dragareaobj.id
        list.querySelector('ul').appendChild(liEle)
        // dragareaobj.liele = liEle
        // console.log(list.querySelector(`ul li[data-drag-id = "${dragareaobj.id}"]`));
        dragareaobj.liele = list.querySelector(`ul li[data-drag-id = "${dragareaobj.id}"]`)
        dragareaobj.setListEle()
        dragareaobj.setListEvent()
    })

    document.querySelector('.reset-button input').addEventListener("click", e => {
        screen.innerHTML = ""
        // console.log(this.liele);
        list.querySelector('ul').innerHTML = ""
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

    if ((!e.offsetX || !e.offsetY) && !e.changedTouches) {
        return
    }
    console.dir(e.offsetX);
    console.dir(e.offsetY);
    const offsetX = e.offsetX || e.changedTouches[0].offsetX
    const offsetY = e.offsetY || e.changedTouches[0].offsetY

    // console.log(offsetX);

    // outputの一番右端の座標
    const outputX = offsetX + 10 + output.clientWidth < screen.clientWidth ? offsetX + 10 : offsetX - output.clientWidth - 10
    // outputの一番右下の座標
    const outputY = offsetY + 10 + output.clientHeight < screen.clientHeight ? offsetY + 10 : offsetY - output.clientHeight - 10
    
    // outputが画面外に行かないようにする
    output.style.transform = `translate(${outputX}px, ${outputY}px)`
    // output.style.left = offsetX + "px" // 挙動が鈍くなる
    // output.style.top = offsetY + "px"
    output.innerHTML = `X:${offsetX}, Y:${offsetY}`
    
    
    const dragareaobj = !Dragarea.drag ? Dragarea.dragList[Dragarea.count] : Dragarea.hoverEle
    if (Dragarea.click && !Dragarea.drag && dragareaobj) {
        const x = offsetX > dragareaobj.startPoint.x ? dragareaobj.startPoint.x : offsetX
        const width = offsetX > dragareaobj.startPoint.x ? offsetX - dragareaobj.startPoint.x : dragareaobj.startPoint.x - offsetX
        const y = offsetY > dragareaobj.startPoint.y ? dragareaobj.startPoint.y : offsetY
        const height = offsetY > dragareaobj.startPoint.y ? offsetY - dragareaobj.startPoint.y : dragareaobj.startPoint.y - offsetY
        // console.log('ドラッグ中');
        // console.log(percentW(width)+"%");
        // console.log(percentH(height)+"%");
        // console.log(x+":"+y);
        // dragareaobj.ele.style.transform = `translate(${x}px, ${y}px)` // 開始位置
        dragareaobj.ele.style.top = y + "px"
        dragareaobj.ele.style.left = x + "px"
        dragareaobj.ele.style.width = (width) + 'px'
        dragareaobj.ele.style.height = (height) + 'px'
        output.innerHTML = `X:${offsetX}, Y:${offsetY}, Width:${width}, Height:${height}`

    } else if(Dragarea.click && Dragarea.drag && dragareaobj){
        // console.log('ドラッグ中');

        const abx = offsetX - Dragarea.position.x // マウスが動いた差分計算
        const aby = offsetY - Dragarea.position.y
        Dragarea.position.x = offsetX // 差分比較位置更新
        Dragarea.position.y = offsetY
        dragareaobj.endPoint.x += abx // 差分反映 // いらない？
        dragareaobj.endPoint.y += aby
        
        // console.log(Dragarea.handledrag);
        if (Dragarea.handledrag) {
            // console.log('疑似要素');
            
            // const width = offsetX - dragareaobj.startPoint.x
            // const height = offsetY - dragareaobj.startPoint.y
            const width = parseInt(dragareaobj.ele.style.width.replace('px','')) + abx
            const height = parseInt(dragareaobj.ele.style.height.replace('px','')) + aby
            
            dragareaobj.ele.style.width = (width) + 'px'
            dragareaobj.ele.style.height = (height) + 'px'    
            output.innerHTML = `X:${offsetX}, Y:${offsetY}, Width:${width}, Height:${height}`
            dragareaobj.setListEle()
            
            return
        }
        const style = window.getComputedStyle(dragareaobj.ele);
        const matrix = new WebKitCSSMatrix(style.transform); // 実際のtranslateのXY値取得
        dragareaobj.startPoint.x = matrix.m41 + abx // 差分反映
        dragareaobj.startPoint.y = matrix.m42 + aby
        const x = dragareaobj.startPoint.x
        const y = dragareaobj.startPoint.y

        // dragareaobj.ele.style.transform = `translate(${x}px, ${y}px)` // 開始位置
        dragareaobj.ele.style.top = y + "px"
        dragareaobj.ele.style.left = x + "px"
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