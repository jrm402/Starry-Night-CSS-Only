const Jimp = require('jimp');
const fs = require('fs/promises');

const IMG_PIXEL_SIZE = 5;

const OUTPUT_PIXEL_SIZE = 2;
const OUTPUT_BLUR_RADIUS = 2;
const OUTPUT_SPREAD_RADIUS = 2;

const OUTPUT_FILE_NAME = 'starry-night.html';

Jimp.read('Starry-Night.png')
	.then(async (img) => {
		let shadowStr = `
<!DOCTYPE html>
<html>
	<head>
		<title>Starry Night!</title>
		<style>
			h1 {
				font-family: Arial;
				text-align: center;
				margin-bottom: 4rem;
			}
			#starry-night {
				width: 0;
				height: 0;
				margin-left: calc(50% - 277px);
				box-shadow:
					`;

		const imgWidth = img.bitmap.width;
		const imgHeight = img.bitmap.height;

		let curY = 0;
		for (let y = 0; y < imgHeight; y += IMG_PIXEL_SIZE) {
			let curX = 0;
			for (let x = 0; x < imgWidth; x += IMG_PIXEL_SIZE) {
				const curColor = Jimp.intToRGBA(img.getPixelColor(x, y));
				const hexColor = rgbToHex(curColor);

				shadowStr += `${curX}px ${curY}px ${OUTPUT_BLUR_RADIUS}px ${OUTPUT_SPREAD_RADIUS}px ${hexColor}, `;

				curX += OUTPUT_PIXEL_SIZE;
			}

			if (y + IMG_PIXEL_SIZE < imgHeight) {
				shadowStr += '\r\n\t\t\t\t\t';
				curY += OUTPUT_PIXEL_SIZE;
			} else {
				shadowStr = shadowStr.replace(/, $/, ';');
				shadowStr = shadowStr.replace(/^\n/, '');
			}
		}

		shadowStr += `
			}
		</style>
	</head>
	<body>
		<h1>A very starry night</h1>
		<div id="starry-night"></div>
	</body>
</html>`;

		shadowStr = shadowStr.replace(/,\r\n$/, ';');

		await fs.rm(OUTPUT_FILE_NAME, {
			force: true,
		});

		await fs.appendFile(OUTPUT_FILE_NAME, shadowStr);
	})
	.catch((err) => {
		console.log('An error has occurred.', err);
	});

const rgbToHex = (rgb) => {
	return (
		'#' +
		componentToHex(rgb.r) +
		componentToHex(rgb.g) +
		componentToHex(rgb.b)
	);
};

const componentToHex = (c) => {
	const hex = c.toString(16);
	return hex.length === 1 ? '0' + hex : hex;
};
