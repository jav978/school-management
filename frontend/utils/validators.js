export const validators = {
  email(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value) || 'Correo electrónico inválido'
  },
  
  required(value) {
    return !!value || 'Este campo es requerido'
  },
  
  minLength(min) {
    return (value) => value.length >= min || `Mínimo ${min} caracteres`
  },
  
  maxLength(max) {
    return (value) => value.length <= max || `Máximo ${max} caracteres`
  },
  
  min(min) {
    return (value) => value >= min || `Valor mínimo: ${min}`
  },
  
  max(max) {
    return (value) => value <= max || `Valor máximo: ${max}`
  },
  
  phone(value) {
    const regex = /^[\+]?[0-9\s\-\(\)]{8,}$/
    return regex.test(value) || 'Número de teléfono inválido'
  },
  
  date(value) {
    return !isNaN(Date.parse(value)) || 'Fecha inválida'
  }
}

export const validateForm = (fields, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field]
    const value = fields[field]
    
    for (const rule of fieldRules) {
      const result = rule(value)
      if (result !== true) {
        errors[field] = result
        break
      }
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
