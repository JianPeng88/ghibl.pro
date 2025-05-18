/**
 * YouTube视频下载工具API服务
 * 用于前端与后端API通信
 */

const API_BASE_URL = 'https://xyz86.top/aitool/api';

/**
 * 上传imagetoimage
 * @param {string} url
 * @returns {Promise<Object>} - 解析结果
 */
async function getImageToImage(url, index) {
	try {
		const response = await fetch(`${API_BASE_URL}/aiassist/aitool/imagetoimage?index=`+index, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},

			body: JSON.stringify(url)
		});

		return await response.json();
	} catch (error) {
		console.error('上传失败:', error);
		return {
			success: false,
			message: `上传失败: ${error.message}`
		};
	}
};