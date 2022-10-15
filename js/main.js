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

const getScreenRect = () => {
    // 要素の位置座標を取得
    const screenClientRect = screen.getBoundingClientRect() ;

    // 画面の左端から、要素の左端までの距離
    const rectX = screenClientRect.left ;

    // 画面の上端から、要素の上端までの距離
    const rectY = screenClientRect.top ;

    return {x: rectX, y: rectY}
}

export { Ev, output, screen, list }

window.addEventListener('DOMContentLoaded', e => {

    screen.addEventListener(Ev.move, pointerMove, {passive: false})
    list.addEventListener(Ev.move, e => {
        output.classList.add('hidden')
    }, {passive: false})
    // output.addEventListener(Ev.move, e => {
    //     console.log(e);
    //     // e.preventDefault()
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

        const rectX = getScreenRect().x
        const rectY = getScreenRect().y

        console.log('クリック開始');
        if(Dragarea.click) return
        if (Dragarea.hover) {
            Dragarea.click = true
            Dragarea.drag = true
            Dragarea.position.x = (e.pageX || e.changedTouches[0].pageX) - rectX
            Dragarea.position.y = (e.pageY || e.changedTouches[0].pageY) - rectY
            Dragarea.hoverEle.ele.classList.add('current')
            // console.log(Dragarea.hoverEle);

            return
        }

        const dragareaobj = new Dragarea()

        Dragarea.click = true
        dragareaobj.startPoint.x = (e.pageX || e.changedTouches[0].pageX) - rectX
        dragareaobj.startPoint.y = (e.pageY || e.changedTouches[0].pageY) - rectY
        // console.log(e.pageX);
        // console.log(e.pageY);
        // ここで要素生成・DOMにマウント
        const ele = document.createElement('div')
            const handleEle = document.createElement('div')
            handleEle.className = 'dragarea-handle'
            handleEle.innerHTML = dragareaobj.id
            ele.appendChild(handleEle)
        ele.className='dragarea'
        screen.appendChild(ele)
        dragareaobj.ele = ele
        // dragareaobj.ele.addEventListener(Ev.move, e => {
        //     // e.preventDefault();
        //     e.stopPropagation()
        // })
        // dragareaobj.handleEle = handleEle
        // dragareaobj.handleEle.addEventListener(Ev.move, e => {
        //     // e.preventDefault();
        //     e.stopPropagation()
        // })

        Dragarea.dragList[Dragarea.count] = dragareaobj
        // console.log(Dragarea.dragList[Dragarea.count]);
        
    })
    screen.addEventListener(Ev.up, e => {
        const rectX = getScreenRect().x
        const rectY = getScreenRect().y
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
        
        dragareaobj.endPoint.x = (e.pageX || e.changedTouches[0].pageX - dragareaobj.startPoint.x) - rectX
        dragareaobj.endPoint.y = (e.pageY || e.changedTouches[0].pageY - dragareaobj.startPoint.y) - rectY
        if (!dragareaobj.ele.style.width) {
            dragareaobj.ele.style.width = '0px'
        }
        if (!dragareaobj.ele.style.height) {
            dragareaobj.ele.style.height = '0px'
        }
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
    console.log(e.target);

    output.classList.remove('hidden')

    if ((!e.pageX || !e.pageY) && !e.changedTouches) {
        return
    }

    // 画面の左端から、要素の左端までの距離
    const rectX = getScreenRect().x ;

    // 画面の上端から、要素の上端までの距離
    const rectY = getScreenRect().y ;

    console.log(e.pageX - rectX);
    console.dir(e.pageY - rectY);
    // console.dir(e.pageX);
    // console.dir(e.pageY);
    const pageX = e.pageX || e.changedTouches[0].pageX
    const pageY = e.pageY || e.changedTouches[0].pageY

    // console.log(pageX);

    // outputの一番右端の座標
    const outputX = (pageX + 10 + output.clientWidth < screen.clientWidth ? pageX + 10 : pageX - output.clientWidth - 10) - rectX
    // outputの一番右下の座標
    const outputY = (pageY + 10 + output.clientHeight < screen.clientHeight ? pageY + 10 : pageY - output.clientHeight - 10) - rectY
    
    // outputが画面外に行かないようにする
    output.style.transform = `translate(${outputX}px, ${outputY}px)`
    // output.style.left = pageX + "px" // 挙動が鈍くなる
    // output.style.top = pageY + "px"
    output.innerHTML = `X:${pageX}, Y:${pageY}`
    
    
    const dragareaobj = !Dragarea.drag ? Dragarea.dragList[Dragarea.count] : Dragarea.hoverEle
    if (Dragarea.click && !Dragarea.drag && dragareaobj) {
        const x = (pageX > dragareaobj.startPoint.x ? dragareaobj.startPoint.x : pageX) - rectX
        const width = (pageX > dragareaobj.startPoint.x ? pageX - dragareaobj.startPoint.x : dragareaobj.startPoint.x - pageX)
        const y = (pageY > dragareaobj.startPoint.y ? dragareaobj.startPoint.y : pageY) - rectY
        const height = (pageY > dragareaobj.startPoint.y ? pageY - dragareaobj.startPoint.y : dragareaobj.startPoint.y - pageY)
        // console.log('ドラッグ中');
        // console.log(percentW(width)+"%");
        // console.log(percentH(height)+"%");
        // console.log(x+":"+y);
        // dragareaobj.ele.style.transform = `translate(${x}px, ${y}px)` // 開始位置
        dragareaobj.ele.style.top = y + "px"
        dragareaobj.ele.style.left = x + "px"
        dragareaobj.ele.style.width = (width) + 'px'
        dragareaobj.ele.style.height = (height) + 'px'
        output.innerHTML = `X:${pageX}, Y:${pageY}, Width:${width}, Height:${height}`

    } else if(Dragarea.click && Dragarea.drag && dragareaobj){
        // console.log('ドラッグ中');

        const abx = pageX - Dragarea.position.x // マウスが動いた差分計算
        const aby = pageY - Dragarea.position.y
        Dragarea.position.x = pageX // 差分比較位置更新
        Dragarea.position.y = pageY
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
        const style = window.getComputedStyle(dragareaobj.ele);
        const matrix = new WebKitCSSMatrix(style.transform); // 実際のtranslateのXY値取得
        dragareaobj.startPoint.x = matrix.m41 + abx // 差分反映
        dragareaobj.startPoint.y = matrix.m42 + aby
        const x = dragareaobj.startPoint.x
        const y = dragareaobj.startPoint.y

        dragareaobj.ele.style.transform = `translate(${x}px, ${y}px)` // 開始位置
        // dragareaobj.ele.style.top = y + "px"
        // dragareaobj.ele.style.left = x + "px"
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