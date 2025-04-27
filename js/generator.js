/**
 * 吉卜力风格AI转换器 - 主要功能脚本
 * 处理图片上传、预览、风格选择和转换功能
 */

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const uploadInput = document.getElementById('imageUpload');
    const uploadArea = document.querySelector('.upload-area');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const imagePreview = document.getElementById('imagePreview');
    const generateButton = document.querySelector('.btn-primary[type="submit"]');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const resultContainer = document.querySelector('.result-container');
    const styleOptions = document.querySelectorAll('.style-option');
    const selectedStyleInput = document.getElementById('selectedStyle');
    const errorMessage = document.querySelector('.upload-error');
    const formElement = document.getElementById('generateForm');
    
    // 标记是否有图片上传
    let hasImage = false;
    
    // 设置拖放区域事件
    setupDragAndDrop();
    
    // 设置图片上传事件
    if (uploadInput) {
        uploadInput.addEventListener('change', handleFileSelect);
    }
    
    // 设置风格选择事件
    styleOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有活动样式
            styleOptions.forEach(o => o.classList.remove('active'));
            // 添加活动样式到当前选择
            option.classList.add('active');
            // 更新隐藏输入值
            selectedStyleInput.value = option.getAttribute('data-style');
        });
    });
    
    // 设置表单提交事件
    if (formElement) {
        formElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 验证当前活动的标签页
            const activeTab = document.querySelector('.tab-pane.active');
            
            // 如果是图像转换标签页，验证是否上传了图片
            if (activeTab.id === 'imageTab' && !hasImage) {
                errorMessage.classList.remove('hidden');
                return;
            }
            
            // 隐藏错误消息
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }
            
            // 显示加载动画
            loadingSpinner.classList.remove('hidden');
            
            // 隐藏结果容器
            if (resultContainer) {
                resultContainer.classList.add('hidden');
            }
            
            // 模拟API处理延迟
            setTimeout(processImage, 3000);
        });
    }
    
    /**
     * 设置拖放区域事件
     */
    function setupDragAndDrop() {
        if (!uploadArea) return;
        
        // 阻止默认拖放行为
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults);
        });
        
        // 高亮拖放区域
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight);
        });
        
        // 取消高亮拖放区域
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight);
        });
        
        // 处理拖放
        uploadArea.addEventListener('drop', handleDrop);
        
        // 点击上传区域触发文件选择
        uploadArea.addEventListener('click', () => {
            uploadInput.click();
        });
    }
    
    /**
     * 阻止默认事件行为
     */
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    /**
     * 高亮拖放区域
     */
    function highlight() {
        uploadArea.classList.add('upload-area-active');
    }
    
    /**
     * 取消高亮拖放区域
     */
    function unhighlight() {
        uploadArea.classList.remove('upload-area-active');
    }
    
    /**
     * 处理文件拖放
     */
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            uploadInput.files = files;
            handleFileSelect();
        }
    }
    
    /**
     * 处理文件选择
     */
    function handleFileSelect() {
        if (!uploadInput.files.length) return;
        
        const file = uploadInput.files[0];
        
        // 验证文件类型
        if (!file.type.match('image.*')) {
            alert('请上传图片文件（JPG、PNG等格式）');
            return;
        }
        
        // 验证文件大小
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('文件大小不能超过5MB');
            return;
        }
        
        // 读取文件并显示预览
        const reader = new FileReader();
        
        reader.onload = function(e) {
            hasImage = true;
            
            // 隐藏上传占位符
            uploadPlaceholder.classList.add('hidden');
            
            // 显示预览图像
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            
            // 隐藏错误消息
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }
        };
        
        reader.readAsDataURL(file);
    }
    
    /**
     * 处理图像转换
     */
    function processImage() {
        // 获取表单数据
        const formData = new FormData(formElement);
        const activeTab = document.querySelector('.tab-pane.active');
        
        // 模拟API响应
        let resultImageSrc = '';
        
        // 根据不同的标签页获取不同的参数
        if (activeTab.id === 'textTab') {
            const promptText = formData.get('promptText');
            const negativePrompt = formData.get('negativePrompt') || '';
            const selectedStyle = formData.get('selectedStyle');
            const imageSize = formData.get('imageSize');
            
            console.log('文字生成图像参数:', {
                promptText,
                negativePrompt,
                selectedStyle,
                imageSize
            });
            
            // 在实际应用中，这里会调用API
            // 这里我们使用示例图像作为结果
            resultImageSrc = `../img/style-${selectedStyle}.jpg`;
        } else {
            const imageFile = formData.get('imageUpload');
            const imagePrompt = formData.get('imagePrompt') || '';
            const strength = formData.get('strength');
            const selectedStyle = formData.get('selectedStyle');
            const imageSize = formData.get('imageSize');
            
            console.log('图像风格转换参数:', {
                imagePrompt,
                strength,
                selectedStyle,
                imageSize
            });
            
            // 在实际应用中，这里会上传图像并调用API
            // 这里我们使用示例图像作为结果
            resultImageSrc = `../img/style-${selectedStyle}.jpg`;
        }
        
        // 隐藏加载动画
        loadingSpinner.classList.add('hidden');
        
        // 显示结果
        showResult(resultImageSrc);
    }
    
    /**
     * 显示转换结果
     */
    function showResult(imageSrc) {
        // 设置结果图像
        const resultImage = resultContainer.querySelector('img');
        resultImage.src = imageSrc;
        
        // 更新下载链接
        const downloadButton = resultContainer.querySelector('a[download]');
        downloadButton.href = imageSrc;
        
        // 显示结果容器
        resultContainer.classList.remove('hidden');
        
        // 滚动到结果区域
        resultContainer.scrollIntoView({ behavior: 'smooth' });
        
        // 设置分享按钮事件
        const shareButton = resultContainer.querySelector('.btn-default:nth-of-type(1)');
        if (shareButton) {
            shareButton.addEventListener('click', function() {
                // 实现分享功能（简化版）
                if (navigator.share) {
                    navigator.share({
                        title: '我的吉卜力风格作品',
                        text: '看看我用吉卜力AI生成器创作的作品！',
                        url: window.location.href
                    });
                } else {
                    alert('复制链接分享: ' + window.location.href);
                }
            });
        }
        
        // 设置重新生成按钮事件
        const regenerateButton = resultContainer.querySelector('.btn-default:nth-of-type(2)');
        if (regenerateButton) {
            regenerateButton.addEventListener('click', function() {
                // 隐藏结果容器
                resultContainer.classList.add('hidden');
                
                // 滚动到表单区域
                formElement.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
}); 