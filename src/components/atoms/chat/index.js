
import styles from './chat.module.css'
const Chat = ({children,className}) => {
  return (
    <div className={className}>{children}</div>
  )
}

export default Chat