export const getRGBColor = (hex: string, type: string) => {
  const color = hex.replace(/#/g, "")
  // rgb values
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)

  return `--color-${type}: rgb(${r}, ${g}, ${b});`
}

export const getAccessibleColor = (hex: string) => {
  const color = hex.replace(/#/g, "")
  // rgb values
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "#000000" : "#FFFFFF"
}
