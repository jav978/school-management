export const useFeedback = () => {
  const isModalOpen = useState<boolean>('feedback_modal_open', () => false)
  const defaultModule = useState<string>('feedback_default_module', () => 'general')

  const openFeedback = (moduleTag: string = 'general') => {
    defaultModule.value = moduleTag
    isModalOpen.value = true
  }

  const closeFeedback = () => {
    isModalOpen.value = false
  }

  return {
    isModalOpen,
    defaultModule,
    openFeedback,
    closeFeedback
  }
}
