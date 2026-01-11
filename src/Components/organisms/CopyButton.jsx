import Button from '../atoms/Button'
import useClipboard from '../atoms/useClipboard'

const CopyButton = ({ infoRef }) => {
  const { isCopied, copyToClipboard } = useClipboard()

  const handleCopy = () => {
    if (infoRef && infoRef.current) {
      copyToClipboard(infoRef.current.innerHTML)
    }
  }

  return (
    <Button className='bg-purple txt-white d-flex btn--copiar br-15 g-5' onClick={handleCopy} disabled={isCopied}>
      <i className='fa-solid fa-copy'/> {isCopied ? 'Copiado!' : 'Copiar'}
    </Button>
  )
}

export default CopyButton