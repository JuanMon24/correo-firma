
export const LinkButton = ({
  href,
  children,
  className = '',
  ...props
}) => {

  return (
    <a
      href={href}
      className={className}
      {...props}
    >
      {children}
    </a>
  )
}
