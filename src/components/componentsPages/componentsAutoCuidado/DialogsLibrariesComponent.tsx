'use client'

import ReactMarkdown from 'react-markdown'
import remarkGemoji from 'remark-gemoji'
import type { BibliotecaApoioItem } from '../../../types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import SupportLibrary from './SupportLibraryComponent'

const DialogsLibrariesComponent = ({ item }: { item: BibliotecaApoioItem }) => {
  const { icon: Icon, cor, titulo, categoria, tempo, desc, conteudo } = item

  // Usa conteudo (longo) ou fallback para desc
  const markdownText = conteudo || desc

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <SupportLibrary item={item} />
        </div>
      </DialogTrigger>

      <DialogContent className="h-[90vh] w-[95%] overflow-y-auto rounded-md border-none bg-white p-6 dark:bg-zinc-900 sm:h-auto sm:max-h-[90vh] sm:rounded-xl 2xl:w-[1000px]">
        <DialogHeader className="flex flex-row items-start gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-sm"
            style={{ backgroundColor: cor }}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {titulo}
            </DialogTitle>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {categoria} • {tempo}
            </p>
          </div>
        </DialogHeader>

        <div className="prose prose-sm mt-6 max-w-none text-zinc-700 dark:text-zinc-300">
          <ReactMarkdown
            remarkPlugins={[remarkGemoji]}
            components={{
              h2: ({ children }) => (
                <h2 className="mb-3 mt-6 border-l-4 border-purple-500 pl-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-2 mt-5 text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  {children}
                </h3>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-purple-600 dark:text-purple-400">
                  {children}
                </strong>
              ),
              ul: ({ children }) => (
                <ul className="my-4 ml-4 list-disc space-y-2 text-zinc-700 dark:text-zinc-300">
                  {children}
                </ul>
              ),
              li: ({ children }) => <li className="pl-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="my-5 rounded-r border-l-4 border-purple-400 bg-purple-50/70 py-3 pl-4 italic text-zinc-700 dark:border-purple-600 dark:bg-purple-900/30 dark:text-zinc-300">
                  {children}
                </blockquote>
              ),
              p: ({ children }) => (
                <p className="mb-3 leading-relaxed">{children}</p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 font-medium text-purple-600 underline hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  {children}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ),
            }}
          >
            {markdownText}
          </ReactMarkdown>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogsLibrariesComponent
