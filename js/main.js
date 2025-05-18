window.__NUXT__ = {};
window.__NUXT__.config = {
	public: {
		clerkPublishableKey: "pk_live_Y2xlcmsuZ2hpYmxpbWFnaWNtYWtlci5jb20k",
		apiBase: "https://cartoon.ghiblimagicmaker.com",
		appid: "cy898950f382710878"
	},
	app: {
		baseURL: "/",
		buildId: "afa77975-bae5-4c05-a9bd-f4be9486eea2",
		buildAssetsDir: "/_nuxt/",
		cdnURL: ""
	}
}


window.dataLayer = window.dataLayer || [];

function gtag() {
	dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-54721JWMGZ');

document.addEventListener('DOMContentLoaded', function() {
	const uploadDiv = document.getElementById('uploadDiv');
	const uploadPreview = document.getElementById('upload-preview');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const clearBtn = document.getElementById('clear-btn');
    const previewContainer = document.getElementById('preview-container');
    const previewText = document.getElementById('previewText');
	
	let haveImg = false
    
	// 点击div触发文件选择
	uploadDiv.addEventListener('click', function() {
		if(!haveImg) {
			fileInput.click();
		}
	});
	
    // 显示选中的图片预览
    fileInput.addEventListener('change', async function() {
        uploadPreview.innerHTML = ''; // 清空预览区域
        
        if (this.files && this.files.length > 0) {
            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                if (file.type.match('image.*')) {
                    const reader = new FileReader();
                    
                    reader.onload = async function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'preview-image';
                        img.alt = '预览图片 ' + (i + 1);
                        uploadPreview.appendChild(img);
						file.src = img.src
                    }
					
					
                    reader.readAsDataURL(file);
					haveImg = true
                }
            }
        }
    });
	
	// 清空
	clearBtn.addEventListener('click', function() { 
		location.reload();
	});
    
    // 上传图片
    uploadBtn.addEventListener('click', async function() {
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('请先选择图片文件');
            return;
        }
		
		uploadBtn.disabled = true
		if (previewText.innerHTML === 'Preview Container') {
		    previewText.innerHTML = 'Loading...';
		} else {
		    previewText.innerHTML = 'Preview Container';
		}
        
        const formData = new FormData();
        
        // 添加所有选中的文件
        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('images', fileInput.files[i]);
        }
        // 上传图片		
        const imageToImageData = await getImageToImage(fileInput.files[0].src, 0);
		
		// previewContainer.innerHTML = ''; // 清空预览区域
		
		// let data = 'https://ai-result-rapidapi.ailabtools.com/image/generateCartoonizedImage/2025-05-18/212421-65c7304a-d9bf-7c6c-3891-148c2d735834-1747574661.jpg'
		// https://ai-result-rapidapi.ailabtools.com/image/generateCartoonizedImage/2025-05-18/214237-62c89628-5779-5069-5cec-b95fc3b29fa5-1747575757.jpg
		
		const img = document.createElement('img');
		img.src = imageToImageData.data;
		img.src = data;
		img.className = 'preview-image';
		img.alt = '预览图片';
		previewContainer.appendChild(img);
    });
});