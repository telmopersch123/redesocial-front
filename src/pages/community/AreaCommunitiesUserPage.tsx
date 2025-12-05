'use client'

import { MessageCircleHeart, Settings, Users } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '../../components/ui/button'

import CardsPostCommunityComponent from '../../components/componentsPages/PostsComponent.tsx/CardsPostComponent'
import PostComponentDialog from '../../components/componentsPages/PostsComponent.tsx/PostComponentDialog'
import UsersCommunityDialog from '../../components/componentsPages/componentsComunidadeUsuario/UsersCommunityDialog'
import { PostCardSkeleton } from '../../components/componentsPages/componentsPerfil/Skeleton'
import { TooltipComponent } from '../../components/globalcomponents/tooltipComponent'
import { useComunidades } from '../../context/CommunityContext'
import { useCriarPostDialog } from '../../context/ContextDialogPost'
import { useInfiniteScroll } from '../../hooks/effectsSkeletons'
import type { Post } from '../../types'

export const postsFicticiosCommunity: Post[] = [
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
  {
    id: 7,
    typePosts: 'Ansioso',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Hoje consegui meditar por 15 minutos e foi libertador!',
    imagem:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T14:30:00'),
    likes: 24,
    comentarios: [
      { id: 1, autor: 'Clara', texto: 'Inspirador! Vou tentar hoje mesmo.' },
      { id: 2, autor: 'Anônimo', texto: '15 minutos já é um grande passo!' },
    ],
    salvo: false,
    tags: ['Mindfulness', 'Meditação', 'Bem-estar'],
  },
  {
    id: 9,
    typePosts: 'Triste',
    community: 'Autoajuda',
    autor: 'Maria Silva',
    avatar: 'MS',
    friend: false,
    conteudo:
      'Estou aprendendo a ser mais gentil comigo mesma. É um processo, mas estou feliz com o progresso!',
    data: new Date('2025-11-09T10:15:00'),
    likes: 42,
    comentarios: [],
    salvo: true,
    tags: ['Autoajuda', 'Reflexão', 'Autocuidado'],
  },
  {
    id: 8,
    typePosts: 'Esperançoso',
    community: 'Fé & Espiritualidade',
    autor: 'João Pedro',
    avatar: 'JP',
    friend: false,
    conteudo: 'A gratidão é a linguagem da fé.',
    imagem:
      'https://thumbs.dreamstime.com/b/b%C3%ADblia-e-cruz-silhueta-contra-o-fundo-solar-simbolizando-f%C3%A9-espiritualidade-gerada-por-ia-381680496.jpg',
    data: new Date('2025-11-08T08:45:00'),
    likes: 89,
    comentarios: [{ id: 1, autor: 'Ana', texto: 'Amém! Gratidão muda tudo.' }],
    salvo: false,
    tags: ['Fé', 'Gratidão', 'Espiritualidade'],
  },
  {
    id: 10,
    typePosts: 'Feliz',
    community: 'Mindfulness',
    autor: 'Anônimo',
    avatar: null,
    friend: false,
    conteudo: 'Acalmar a mente antes de dormir tem mudado meus dias',
    data: new Date('2025-11-07T22:10:00'),
    likes: 15,
    comentarios: [],
    salvo: false,
    tags: ['Mindfulness', 'Relaxamento', 'Sono'],
  },
  {
    id: 11,
    typePosts: 'Feliz',
    community: 'Autoajuda',
    autor: 'Pedro Santos',
    avatar: 'PS',
    friend: true,
    conteudo:
      'Gravei um pequeno vídeo falando sobre como lidar com a ansiedade. Espero que ajude alguém',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-06T16:20:00'),
    likes: 67,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigada!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei pra ver depois.' },
    ],
    salvo: true,
    tags: ['Autoajuda', 'Ansiedade', 'Vídeo'],
  },
]

const ficticioAdminComunidade = true

export default function AreaCommunitiesUserPage() {
  const { filtro } = useComunidades()
  const [posts, setPosts] = useState<Post[]>(postsFicticiosCommunity)
  const [novoComentario, setNovoComentario] = useState('')
  const [visibleCount, setVisibleCount] = useState(10)
  const [loadedCount, setLoadedCount] = useState(10)

  const { setOpenDialogPostNotification, openDialogPostNotification } =
    useCriarPostDialog()

  const hasMore = visibleCount < posts.length
  const { loadMoreRef } = useInfiniteScroll({
    totalItems: posts.length,
    itemsPerPage: 10,
    delayInMs: 1000,
    rootMargin: '600px',
    enabled: hasMore,
    onLoadMore: () => {
      const nextDisplay = Math.min(visibleCount + 10, posts.length)
      setVisibleCount(nextDisplay)
      setTimeout(() => {
        setLoadedCount(nextDisplay)
      }, 1000)
    },
  })

  const postsFiltrados =
    filtro === 'all' ? posts : posts.filter((p) => p.community === filtro)

  return (
    <>
      <div className="fixed">
        <PostComponentDialog
          valuePost={posts[0]}
          novoComentario={novoComentario}
          setNovoComentario={setNovoComentario}
          setPosts={setPosts}
          posts={posts}
          open={openDialogPostNotification}
          onOpenChange={setOpenDialogPostNotification}
          typePost={'NotificaçãoDialog'}
        />
      </div>
      <div className="mb-4 mt-12 w-[99vw] !overflow-hidden px-0.5 md:w-[calc(100vw-20rem)] 2xl:w-[850px]">
        <main className={`transition-all duration-300`}>
          <div className="absolute right-4 top-4 flex flex-row-reverse gap-2 md:left-[270px] md:right-auto md:flex-row">
            {ficticioAdminComunidade && (
              <NavLink to={'config'}>
                <TooltipComponent
                  Tag={
                    <div className="cursor-pointer text-muted-foreground transition-colors hover:text-purple-600">
                      <Settings />
                    </div>
                  }
                  description="Configurações da Comunidade"
                />
              </NavLink>
            )}
            <UsersCommunityDialog />
          </div>

          <div className="min-h-[600px] space-y-24">
            {postsFiltrados.length > 0 ? (
              postsFiltrados
                .slice(0, visibleCount)
                .map((post: Post, index: number) => {
                  const isLoaded = index < loadedCount
                  return (
                    <>
                      {isLoaded ? (
                        <CardsPostCommunityComponent
                          key={post.id}
                          posts={posts}
                          valuePost={post}
                          setPosts={setPosts}
                        />
                      ) : (
                        <PostCardSkeleton />
                      )}
                    </>
                  )
                })
            ) : (
              <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-xl bg-gray-50 px-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 shadow-sm">
                  <MessageCircleHeart className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700">
                    Ainda não há posts
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Seja o primeiro a compartilhar algo ou crie uma nova
                    comunidade!
                  </p>
                </div>
                <NavLink to="/comunidades">
                  <Button
                    className="bg-linear-purple mt-2 text-white shadow-md hover:shadow-lg"
                    size="sm"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Visualizar Comunidades
                  </Button>
                </NavLink>
              </div>
            )}
            {visibleCount < posts.length && (
              <div ref={loadMoreRef} className="col-span-2 h-10" />
            )}
          </div>
        </main>
      </div>
    </>
  )
}
