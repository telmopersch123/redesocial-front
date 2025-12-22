import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AnalysisRegister } from '../components/componentsPages/componentAuthentication/AnalysisRegister'
import ForgotPassword from '../components/componentsPages/componentAuthentication/forgotPassword'
import LoginComponent from '../components/componentsPages/componentAuthentication/LoginComponent'
import RegisterComponent from '../components/componentsPages/componentAuthentication/RegisterComponent'
import ResetPasswordComponent from '../components/componentsPages/componentAuthentication/updatePassword'
import { useResetPassword } from '../context/ResetPasswordContext'
import { alertMessage } from '../utils/components/alertMensage'
import LoadingOverlay from '../utils/components/Loading'

const AuthenticadorPage = () => {
  const [permissionCode, setPermissionCode] = useState<boolean>(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [firstStepData, setFirstStepData] = useState({})
  const { messageConfirm, setMessageConfirm, isLoading } = useResetPassword()

  useEffect(() => {
    if (messageConfirm) {
      alertMessage(
        'Concluido!',
        'Sua senha foi alterada com sucesso',
        'success'
      )
      setMessageConfirm(false)
    }
  }, [messageConfirm])

  return (
    <div
      className={`scrollbar-invisible flex min-h-screen w-[calc(100vw-10px)] flex-col overflow-hidden bg-[linear-gradient(to_right,#f5f3ff,#fdf2f8,#eef2ff,#ffffff)]`}
    >
      <LoadingOverlay isLoading={isLoading} />
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <div className="h-auto w-full max-w-5xl tm:h-[1100px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.header
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 8,
                  ease: 'easeInOut',
                }}
                className="mb-8"
              >
                <img
                  src="/logo.png"
                  alt="Tess"
                  className="h-20 w-auto drop-shadow-2xl sm:h-24 lg:h-28 xl:h-32"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 1,
                  ease: [0.25, 0.8, 0.25, 1],
                }}
                className="bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#c4b5fd] bg-clip-text text-5xl font-black leading-tight tracking-tight text-transparent sm:text-6xl lg:text-7xl xl:text-8xl"
              >
                Bem-vindo ao Tess
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 1.2 }}
                className="mt-6 max-w-lg text-lg font-medium text-purple-700/90 sm:text-xl lg:text-2xl"
              >
                a comunidade que te acolhe
              </motion.p>
            </motion.header>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md">
                <AnimatePresence mode="wait">
                  {isLogin ? (
                    forgotPassword ? (
                      permissionCode ? (
                        <motion.div
                          key="login"
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -40 }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                        >
                          <ResetPasswordComponent
                            setPermissionCode={setPermissionCode}
                            setForgotPassword={setForgotPassword}
                            setIsLogin={setIsLogin}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="login"
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -40 }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                        >
                          <ForgotPassword
                            setPermissionCode={setPermissionCode}
                            setForgotPassword={setForgotPassword}
                          />
                        </motion.div>
                      )
                    ) : (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                      >
                        <LoginComponent
                          setForgotPassword={setForgotPassword}
                          onSwitchToRegister={() => setIsLogin(false)}
                        />
                      </motion.div>
                    )
                  ) : !showConfirmPass ? (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    >
                      <RegisterComponent
                        setFirstStepData={setFirstStepData}
                        setShowConfirmPass={setShowConfirmPass}
                        onSwitchToLogin={() => setIsLogin(true)}
                      />
                    </motion.div>
                  ) : (
                    <AnalysisRegister
                      firstStepData={firstStepData}
                      setShowConfirmPass={setShowConfirmPass}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            <motion.footer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-0 text-center text-sm font-medium text-purple-600/75 transition-all duration-150 tm:absolute tm:bottom-1/3 tm:text-right"
            >
              © 2025 Tess • Feito com muito amor e acolhimento
            </motion.footer>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AuthenticadorPage
