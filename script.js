document.addEventListener('DOMContentLoaded', function() {
    const magicImage = document.getElementById('magicImage');
    let currentScale = 1;
    const scaleIncrement = 0.5; // 每次点击放大的倍数
    let isDragging = false;
    let startX, startY;
    let currentX = 0;
    let currentY = 0;

    // 点击图片放大
    magicImage.addEventListener('click', function(e) {
        if (!isDragging) {
            currentScale += scaleIncrement;
            this.style.position = 'fixed';
            this.style.zIndex = '1000';
            
            // 计算中心点位置
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // 如果是第一次放大，设置初始位置
            if (currentScale === (1 + scaleIncrement)) {
                currentX = centerX - (this.offsetWidth / 2);
                currentY = centerY - (this.offsetHeight / 2);
            }
            
            this.style.left = currentX + 'px';
            this.style.top = currentY + 'px';
            this.style.transform = `scale(${currentScale})`;
        }
    });

    // 处理拖动开始
    magicImage.addEventListener('mousedown', function(e) {
        if (currentScale > 1) {  // 只有放大后才能拖动
            isDragging = true;
            startX = e.clientX - currentX;
            startY = e.clientY - currentY;
            
            // 添加拖动和释放事件监听
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
        }
    });

    // 处理触摸设备
    magicImage.addEventListener('touchstart', function(e) {
        if (currentScale > 1) {
            isDragging = true;
            startX = e.touches[0].clientX - currentX;
            startY = e.touches[0].clientY - currentY;
            
            // 添加触摸移动和结束事件监听
            document.addEventListener('touchmove', onTouchDrag);
            document.addEventListener('touchend', stopDrag);
        }
    });

    function onDrag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - startX;
            currentY = e.clientY - startY;
            updateImagePosition();
            checkBoundaries();
        }
    }

    function onTouchDrag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.touches[0].clientX - startX;
            currentY = e.touches[0].clientY - startY;
            updateImagePosition();
            checkBoundaries();
        }
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', onTouchDrag);
        document.removeEventListener('touchend', stopDrag);
    }

    function updateImagePosition() {
        magicImage.style.left = currentX + 'px';
        magicImage.style.top = currentY + 'px';
    }

    function checkBoundaries() {
        const threshold = 50; // 距离边缘多少像素时消失
        const rect = magicImage.getBoundingClientRect();
        
        if (rect.left < -threshold || 
            rect.right > window.innerWidth + threshold || 
            rect.top < -threshold || 
            rect.bottom > window.innerHeight + threshold) {
            
            // 添加淡出动画
            magicImage.style.transition = 'opacity 0.3s ease';
            magicImage.style.opacity = '0';
            
            // 动画结束后移除元素
            setTimeout(() => {
                magicImage.remove();
            }, 300);
        }
    }
}); 