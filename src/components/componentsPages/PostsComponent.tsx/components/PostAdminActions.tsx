'use client'

import { Archive, MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../../../ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu'
import { ModalConfirmDelPost } from './ModalConfirmDelPost'
import { ModalConfirmUnarchivePost } from './ModalConfirmUnarchivePost'

interface PostAdminActionsProps {
  postId: number | string
  nameUser: string
}

export const PostAdminActions = ({
  postId,
  nameUser,
}: PostAdminActionsProps) => {
  const [openArchive, setOpenArchive] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  return (
    <>
      {/* MENU */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => setOpenArchive(true)}
            className="gap-2 text-green-600 focus:bg-purple-50 dark:focus:bg-purple-900/20"
          >
            <Archive className="h-4 w-4" />
            Desarquivar postagem
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="gap-2 text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            Excluir postagem
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalConfirmUnarchivePost
        nameUser={nameUser}
        postId={postId}
        open={openArchive}
        setOpen={setOpenArchive}
        disabled={true}
      />

      <ModalConfirmDelPost
        nameUser={nameUser}
        open={openDelete}
        setOpen={setOpenDelete}
        disabled={true}
        postId={postId}
      />
    </>
  )
}
