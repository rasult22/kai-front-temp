import { ReactNode } from "react"
import { motion } from "motion/react"

export default function AnimatingContainer({children, className = "", style = {}}: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  return <motion.div className={`${className}`} style={style}
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
  >
    {children}
  </motion.div>
}