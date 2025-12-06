import { useState } from 'react'
import { PostCardSkeleton } from '../components/componentsPages/componentsPerfil/Skeleton'
import CardsPostComponent from '../components/componentsPages/PostsComponent.tsx/CardsPostComponent'
import PostComponentDialog from '../components/componentsPages/PostsComponent.tsx/PostComponentDialog'
import { Button } from '../components/ui/button'
import { useCriarPostDialog } from '../context/ContextDialogPost'
import { useInfiniteScroll } from '../hooks/effectsSkeletons'
import type { Post } from '../types'
import { postsFicticiosCommunity } from './community/AreaCommunitiesUserPage'

const feelings: Array<keyof typeof gradientMap> = [
  'Todos',
  'Feliz',
  'Esperançoso',
  'Ansioso',
  'Agradecido',
  'Triste',
]

const gradientMap = {
  Todos:
    'from-gray-100 via-gray-50 to-gray-100 dark:from-[#1a1a1a] dark:via-[#1c1c1c] dark:to-[#1a1a1a]',
  Feliz:
    'from-yellow-100 via-yellow-50 to-amber-100 dark:from-[#2a2a1a] dark:via-[#2f2f1c] dark:to-[#2a2a1a]',
  Esperançoso:
    'from-green-100 via-emerald-50 to-green-200 dark:from-[#1a2a1a] dark:via-[#1c2f1c] dark:to-[#1a2a1a]',
  Ansioso:
    'from-violet-100 via-purple-50 to-violet-200 dark:from-[#221a2a] dark:via-[#251c30] dark:to-[#221a2a]',
  Agradecido:
    'from-sky-100 via-blue-50 to-indigo-100 dark:from-[#1a1f2a] dark:via-[#1c2230] dark:to-[#1a1f2a]',
  Triste:
    'from-blue-200 via-slate-50 to-blue-300 dark:from-[#1a1e2a] dark:via-[#1c2030] dark:to-[#1a1e2a]',
}

const emojiMap: Record<string, string> = {
  Todos: '🌍',
  Feliz: '😊',
  Esperançoso: '🌱',
  Ansioso: '😰',
  Agradecido: '🙏',
  Triste: '😢',
}

export const postsFicticiosGlobal: Post[] = [
  {
    id: 1,
    typePosts: 'Feliz',
    community: '',
    autor: 'Lucas Ferreira',
    avatar: 'LF',
    friend: true,
    conteudo:
      'Acabei de terminar um projeto que estava empacado há semanas. Sensação incrível!',
    imagem:
      'https://cotia.sp.gov.br/wp-content/uploads/2025/10/projeto-felicidade_secom-cotia-5.jpeg',
    data: new Date('2025-11-12T09:30:00'),
    likes: 34,
    comentarios: [
      { id: 1, autor: 'Carla', texto: 'Parabéns! O esforço vale a pena.' },
      { id: 2, autor: 'Anônimo', texto: 'Que motivador!' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Projeto', 'Motivação'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: '',
    autor: 'Fernanda Costa',
    avatar: 'FC',
    friend: false,
    conteudo:
      'Hoje acordei inspirada e escrevi algumas páginas do meu diário. É ótimo refletir sobre a vida!',
    data: new Date('2025-11-11T08:15:00'),
    likes: 28,
    comentarios: [],
    salvo: true,
    tags: ['Gratidão', 'Reflexão', 'Diário'],
  },
  {
    id: 3,
    typePosts: 'Feliz',
    community: '',
    autor: 'Rafael Almeida',
    avatar: 'RA',
    friend: false,
    conteudo: 'Nada como um café forte e música boa para começar o dia.',
    imagem:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T07:50:00'),
    likes: 45,
    comentarios: [
      { id: 1, autor: 'Ana', texto: 'Perfeito! Também adoro começar assim.' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Café', 'Manhã'],
  },
  {
    id: 4,
    typePosts: 'Ansioso',
    community: '',
    autor: 'Juliana Mendes',
    avatar: 'JM',
    friend: false,
    conteudo: 'Aprendi uma nova receita vegana e ficou deliciosa! 🍲',
    data: new Date('2025-11-09T18:40:00'),
    likes: 19,
    comentarios: [],
    salvo: false,
    tags: ['Ansiedade', 'Culinária', 'Vegano'],
  },
  {
    id: 5,
    typePosts: 'Triste',
    community: '',
    autor: 'Gabriel Santos',
    avatar: 'GS',
    friend: true,
    conteudo:
      'Gravei um vídeo compartilhando dicas de produtividade que tenho usado no trabalho. Espero que ajude alguém!',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-08T14:20:00'),
    likes: 52,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigado!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei para assistir depois.' },
    ],
    salvo: true,
    tags: ['Produtividade', 'Trabalho', 'Vídeo'],
  },
  {
    id: 1,
    typePosts: 'Feliz',
    community: '',
    autor: 'Lucas Ferreira',
    avatar: 'LF',
    friend: true,
    conteudo:
      'Acabei de terminar um projeto que estava empacado há semanas. Sensação incrível!',
    imagem:
      'https://cotia.sp.gov.br/wp-content/uploads/2025/10/projeto-felicidade_secom-cotia-5.jpeg',
    data: new Date('2025-11-12T09:30:00'),
    likes: 34,
    comentarios: [
      { id: 1, autor: 'Carla', texto: 'Parabéns! O esforço vale a pena.' },
      { id: 2, autor: 'Anônimo', texto: 'Que motivador!' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Projeto', 'Motivação'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: '',
    autor: 'Fernanda Costa',
    avatar: 'FC',
    friend: false,
    conteudo:
      'Hoje acordei inspirada e escrevi algumas páginas do meu diário. É ótimo refletir sobre a vida!',
    data: new Date('2025-11-11T08:15:00'),
    likes: 28,
    comentarios: [],
    salvo: true,
    tags: ['Gratidão', 'Reflexão', 'Diário'],
  },
  {
    id: 3,
    typePosts: 'Feliz',
    community: '',
    autor: 'Rafael Almeida',
    avatar: 'RA',
    friend: false,
    conteudo: 'Nada como um café forte e música boa para começar o dia.',
    imagem:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T07:50:00'),
    likes: 45,
    comentarios: [
      { id: 1, autor: 'Ana', texto: 'Perfeito! Também adoro começar assim.' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Café', 'Manhã'],
  },
  {
    id: 4,
    typePosts: 'Ansioso',
    community: '',
    autor: 'Juliana Mendes',
    avatar: 'JM',
    friend: false,
    conteudo: 'Aprendi uma nova receita vegana e ficou deliciosa! 🍲',
    data: new Date('2025-11-09T18:40:00'),
    likes: 19,
    comentarios: [],
    salvo: false,
    tags: ['Ansiedade', 'Culinária', 'Vegano'],
  },
  {
    id: 5,
    typePosts: 'Triste',
    community: '',
    autor: 'Gabriel Santos',
    avatar: 'GS',
    friend: true,
    conteudo:
      'Gravei um vídeo compartilhando dicas de produtividade que tenho usado no trabalho. Espero que ajude alguém!',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-08T14:20:00'),
    likes: 52,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigado!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei para assistir depois.' },
    ],
    salvo: true,
    tags: ['Produtividade', 'Trabalho', 'Vídeo'],
  },
  {
    id: 1,
    typePosts: 'Feliz',
    community: '',
    autor: 'Lucas Ferreira',
    avatar: 'LF',
    friend: true,
    conteudo:
      'Acabei de terminar um projeto que estava empacado há semanas. Sensação incrível!',
    imagem:
      'https://cotia.sp.gov.br/wp-content/uploads/2025/10/projeto-felicidade_secom-cotia-5.jpeg',
    data: new Date('2025-11-12T09:30:00'),
    likes: 34,
    comentarios: [
      { id: 1, autor: 'Carla', texto: 'Parabéns! O esforço vale a pena.' },
      { id: 2, autor: 'Anônimo', texto: 'Que motivador!' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Projeto', 'Motivação'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: '',
    autor: 'Fernanda Costa',
    avatar: 'FC',
    friend: false,
    conteudo:
      'Hoje acordei inspirada e escrevi algumas páginas do meu diário. É ótimo refletir sobre a vida!',
    data: new Date('2025-11-11T08:15:00'),
    likes: 28,
    comentarios: [],
    salvo: true,
    tags: ['Gratidão', 'Reflexão', 'Diário'],
  },
  {
    id: 3,
    typePosts: 'Feliz',
    community: '',
    autor: 'Rafael Almeida',
    avatar: 'RA',
    friend: false,
    conteudo: 'Nada como um café forte e música boa para começar o dia.',
    imagem:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T07:50:00'),
    likes: 45,
    comentarios: [
      { id: 1, autor: 'Ana', texto: 'Perfeito! Também adoro começar assim.' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Café', 'Manhã'],
  },
  {
    id: 4,
    typePosts: 'Ansioso',
    community: '',
    autor: 'Juliana Mendes',
    avatar: 'JM',
    friend: false,
    conteudo: 'Aprendi uma nova receita vegana e ficou deliciosa! 🍲',
    data: new Date('2025-11-09T18:40:00'),
    likes: 19,
    comentarios: [],
    salvo: false,
    tags: ['Ansiedade', 'Culinária', 'Vegano'],
  },
  {
    id: 5,
    typePosts: 'Triste',
    community: '',
    autor: 'Gabriel Santos',
    avatar: 'GS',
    friend: true,
    conteudo:
      'Gravei um vídeo compartilhando dicas de produtividade que tenho usado no trabalho. Espero que ajude alguém!',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-08T14:20:00'),
    likes: 52,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigado!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei para assistir depois.' },
    ],
    salvo: true,
    tags: ['Produtividade', 'Trabalho', 'Vídeo'],
  },
  {
    id: 1,
    typePosts: 'Feliz',
    community: '',
    autor: 'Lucas Ferreira',
    avatar: 'LF',
    friend: true,
    conteudo:
      'Acabei de terminar um projeto que estava empacado há semanas. Sensação incrível!',
    imagem:
      'https://cotia.sp.gov.br/wp-content/uploads/2025/10/projeto-felicidade_secom-cotia-5.jpeg',
    data: new Date('2025-11-12T09:30:00'),
    likes: 34,
    comentarios: [
      { id: 1, autor: 'Carla', texto: 'Parabéns! O esforço vale a pena.' },
      { id: 2, autor: 'Anônimo', texto: 'Que motivador!' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Projeto', 'Motivação'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: '',
    autor: 'Fernanda Costa',
    avatar: 'FC',
    friend: false,
    conteudo:
      'Hoje acordei inspirada e escrevi algumas páginas do meu diário. É ótimo refletir sobre a vida!',
    data: new Date('2025-11-11T08:15:00'),
    likes: 28,
    comentarios: [],
    salvo: true,
    tags: ['Gratidão', 'Reflexão', 'Diário'],
  },
  {
    id: 3,
    typePosts: 'Feliz',
    community: '',
    autor: 'Rafael Almeida',
    avatar: 'RA',
    friend: false,
    conteudo: 'Nada como um café forte e música boa para começar o dia.',
    imagem:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T07:50:00'),
    likes: 45,
    comentarios: [
      { id: 1, autor: 'Ana', texto: 'Perfeito! Também adoro começar assim.' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Café', 'Manhã'],
  },
  {
    id: 4,
    typePosts: 'Ansioso',
    community: '',
    autor: 'Juliana Mendes',
    avatar: 'JM',
    friend: false,
    conteudo: 'Aprendi uma nova receita vegana e ficou deliciosa! 🍲',
    data: new Date('2025-11-09T18:40:00'),
    likes: 19,
    comentarios: [],
    salvo: false,
    tags: ['Ansiedade', 'Culinária', 'Vegano'],
  },
  {
    id: 5,
    typePosts: 'Triste',
    community: '',
    autor: 'Gabriel Santos',
    avatar: 'GS',
    friend: true,
    conteudo:
      'Gravei um vídeo compartilhando dicas de produtividade que tenho usado no trabalho. Espero que ajude alguém!',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-08T14:20:00'),
    likes: 52,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigado!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei para assistir depois.' },
    ],
    salvo: true,
    tags: ['Produtividade', 'Trabalho', 'Vídeo'],
  },
  {
    id: 1,
    typePosts: 'Feliz',
    community: '',
    autor: 'Lucas Ferreira',
    avatar: 'LF',
    friend: true,
    conteudo:
      'Acabei de terminar um projeto que estava empacado há semanas. Sensação incrível!',
    imagem:
      'https://cotia.sp.gov.br/wp-content/uploads/2025/10/projeto-felicidade_secom-cotia-5.jpeg',
    data: new Date('2025-11-12T09:30:00'),
    likes: 34,
    comentarios: [
      { id: 1, autor: 'Carla', texto: 'Parabéns! O esforço vale a pena.' },
      { id: 2, autor: 'Anônimo', texto: 'Que motivador!' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Projeto', 'Motivação'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: '',
    autor: 'Fernanda Costa',
    avatar: 'FC',
    friend: false,
    conteudo:
      'Hoje acordei inspirada e escrevi algumas páginas do meu diário. É ótimo refletir sobre a vida!',
    data: new Date('2025-11-11T08:15:00'),
    likes: 28,
    comentarios: [],
    salvo: true,
    tags: ['Gratidão', 'Reflexão', 'Diário'],
  },
  {
    id: 3,
    typePosts: 'Feliz',
    community: '',
    autor: 'Rafael Almeida',
    avatar: 'RA',
    friend: false,
    conteudo: 'Nada como um café forte e música boa para começar o dia.',
    imagem:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T07:50:00'),
    likes: 45,
    comentarios: [
      { id: 1, autor: 'Ana', texto: 'Perfeito! Também adoro começar assim.' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Café', 'Manhã'],
  },
  {
    id: 4,
    typePosts: 'Ansioso',
    community: '',
    autor: 'Juliana Mendes',
    avatar: 'JM',
    friend: false,
    conteudo: 'Aprendi uma nova receita vegana e ficou deliciosa! 🍲',
    data: new Date('2025-11-09T18:40:00'),
    likes: 19,
    comentarios: [],
    salvo: false,
    tags: ['Ansiedade', 'Culinária', 'Vegano'],
  },
  {
    id: 5,
    typePosts: 'Triste',
    community: '',
    autor: 'Gabriel Santos',
    avatar: 'GS',
    friend: true,
    conteudo:
      'Gravei um vídeo compartilhando dicas de produtividade que tenho usado no trabalho. Espero que ajude alguém!',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-08T14:20:00'),
    likes: 52,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigado!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei para assistir depois.' },
    ],
    salvo: true,
    tags: ['Produtividade', 'Trabalho', 'Vídeo'],
  },
  {
    id: 1,
    typePosts: 'Feliz',
    community: '',
    autor: 'Lucas Ferreira',
    avatar: 'LF',
    friend: true,
    conteudo:
      'Acabei de terminar um projeto que estava empacado há semanas. Sensação incrível!',
    imagem:
      'https://cotia.sp.gov.br/wp-content/uploads/2025/10/projeto-felicidade_secom-cotia-5.jpeg',
    data: new Date('2025-11-12T09:30:00'),
    likes: 34,
    comentarios: [
      { id: 1, autor: 'Carla', texto: 'Parabéns! O esforço vale a pena.' },
      { id: 2, autor: 'Anônimo', texto: 'Que motivador!' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Projeto', 'Motivação'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: '',
    autor: 'Fernanda Costa',
    avatar: 'FC',
    friend: false,
    conteudo:
      'Hoje acordei inspirada e escrevi algumas páginas do meu diário. É ótimo refletir sobre a vida!',
    data: new Date('2025-11-11T08:15:00'),
    likes: 28,
    comentarios: [],
    salvo: true,
    tags: ['Gratidão', 'Reflexão', 'Diário'],
  },
  {
    id: 3,
    typePosts: 'Feliz',
    community: '',
    autor: 'Rafael Almeida',
    avatar: 'RA',
    friend: false,
    conteudo: 'Nada como um café forte e música boa para começar o dia.',
    imagem:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T07:50:00'),
    likes: 45,
    comentarios: [
      { id: 1, autor: 'Ana', texto: 'Perfeito! Também adoro começar assim.' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Café', 'Manhã'],
  },
  {
    id: 4,
    typePosts: 'Ansioso',
    community: '',
    autor: 'Juliana Mendes',
    avatar: 'JM',
    friend: false,
    conteudo: 'Aprendi uma nova receita vegana e ficou deliciosa! 🍲',
    data: new Date('2025-11-09T18:40:00'),
    likes: 19,
    comentarios: [],
    salvo: false,
    tags: ['Ansiedade', 'Culinária', 'Vegano'],
  },
  {
    id: 5,
    typePosts: 'Triste',
    community: '',
    autor: 'Gabriel Santos',
    avatar: 'GS',
    friend: true,
    conteudo:
      'Gravei um vídeo compartilhando dicas de produtividade que tenho usado no trabalho. Espero que ajude alguém!',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-08T14:20:00'),
    likes: 52,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigado!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei para assistir depois.' },
    ],
    salvo: true,
    tags: ['Produtividade', 'Trabalho', 'Vídeo'],
  },
  {
    id: 1,
    typePosts: 'Feliz',
    community: '',
    autor: 'Lucas Ferreira',
    avatar: 'LF',
    friend: true,
    conteudo:
      'Acabei de terminar um projeto que estava empacado há semanas. Sensação incrível!',
    imagem:
      'https://cotia.sp.gov.br/wp-content/uploads/2025/10/projeto-felicidade_secom-cotia-5.jpeg',
    data: new Date('2025-11-12T09:30:00'),
    likes: 34,
    comentarios: [
      { id: 1, autor: 'Carla', texto: 'Parabéns! O esforço vale a pena.' },
      { id: 2, autor: 'Anônimo', texto: 'Que motivador!' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Projeto', 'Motivação'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: '',
    autor: 'Fernanda Costa',
    avatar: 'FC',
    friend: false,
    conteudo:
      'Hoje acordei inspirada e escrevi algumas páginas do meu diário. É ótimo refletir sobre a vida!',
    data: new Date('2025-11-11T08:15:00'),
    likes: 28,
    comentarios: [],
    salvo: true,
    tags: ['Gratidão', 'Reflexão', 'Diário'],
  },
  {
    id: 3,
    typePosts: 'Feliz',
    community: '',
    autor: 'Rafael Almeida',
    avatar: 'RA',
    friend: false,
    conteudo: 'Nada como um café forte e música boa para começar o dia.',
    imagem:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T07:50:00'),
    likes: 45,
    comentarios: [
      { id: 1, autor: 'Ana', texto: 'Perfeito! Também adoro começar assim.' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Café', 'Manhã'],
  },
  {
    id: 4,
    typePosts: 'Ansioso',
    community: '',
    autor: 'Juliana Mendes',
    avatar: 'JM',
    friend: false,
    conteudo: 'Aprendi uma nova receita vegana e ficou deliciosa! 🍲',
    data: new Date('2025-11-09T18:40:00'),
    likes: 19,
    comentarios: [],
    salvo: false,
    tags: ['Ansiedade', 'Culinária', 'Vegano'],
  },
  {
    id: 5,
    typePosts: 'Triste',
    community: '',
    autor: 'Gabriel Santos',
    avatar: 'GS',
    friend: true,
    conteudo:
      'Gravei um vídeo compartilhando dicas de produtividade que tenho usado no trabalho. Espero que ajude alguém!',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-08T14:20:00'),
    likes: 52,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigado!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei para assistir depois.' },
    ],
    salvo: true,
    tags: ['Produtividade', 'Trabalho', 'Vídeo'],
  },
  {
    id: 1,
    typePosts: 'Feliz',
    community: '',
    autor: 'Lucas Ferreira',
    avatar: 'LF',
    friend: true,
    conteudo:
      'Acabei de terminar um projeto que estava empacado há semanas. Sensação incrível!',
    imagem:
      'https://cotia.sp.gov.br/wp-content/uploads/2025/10/projeto-felicidade_secom-cotia-5.jpeg',
    data: new Date('2025-11-12T09:30:00'),
    likes: 34,
    comentarios: [
      { id: 1, autor: 'Carla', texto: 'Parabéns! O esforço vale a pena.' },
      { id: 2, autor: 'Anônimo', texto: 'Que motivador!' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Projeto', 'Motivação'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: '',
    autor: 'Fernanda Costa',
    avatar: 'FC',
    friend: false,
    conteudo:
      'Hoje acordei inspirada e escrevi algumas páginas do meu diário. É ótimo refletir sobre a vida!',
    data: new Date('2025-11-11T08:15:00'),
    likes: 28,
    comentarios: [],
    salvo: true,
    tags: ['Gratidão', 'Reflexão', 'Diário'],
  },
  {
    id: 3,
    typePosts: 'Feliz',
    community: '',
    autor: 'Rafael Almeida',
    avatar: 'RA',
    friend: false,
    conteudo: 'Nada como um café forte e música boa para começar o dia.',
    imagem:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-10T07:50:00'),
    likes: 45,
    comentarios: [
      { id: 1, autor: 'Ana', texto: 'Perfeito! Também adoro começar assim.' },
    ],
    salvo: false,
    tags: ['Felicidade', 'Café', 'Manhã'],
  },
  {
    id: 4,
    typePosts: 'Ansioso',
    community: '',
    autor: 'Juliana Mendes',
    avatar: 'JM',
    friend: false,
    conteudo: 'Aprendi uma nova receita vegana e ficou deliciosa! 🍲',
    data: new Date('2025-11-09T18:40:00'),
    likes: 19,
    comentarios: [],
    salvo: false,
    tags: ['Ansiedade', 'Culinária', 'Vegano'],
  },
  {
    id: 5,
    typePosts: 'Triste',
    community: '',
    autor: 'Gabriel Santos',
    avatar: 'GS',
    friend: true,
    conteudo:
      'Gravei um vídeo compartilhando dicas de produtividade que tenho usado no trabalho. Espero que ajude alguém!',
    video: true,
    imagem:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    data: new Date('2025-11-08T14:20:00'),
    likes: 52,
    comentarios: [
      { id: 1, autor: 'Luiza', texto: 'Muito útil, obrigado!' },
      { id: 2, autor: 'Anônimo', texto: 'Já salvei para assistir depois.' },
    ],
    salvo: true,
    tags: ['Produtividade', 'Trabalho', 'Vídeo'],
  },
  ...postsFicticiosCommunity,
]

const FeedPage = () => {
  const [novoComentario, setNovoComentario] = useState('')

  const [posts, setPosts] = useState<Post[]>(postsFicticiosGlobal)
  const {
    open,
    setPostCommunity,
    setOpenDialogPostNotification,
    openDialogPostNotification,
  } = useCriarPostDialog()
  const [selectedFeeling, setSelectedFeeling] =
    useState<keyof typeof gradientMap>('Todos')

  const [visibleCount, setVisibleCount] = useState(10)
  const [loadedCount, setLoadedCount] = useState(10)
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

  const filterPosts = (selectedFeling: keyof typeof gradientMap) => {
    if (selectedFeling === 'Todos') {
      setPosts(postsFicticiosGlobal)
    } else {
      const filteredPost = postsFicticiosGlobal.filter(
        (post) => post.typePosts === selectedFeling
      )
      setPosts(filteredPost)
    }
  }

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

      <div className="mb-4 mt-12 w-[99vw] px-0.5 sm:px-5 md:w-[calc(100vw-20rem)] 2xl:w-[1000px]">
        <img
          src="/logo.png"
          alt="Logo da Rede Social"
          width={100}
          height={100}
          className="mx-auto rounded-2xl md:hidden"
        />

        <p className="text-1xl text-muted-foreground dark:text-gray-300 sm:text-left">
          Um espaço seguro para compartilhar e apoiar 💙
        </p>

        <Button
          onClick={() => {
            open()
            setPostCommunity(false)
          }}
          className="bg-linear-purple mx-auto mt-5 w-full rounded-xl border-none p-7 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] active:shadow-md"
        >
          + Como você está se sentindo?
        </Button>

        <div
          className="m-auto mt-3 flex w-full justify-between overflow-x-auto whitespace-nowrap rounded-lg bg-white/50 p-2 shadow-sm backdrop-blur-md dark:bg-white/10"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {feelings.map((feeling: keyof typeof gradientMap) => {
            const isSelected = selectedFeeling === feeling
            return (
              <p
                key={feeling}
                onClick={() => {
                  setSelectedFeeling(feeling)
                  filterPosts(feeling)
                }}
                className={`m-1 cursor-pointer rounded-full px-5 py-2 font-semibold transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-r ${gradientMap[feeling]} scale-105 text-gray-800 shadow-md dark:text-white`
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white'
                } `}
              >
                {emojiMap[feeling]} {feeling}
              </p>
            )
          })}
        </div>

        <div className="mt-12 space-y-24">
          {posts.length > 0 ? (
            posts.slice(0, visibleCount).map((post: Post, index: number) => {
              const isLoaded = index < loadedCount
              return (
                <>
                  {isLoaded ? (
                    <CardsPostComponent
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
            <div className="flex flex-col items-center">
              <p className="m-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eeeefa] p-3 text-4xl dark:bg-white/10">
                🌱
              </p>
              <p className="mt-5 text-xs font-semibold text-muted-foreground dark:text-gray-300 sm:text-xl">
                Nenhum post ainda. Seja o primeiro a compartilhar!
              </p>
            </div>
          )}

          {visibleCount < posts.length && (
            <div ref={loadMoreRef} className="col-span-2 h-10" />
          )}
        </div>
      </div>
    </>
  )
}

export default FeedPage
