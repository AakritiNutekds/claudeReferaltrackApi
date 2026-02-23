import sharp from 'sharp'
import fs from 'fs';

export class compressImageService {
    private readonly minimumSizeInBytes: number = 4 * 1024; // Minimum size required (4KB)

    constructor() {}
    

    processImage(inputImagePath: string, outputImagePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let jpegQuality = 80; // Initial quality
            let width = 480; // Initial width
            let height = 640; // Initial height

            const compressImage = () => {
                sharp(inputImagePath)
                    .resize(width, height)
                    .jpeg({ quality: jpegQuality, force: false })
                    .toBuffer()
                    .then(compressedBuffer => {
                        if (compressedBuffer.length < this.minimumSizeInBytes && jpegQuality > 1) {
                            // If the size is below the minimum and quality isn't minimum, reduce quality
                            jpegQuality -= 5; // Reduce quality
                            if (jpegQuality < 1) {
                                jpegQuality = 1; // Ensure quality doesn't fall below 1
                            }
                            compressImage(); // Retry compression
                        } else if (compressedBuffer.length < this.minimumSizeInBytes) {
                            // If quality is at minimum and size still below the minimum, increase dimensions
                            width *= 2; // Double width
                            height *= 2; // Double height
                            compressImage(); // Retry compression
                        } else if (compressedBuffer.length >= this.minimumSizeInBytes) {
                            fs.writeFileSync(outputImagePath, compressedBuffer); // Save the resulting image
                            resolve(`JPEG size: ${compressedBuffer.length} bytes`);
                        } else {
                            reject('Image size could not meet the required minimum even after adjustments.');
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            };

            compressImage(); // Start the compression process
        });
    }
}