import { Alert } from "react-bootstrap"

const Message = ({variant, children}) => {
  return (
    <Alert variant={variant} className="mt-5 pt-4">
        {children}
    </Alert>
  )
}

Message.defaultProps = {
    variant: 'info',
}
export default Message