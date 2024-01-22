import { useState } from 'react';
import colors from "tailwindcss/colors"; // Import the Color type from tailwindcss/colors

const defaultColors = ['from-fuchsia-500 to-violet-500', 'from-cyan-400 to-blue-500', 'from-pink-400 to-rose-500', 'from-yellow-500 to-orange-500', 'from-lime-400 to-green-500', 'from-orange-400 to-red-600', 'from-gray-600 to-slate-800']

const ColorPiker = ({ setColors }: { setColors: (value: { from: string, to: string }) => void }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <>
      <button
        className="h-11 w-11 rounded-full bg-color-hue"
        onClick={() => setShowColorPicker(!showColorPicker)}
      />
      { showColorPicker && (
        <div className="absolute bg-white rounded-lg shadow right-20 top-14 ">
          <div className="flex">
            <div className="bg-color-hue h-28 w-28 rounded-full m-4" />
            <div>
              <div className="h-11 w-11 rounded-full bg-primary" />
              <div className="h-11 w-11 rounded-full bg-secondary" />
            </div>
          </div>
          <div>
            { defaultColors.map((color: string, index: number) => (
              <button
                key={index}
                className={`h-11 w-11 m-1 rounded-full bg-gradient-to-r ${color}`}
                onClick={() => setColors(normalizeToFromColors(color))} 
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ColorPiker;

const normalizeToFromColors = (color: string) => {
  const fromColor = color.split(' ')[0]?.replace('from-', '').split('-') ?? ['cyan', '400']
  const toColor = color.split(' ')[1]?.replace('to-', '').split('-') ?? ['blue', '500']

  const fromColorHex = (colors[fromColor[0]! as keyof typeof colors] as Record<string, string>)[fromColor[1]!]
  const toColorHex = (colors[toColor[0]! as keyof typeof colors] as Record<string, string>)[toColor[1]!]

  return { from: fromColorHex, to: toColorHex };
}
