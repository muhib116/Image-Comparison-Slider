function run_compare()
{
    pushStyle();

    let compare_containers = document.querySelectorAll('.image_compare');
    if(compare_containers)
    {
        compare_containers = Array.from(compare_containers);
        compare_containers.forEach(single_compare_container=>
        {
            let isMouseDown = false;
            let myCompareController = new CreateController();
            
            let type       = single_compare_container.dataset.type; //y||x||nothing
            let firstImage = single_compare_container.firstElementChild;
            let lastImage  = single_compare_container.lastElementChild;
            
            // stop image dragging
            firstImage.draggable = false;
            lastImage.draggable  = false;
            
            single_compare_container.append(myCompareController);
            
            // manage the drage using conditions start
            myCompareController.addEventListener('mousedown', ()=>{isMouseDown = true;});
            window.addEventListener('mouseup', ()=>{isMouseDown = false;});

            // for tuch device
            myCompareController.addEventListener('touchstart', ()=>{isMouseDown = true;});
            window.addEventListener('touchend', ()=>{isMouseDown = false;});
            // manage the drage using conditions end



            single_compare_container.addEventListener('mousemove', (e)=>{
                runCompare(e);
            });

            // for touch device
            single_compare_container.addEventListener('touchmove', (e)=>{
                var touch = e.changedTouches[0];
                runCompare(touch);
            });

            
            /* calculate mposition and run compare start */
            function runCompare(touch){
                let image_compareInfo = single_compare_container.getBoundingClientRect();
                
                if(isMouseDown)
                {
                    pos = {
                        x : (touch.clientX-image_compareInfo.x),
                        y : (touch.clientY-image_compareInfo.y)
                    };

                    manageController(myCompareController,pos.x,pos.y, single_compare_container, image_compareInfo, type, firstImage);
                }
            }
            /* calculate mposition and run compare end */

        });
    }

    function manageController(controller, x, y, compare_container, image_compareInfo, type, firstImage)
    {
        if(type !== 'y')
        {
            if(x>=0 && x<=compare_container.offsetWidth)
            {
                controller.style.cssText = `left: ${x}px`;
                firstImage.style.cssText = `clip-path: polygon(0 0, ${x}px 0%, ${x}px 100%, 0% 100%)`;
            }
        }else
        {
            if(y>=0 && y<=compare_container.offsetHeight)
            {
                controller.style.cssText = `top: ${y}px`;
                firstImage.style.cssText = `clip-path: polygon(0 0, 100% 0, 100% ${y}px, 0 ${y}px);`;
            }
        }
    }
}

function CreateController()
{
    let controller = document.createElement('span');
    controller.setAttribute('class', 'controller');
    return controller;
}

function pushStyle(){
    let style = document.createElement('style');
    style.innerHTML = `
        .image_compare {
            width: 100%;
            position: relative;
            user-select: none;
        }
        .image_compare > .controller {
            width: 40px;
            height: 40px;
            border: 4px solid #fff;
            position: absolute;
            z-index: 1;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            cursor: col-resize;
        }
        
        .image_compare[data-type="y"] > .controller {
            top: 50%;
            left: 50%;
            cursor: row-resize;
            transform: translate(-50%, -50%) rotate(90deg);
        }
        
        .image_compare > .controller::before,
        .image_compare > .controller::after {
            content: "";
            display: inline-block;
            position: absolute;
            border: 6px solid;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .image_compare > .controller::before {
            left: 22%;
            border-color: transparent #fff transparent transparent;
        }
        
        .image_compare > .controller::after {
            left: 79%;
            border-color: transparent transparent transparent #fff;
        }
        
        .image_compare > img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .image_compare > img:nth-child(1) {
            position: absolute;
            top: 0;
            top: left;
            clip-path: polygon(0 0, 50% 0%, 50% 100%, 0% 100%);
        }
        
        .image_compare[data-type="y"] > img:nth-child(1) {
            position: absolute;
            top: 0;
            top: left;
            clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        }      
    `;
    document.head.append(style);
}