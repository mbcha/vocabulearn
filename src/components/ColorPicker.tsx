import { useState } from 'react';
import colors from "tailwindcss/colors";

const predefinedThemes = ['from-fuchsia-500 to-violet-500', 'from-cyan-400 to-blue-500', 'from-pink-400 to-rose-500', 'from-yellow-500 to-orange-500', 'from-lime-400 to-green-500', 'from-orange-400 to-red-600', 'from-gray-600 to-slate-800']

const ColorPiker = ({ setColors }: { setColors: (value: { from?: string, to?: string }) => void }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickingPrimaryColor, setPickingPrimaryColor] = useState(true);

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const selectedColor = calculateSelectedColor(event)

    if (selectedColor) {
      setColors(pickingPrimaryColor ? { from: selectedColor } : { to: selectedColor })
      setPickingPrimaryColor(!pickingPrimaryColor)
    }
  }

  return (
    <>
      <button
        className="h-11 w-11 rounded-md bg-palette"
        onClick={() => setShowColorPicker(!showColorPicker)}
      />
      { showColorPicker && (
        <div className="absolute bg-white rounded-lg shadow right-0 top-14 p-2">
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col items-center">
              <div className="bg-palette h-11 w-56 rounded-md cursor-crosshair mb-2" onClick={(e) => handleOnClick(e)}/>
              <div className="bg-palette-2 h-11 w-56 rounded-md cursor-crosshair" onClick={(e) => handleOnClick(e)} />
            </div>
            <div className="flex flex-col items-center justify-center flex-grow ml-2" >
              <div className={`h-6 w-6 mb-4 cursor-pointer rounded-md bg-primary ${pickingPrimaryColor ? 'shadow-md' : ''} shadow-slate-700`} onClick={() => setPickingPrimaryColor(true)} />
              <div className={`h-6 w-6 cursor-pointer rounded-md bg-secondary ${!pickingPrimaryColor ? 'shadow-md' : ''} shadow-slate-700`} onClick={() => setPickingPrimaryColor(false)} />
            </div>
          </div>
          <div className="flex justify-center">
            { predefinedThemes.map((color: string, index: number) => (
              <button
                key={index}
                className={`h-8 w-8 rounded-md bg-gradient-to-r ${color} ${index !== 0 && 'ml-2'}`}
                onClick={() => setColors(tailwindColorToHex(color))} 
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ColorPiker;

const tailwindColorToHex = (color: string) => {
  const fromColor = color.split(' ')[0]?.replace('from-', '').split('-') ?? ['cyan', '400']
  const toColor = color.split(' ')[1]?.replace('to-', '').split('-') ?? ['blue', '500']

  const fromColorHex = (colors[fromColor[0]! as keyof typeof colors] as Record<string, string>)[fromColor[1]!]
  const toColorHex = (colors[toColor[0]! as keyof typeof colors] as Record<string, string>)[toColor[1]!]

  return { from: fromColorHex, to: toColorHex };
}

const calculateSelectedColor = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const element = event.target as HTMLElement;
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percentage = (x / rect.width) * 100;

  const gradientColors = getComputedStyle(element).backgroundImage.match(/(\d+), (\d+), (\d+)/g);
  return interpolateColor(gradientColors, percentage / 100);
}

function interpolateColor(colors: RegExpMatchArray | null, position: number) {
  if (!colors?.length) return;

  const index = Math.floor(position * (colors.length - 1));
  const lowerColor = colors[index]!.split(', ').map((color) => Number(color));
  const upperColor = colors[index + 1]!.split(', ').map((color) => Number(color));

  const lowerRGB = arrayToRgb(lowerColor)
  const upperRGB = arrayToRgb(upperColor)

  const ratio = position * (colors.length - 1) - index;
  const interpolatedColor = {
    r: lowerRGB.r + (upperRGB.r - lowerRGB.r) * ratio,
    g: lowerRGB.g + (upperRGB.g - lowerRGB.g) * ratio,
    b: lowerRGB.b + (upperRGB.b - lowerRGB.b) * ratio,
  };

  return rgbToHex(interpolatedColor.r, interpolatedColor.g, interpolatedColor.b);
}

const arrayToRgb = (array: number[]) => {
  return { r: array[0]!, g: array[1]!, b: array[2]! };
}

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
