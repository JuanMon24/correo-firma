export function formatPhoneNumber(phoneNumber) {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')

  // Suponemos que los últimos 10 dígitos son el número de teléfono
  const numberLength = 10
  const countryCode = cleaned.substring(0, cleaned.length - numberLength)
  const localNumber = cleaned.substring(cleaned.length - numberLength)

  const match = localNumber.match(/^(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return `+${countryCode} (${match[1]}) ${match[2]} ${match[3]}`
  }
  return null
}