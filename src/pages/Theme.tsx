import { useParams } from 'react-router-dom'


export default function Theme() {
  const { theme } = useParams()

  return (
    <>{theme}</>
  )
}