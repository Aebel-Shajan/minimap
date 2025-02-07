import html2canvas from "html2canvas";
import { Options } from "html2canvas";
/**
 * Returns image of element passed in.
 *
 * @param elementToRender - The element to render as a minimap containing chat messages.
 * @returns A Promise that resolves to void.
 */
export default async function generateMinimapCanvas(
  elementToRender: HTMLElement,
  renderOptions: Partial<Options> = {}
): Promise<HTMLCanvasElement> {
  const options: Partial<Options>= {
    ...renderOptions,
    scrollX: 0,
    scrollY: 0,
    scale: 0.2,
    onclone: removeAllImages,
    
  }
  return html2canvas(elementToRender, options);
}

function removeAllImages(documentClone: Document) {
  documentClone.querySelectorAll("img").forEach(img => {
    const width = img.width;
    const height = img.height;
    
    // Replace the image with a grey placeholder div
    const greyBox = documentClone.createElement("div");
    greyBox.style.width = `${width}px`;
    greyBox.style.height = `${height}px`;
    greyBox.style.background = "white";
    greyBox.style.display = "inline-block"; // Ensure it doesn't collapse
    greyBox.style.border = "1rem solid red"; // Add red border
    greyBox.style.borderRadius = "10px"; // Add curved corners
    
    img.replaceWith(greyBox);
  })
}