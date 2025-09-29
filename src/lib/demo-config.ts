// デモモード設定
export const isDemoMode = (): boolean => {
  // URLパラメータでデモモードを有効化
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('demo') === 'true') {
      return true
    }
  }

  // 環境変数でデモモードを有効化
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return true
  }

  // localStorage でデモモードを有効化（開発用）
  if (typeof window !== 'undefined') {
    return localStorage.getItem('demoMode') === 'true'
  }

  return false
}

export const enableDemoMode = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('demoMode', 'true')
  }
}

export const disableDemoMode = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demoMode')
  }
}