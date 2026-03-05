import { motion } from 'framer-motion'
import { useState } from 'react'
import RegisterFinally, { type FirstStepData } from './RegisterFinally'
import ValidatedCodeRegister from './ValidedCodeRegister'

interface PermissionCodeProps {
  setShowConfirmPass: React.Dispatch<React.SetStateAction<boolean>>
  firstStepData: {}
  sexo: string
}

export const AnalysisRegister = ({
  firstStepData,
  setShowConfirmPass,
  sexo,
}: PermissionCodeProps) => {
  const [analysisSituation, setAnalysisSituation] = useState(false)

  return analysisSituation ? (
    <motion.div
      key="registerFinally"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <RegisterFinally
        sexo={sexo}
        firstStepData={firstStepData as FirstStepData}
      />
    </motion.div>
  ) : (
    <motion.div
      key="register"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <ValidatedCodeRegister
        setShowConfirmPass={setShowConfirmPass}
        setAnalysisSituation={setAnalysisSituation}
      />
    </motion.div>
  )
}
