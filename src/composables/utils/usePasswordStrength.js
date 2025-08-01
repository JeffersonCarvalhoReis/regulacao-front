export function usePasswordStrength (passwordRef) {

  const checkPasswordStrength = password => {
    let score = 0;

    if (!password) return 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (password.length >= 12) score++

    return score
  }

  const score = computed(() => checkPasswordStrength(passwordRef.value))

  // Dynamic text
  const textPasswordStrength = computed(() => {
    if (score.value <= 2) return 'Fraca'
    if (score.value <= 4) return 'Média'
    return 'Forte'
  });

  // Text color
  const colorPasswordStrength = computed(() => {
    if (score.value <= 2) return 'text-red-600'
    if (score.value <= 4) return 'text-yellow-600'
    return 'text-green-600'
  });

  // Strength bar color
  const colorPasswordBar = computed(() => {
    if (score.value <= 2) return 'bg-red-500 w-1/3'
    if (score.value <= 4) return 'bg-yellow-500 w-2/3'
    return 'bg-green-600 w-full'
  });

  return {
    score,
    textPasswordStrength,
    colorPasswordStrength,
    colorPasswordBar,
  }
}
