/**
 * 吉卜力风格AI转换器 - 主要脚本
 * 处理导航、轮播和其他通用网站功能
 */

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏
    initializeNavigation();
    
    // 初始化滚动效果
    initializeScrollEffects();
    
    // 初始化按钮效果
    initializeButtonEffects();
    
    // 初始化Faq折叠效果
    initializeFaqAccordion();
});

/**
 * 初始化导航栏
 */
function initializeNavigation() {
    // 获取移动导航切换按钮
    const navToggle = document.querySelector('.navbar-toggle');
    const navbar = document.getElementById('navbar');
    
    // 添加导航切换事件
    if (navToggle && navbar) {
        navToggle.addEventListener('click', function() {
            if (navbar.classList.contains('in')) {
                navbar.classList.remove('in');
            } else {
                navbar.classList.add('in');
            }
        });
    }
    
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    
    // 设置导航项的激活状态
    const navLinks = document.querySelectorAll('.navbar-nav a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.endsWith(linkPath)) {
            link.parentElement.classList.add('active');
        } else if (currentPath.endsWith('/') && linkPath === 'index.html') {
            link.parentElement.classList.add('active');
        }
    });
}

/**
 * 初始化滚动效果
 */
function initializeScrollEffects() {
    // 获取所有需要平滑滚动的链接
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    // 添加平滑滚动事件
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 获取目标元素
            const targetId = this.getAttribute('href');
            
            // 排除空链接和页面切换链接
            if (targetId === '#' || targetId.includes('.html')) {
                return;
            }
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 平滑滚动到目标元素
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 滚动时显示/隐藏回到顶部按钮
    const topButton = document.querySelector('.back-to-top');
    if (topButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                topButton.classList.add('visible');
            } else {
                topButton.classList.remove('visible');
            }
        });
        
        // 点击回到顶部
        topButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 滚动时添加导航栏阴影
    const header = document.querySelector('.navbar-fixed-top');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/**
 * 初始化按钮效果
 */
function initializeButtonEffects() {
    // 获取所有按钮
    const buttons = document.querySelectorAll('.btn');
    
    // 添加波纹效果
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建波纹元素
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // 设置波纹位置
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // 添加到按钮内
            button.appendChild(ripple);
            
            // 动画结束后移除波纹元素
            ripple.addEventListener('animationend', function() {
                ripple.remove();
            });
        });
    });
}

/**
 * 初始化FAQ折叠效果
 */
function initializeFaqAccordion() {
    // 获取所有FAQ问题
    const faqQuestions = document.querySelectorAll('.faq-item h3');
    
    // 添加点击事件
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // 获取父元素
            const faqItem = this.parentElement;
            
            // 检查是否已激活
            const isActive = faqItem.classList.contains('active');
            
            // 关闭所有FAQ项
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // 如果未激活，则打开当前FAQ项
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

/**
 * 在页面加载后添加加载完成类
 */
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

/**
 * 初始化图片懒加载
 */
function initializeLazyLoading() {
    // 检查是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.lazy');
        
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(function(image) {
            imageObserver.observe(image);
        });
    } else {
        // 回退到传统的滚动监听方式
        let lazyLoadThrottleTimeout;
        
        function lazyLoad() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(function() {
                const scrollTop = window.pageYOffset;
                const lazyImages = document.querySelectorAll('.lazy');
                
                lazyImages.forEach(function(img) {
                    if (img.offsetTop < window.innerHeight + scrollTop) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationChange', lazyLoad);
                }
            }, 20);
        }
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
    }
}

$(document).ready(function() {
    
    // 平滑滚动效果
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 70
                }, 1000);
                return false;
            }
        }
    });

    // 导航栏滚动效果
    $(window).scroll(function() {
        if ($(window).scrollTop() > 100) {
            $('.navbar').addClass('navbar-shrink');
        } else {
            $('.navbar').removeClass('navbar-shrink');
        }
    });

    // 画廊图片效果
    $('.gallery-item').hover(
        function() {
            $(this).find('.overlay').css('height', '35%');
        },
        function() {
            $(this).find('.overlay').css('height', '0');
        }
    );

    // 轮播初始化
    if ($('#testimonial-carousel').length) {
        $('#testimonial-carousel').carousel({
            interval: 5000
        });
    }

    // 风格选择器
    if ($('.style-option').length) {
        $('.style-option').click(function() {
            $('.style-option').removeClass('active');
            $(this).addClass('active');
            $('#selectedStyle').val($(this).data('style'));
        });
    }

    // 图片上传预览
    if ($('#imageUpload').length) {
        $('#imageUpload').change(function() {
            readURL(this);
        });
    }

    // 拖放上传
    if ($('.upload-area').length) {
        $('.upload-area').on('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).addClass('upload-area-active');
        });
        
        $('.upload-area').on('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('upload-area-active');
        });
        
        $('.upload-area').on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('upload-area-active');
            
            if (e.originalEvent.dataTransfer.files.length) {
                var file = e.originalEvent.dataTransfer.files[0];
                var fileType = file.type;
                
                if (fileType.match('image.*')) {
                    $('#imageUpload')[0].files = e.originalEvent.dataTransfer.files;
                    readURL($('#imageUpload')[0]);
                } else {
                    alert('请上传图片文件（JPG, PNG）');
                }
            }
        });
    }

    // 生成按钮提交处理
    if ($('#generateForm').length) {
        $('#generateForm').submit(function(e) {
            e.preventDefault();
            
            // 表单验证
            if (!Formik.validateForm(this)) {
                return false;
            }
            
            // 显示加载状态
            $('.loading-spinner').removeClass('hidden');
            $('.result-container').addClass('hidden');
            
            // 模拟API调用生成图像
            // 在实际应用中，这里应该是一个AJAX请求到后端API
            setTimeout(function() {
                $('.loading-spinner').addClass('hidden');
                $('.result-container').removeClass('hidden');
                
                // 使用样例图像
                var selectedStyle = $('#selectedStyle').val();
                var resultImage = 'img/result-' + selectedStyle + '.jpg';
                
                $('.result-image img').attr('src', resultImage);
                $('.result-info').html('生成成功！风格：' + $('[data-style="' + selectedStyle + '"]').find('.style-name').text());
            }, 2000);
            
            return false;
        });
    }

    // 图片筛选功能
    if ($('.filter-buttons').length) {
        $('.filter-btn').click(function() {
            var filterValue = $(this).attr('data-filter');
            
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            
            if (filterValue == 'all') {
                $('.gallery-item').show();
            } else {
                $('.gallery-item').hide();
                $('.gallery-item[data-category="' + filterValue + '"]').show();
            }
        });
    }

    // 模拟加载更多
    if ($('#loadMoreBtn').length) {
        $('#loadMoreBtn').click(function() {
            $(this).html('<i class="fa fa-spinner fa-spin"></i> 加载中...');
            
            // 模拟加载延迟
            setTimeout(function() {
                // 在实际应用中，这里应该是AJAX请求加载更多图像
                $('#loadMoreBtn').html('加载更多');
                alert('已加载所有图像');
            }, 1500);
        });
    }

    // 常见问题折叠效果
    if ($('.faq-item').length) {
        $('.faq-item h3').click(function() {
            $(this).next('p').slideToggle();
            $(this).parent().toggleClass('active');
        });
    }

    // 初始化工具提示
    $('[data-toggle="tooltip"]').tooltip();

    // 图片上传预览函数
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function(e) {
                $('#imagePreview').attr('src', e.target.result);
                $('#imagePreview').removeClass('hidden');
                $('.upload-placeholder').addClass('hidden');
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }
});

// 模拟Formik对象 (实际应用中应使用完整的Formik库)
var Formik = {
    validateForm: function(form) {
        var isValid = true;
        
        // 验证必填字段
        $(form).find('[required]').each(function() {
            if (!$(this).val()) {
                $(this).addClass('error');
                $(this).next('.error-message').remove();
                $(this).after('<div class="error-message">此字段不能为空</div>');
                isValid = false;
            } else {
                $(this).removeClass('error');
                $(this).next('.error-message').remove();
            }
        });
        
        // 验证文本长度
        var textInput = $(form).find('#promptText');
        if (textInput.length && textInput.val().length < 10) {
            textInput.addClass('error');
            textInput.next('.error-message').remove();
            textInput.after('<div class="error-message">描述不能少于10个字符</div>');
            isValid = false;
        }
        
        // 验证图片上传
        if ($(form).find('#imageUpload').length && $(form).find('#imageTab').hasClass('active')) {
            if (!$(form).find('#imageUpload')[0].files.length) {
                $(form).find('.upload-area').addClass('error');
                $(form).find('.upload-error').removeClass('hidden');
                isValid = false;
            } else {
                $(form).find('.upload-area').removeClass('error');
                $(form).find('.upload-error').addClass('hidden');
            }
        }
        
        return isValid;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // 初始化图片上传功能
    initImageUpload();
    
    // 初始化风格选择
    initStyleSelector();
    
    // 初始化生成功能
    initGeneration();
});

// 图片上传功能
function initImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    
    // 点击上传区域触发文件选择
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
    }
    
    // 文件拖放功能
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('dragover');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('dragover');
            }, false);
        });
        
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length) {
                fileInput.files = files;
                updateImagePreview(files[0]);
            }
        }
    }
    
    // 文件选择处理
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                updateImagePreview(this.files[0]);
            }
        });
    }
    
    // 更新预览图片
    function updateImagePreview(file) {
        // 检查文件类型
        if (!file.type.match('image.*')) {
            alert('请上传图片文件！');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            
            if (uploadPlaceholder) {
                uploadPlaceholder.style.display = 'none';
            }
            
            // 显示生成按钮
            const generateBtn = document.getElementById('generateButton');
            if (generateBtn) {
                generateBtn.disabled = false;
            }
        }
        
        reader.readAsDataURL(file);
    }
    
    // 示例图片点击
    const sampleImages = document.querySelectorAll('.sample-img');
    if (sampleImages.length) {
        sampleImages.forEach(img => {
            img.addEventListener('click', function() {
                // 从示例图片加载图片到预览区
                imagePreview.src = this.src;
                imagePreview.style.display = 'block';
                
                if (uploadPlaceholder) {
                    uploadPlaceholder.style.display = 'none';
                }
                
                // 显示生成按钮
                const generateBtn = document.getElementById('generateButton');
                if (generateBtn) {
                    generateBtn.disabled = false;
                }
            });
        });
    }
}

// 风格选择功能
function initStyleSelector() {
    const styleOptions = document.querySelectorAll('.style-option');
    
    if (styleOptions.length) {
        styleOptions.forEach(option => {
            option.addEventListener('click', function() {
                // 移除所有选项的active类
                styleOptions.forEach(opt => opt.classList.remove('active'));
                
                // 添加active类到当前选项
                this.classList.add('active');
                
                // 更新隐藏的风格输入值
                const styleInput = document.getElementById('styleInput');
                if (styleInput) {
                    styleInput.value = this.dataset.style;
                }
            });
        });
        
        // 默认选中第一个风格
        styleOptions[0].click();
    }
}

// 生成功能初始化
function initGeneration() {
    const generateForm = document.getElementById('generateForm');
    const generateButton = document.getElementById('generateButton');
    const resultContainer = document.getElementById('resultContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const afterImage = document.getElementById('afterImage');
    const beforeImage = document.getElementById('beforeImage');
    const downloadButton = document.getElementById('downloadButton');
    
    if (generateForm) {
        generateForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 检查是否有图片
            const imagePreview = document.getElementById('imagePreview');
            if (!imagePreview || !imagePreview.src || imagePreview.src === '') {
                alert('请先上传或选择一张图片！');
                return;
            }
            
            // 显示加载状态
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
            }
            if (resultContainer) {
                resultContainer.style.display = 'none';
            }
            if (generateButton) {
                generateButton.disabled = true;
            }
            
            // 获取选择的风格
            const styleInput = document.getElementById('styleInput');
            const selectedStyle = styleInput ? styleInput.value : 'default';
            
            // 获取转换强度
            const intensitySlider = document.getElementById('intensitySlider');
            const intensity = intensitySlider ? intensitySlider.value : 50;
            
            // 模拟API调用和图片处理
            try {
                // 这里是模拟API调用，实际项目中应替换为真实API调用
                await simulateApiCall(imagePreview.src, selectedStyle, intensity);
                
                // 更新结果展示
                if (beforeImage) {
                    beforeImage.src = imagePreview.src;
                }
                
                // 模拟生成的图片 (实际项目应从API返回中获取)
                if (afterImage) {
                    // 这里仅作演示，实际应使用API返回的图片
                    // 由于是模拟，我们只能使用原图，实际应用会从后端获取处理后的图片
                    afterImage.src = imagePreview.src;
                }
                
                // 显示结果容器
                if (resultContainer) {
                    resultContainer.style.display = 'block';
                }
                
                // 启用下载按钮
                if (downloadButton) {
                    downloadButton.disabled = false;
                }
            } catch (error) {
                console.error('生成失败:', error);
                alert('图片生成失败，请重试！');
            } finally {
                // 隐藏加载状态
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
                if (generateButton) {
                    generateButton.disabled = false;
                }
            }
        });
    }
    
    // 下载按钮功能
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            const afterImage = document.getElementById('afterImage');
            if (!afterImage || !afterImage.src) {
                alert('没有可下载的图片！');
                return;
            }
            
            // 创建下载链接
            const downloadLink = document.createElement('a');
            downloadLink.href = afterImage.src;
            downloadLink.download = '吉卜力风格图片.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }
}

// 模拟API调用
async function simulateApiCall(imageData, style, intensity) {
    // 在实际应用中，这里应该是一个真实的API调用
    // 这里我们仅做延时模拟
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`处理图片: 风格=${style}, 强度=${intensity}`);
            resolve({
                success: true,
                message: '图片生成成功'
            });
        }, 2000); // 模拟2秒的处理时间
    });
} 