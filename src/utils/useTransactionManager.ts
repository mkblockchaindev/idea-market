import { useState } from 'react'

import TransactionManager from './TransactionManager'

export default function useTransactionManager() {
  return new TransactionManager(useState(''), useState(false), useState(''))
}
