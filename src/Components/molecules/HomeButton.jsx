import { LinkButton } from '../atoms/LinkButton'
import { HomeIcon } from '../atoms/HomeIcon'
import '../../styles/_btns.scss';

export const HomeButton = ({
  href = '/',
  title = 'Ir al inicio',
  className = '',
  ...props
}) => (
  <LinkButton
    href={href}
    title={title}
    className={`home-button ${className}`}
    {...props}
  >
    <HomeIcon className='home-icon' />
  </LinkButton>
)
