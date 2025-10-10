import { useContext } from 'react'
import AuthContext from './authContextOnly'

export default function useAuth() {
  return useContext(AuthContext)
}
