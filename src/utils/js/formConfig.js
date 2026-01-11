import options from '../json/options.json'

export const getFormOptions = (selectedArea) => {
  return {
    areas: options.areas || [],
    positions: options.positions[selectedArea] || [],
    hats: options.hats || [],
    countries: options.countries || []
  }
}