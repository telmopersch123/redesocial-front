import { motion } from 'framer-motion'
import { Edit2 } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import BlockedConfirmDialog from '../components/componentsPages/componentsPerfil/BlockedConfirmDialog'
import { FollowersDialog } from '../components/componentsPages/componentsPerfil/FollowersDialog'
import { FriendsDialog } from '../components/componentsPages/componentsPerfil/FriendsDialog'
import ReportDialog from '../components/componentsPages/componentsPerfil/ReportDialog'
import { PostCardSkeleton } from '../components/componentsPages/componentsPerfil/Skeleton'
import CardsPostComponent from '../components/componentsPages/PostsComponent.tsx/CardsPostComponent'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { useInfiniteScroll } from '../hooks/effectsSkeletons'
import type { Post } from '../types'
const postsFicticiosGlobal: Post[] = [
  {
    id: 1,
    typePosts: 'Ansioso',
    community: 'Ansiedade & Depressão',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Hoje a ansiedade apertou o peito logo cedo. Respirei fundo, contei até 10 várias vezes e consegui sair de casa. Pequenas vitórias importam.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-18T08:30:00'),
    likes: 87,
    comentarios: [
      {
        id: 1,
        autor: 'Ana Clara',
        texto: 'Você é forte demais, Carlos! Orgulho de te acompanhar aqui.',
      },
      {
        id: 2,
        autor: 'Lucas Mendes',
        texto: 'Passo a passo, irmão. Tamo junto!',
      },
    ],
    salvo: true,
    tags: ['ansiedade', 'respiro', 'vitória'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Acordei vivo. Tenho teto, comida, saúde razoável e pessoas que me amam mesmo nos meus piores dias. Isso já é tudo.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-17T19:15:00'),
    likes: 203,
    comentarios: [
      {
        id: 1,
        autor: 'Mariana Silva',
        texto: 'Gratidão muda tudo mesmo! Te amo por isso.',
      },
      { id: 2, autor: 'Pedro Costa', texto: 'Postura de rei, irmão!' },
    ],
    salvo: false,
    tags: ['gratidão', 'vida', 'simples'],
  },
  {
    id: 3,
    typePosts: 'Esperançoso',
    community: 'Crescimento Pessoal',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Pela primeira vez em muito tempo, acordei com um fio de esperança no peito. Como se amanhã pudesse ser um pouco melhor. Alguém mais já sentiu isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-16T14:22:00'),
    likes: 412,
    comentarios: [
      {
        id: 1,
        autor: 'Julia Ferreira',
        texto: 'Senti isso semana passada! É o começo da virada!',
      },
      {
        id: 2,
        autor: 'Rafael Lima',
        texto: 'Esse fio vira corda, depois escada. Acredita!',
      },
      {
        id: 3,
        autor: 'Beatriz Souza',
        texto: 'Chorando aqui de emoção por você.',
      },
    ],
    salvo: true,
    tags: ['esperança', 'virada', 'luz no fim'],
  },
  {
    id: 4,
    typePosts: 'Triste',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Às vezes a tristeza vem tão quieta que nem percebo. Só sinto o peso. Hoje foi um desses dias.',
    imagem:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    video: false,
    data: new Date('2025-11-15T02:10:00'),
    likes: 156,
    comentarios: [
      {
        id: 1,
        autor: 'Camila Rocha',
        texto: 'Te entendo tanto... tá tudo bem não estar bem.',
      },
      {
        id: 2,
        autor: 'Thiago Oliveira',
        texto: 'Força, cara. Amanhã o sol nasce de novo.',
      },
    ],
    salvo: false,
    tags: ['tristeza', 'silêncio', 'peso'],
  },
  {
    id: 5,
    typePosts: 'Feliz',
    community: 'Momentos Bons',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'RI MUITO com meus amigos hoje. Fazia tempo que não sentia essa leveza na alma. Que dia abençoado!',
    imagem: undefined,
    video: true,
    data: new Date('2025-11-14T21:45:00'),
    likes: 389,
    comentarios: [
      { id: 1, autor: 'Gabriel Santos', texto: 'Aquele vídeo tá épico kkkkk' },
      { id: 2, autor: 'Letícia Mendes', texto: 'Sua risada é contagiante!' },
    ],
    salvo: true,
    tags: ['amigos', 'risada', 'leveza'],
  },
  {
    id: 6,
    typePosts: 'Ansioso',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Entrevista de emprego amanhã. Coração na boca desde ontem. Alguém tem dica pra controlar isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-13T23:59:00'),
    likes: 94,
    comentarios: [
      {
        id: 1,
        autor: 'Fernanda Dias',
        texto: 'Respira 4-7-8, funciona muito!',
      },
      { id: 2, autor: 'Renato Alves', texto: 'Você é foda, vai dar certo!' },
    ],
    salvo: false,
    tags: ['entrevista', 'ansiedade', 'medo'],
  },
  {
    id: 7,
    typePosts: 'Esperançoso',
    community: 'Recuperação',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Completei 30 dias sem crise forte. 30 dias. Parece pouco, mas pra mim é uma vida inteira.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-12T10:30:00'),
    likes: 678,
    comentarios: [
      { id: 1, autor: 'Vanessa Lima', texto: 'ISSO AÍ!!! Orgulho define!' },
      {
        id: 2,
        autor: 'Eduardo Nogueira',
        texto: '30 dias é só o começo, rei!',
      },
    ],
    salvo: true,
    tags: ['30dias', 'recuperação', 'orgulho'],
  },
  {
    id: 8,
    typePosts: 'Agradecido',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Minha terapeuta disse hoje: "Você já percorreu 80% do caminho". Chorei na sessão. Gratidão por estar vivo e lutando.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-10T16:20:00'),
    likes: 512,
    comentarios: [
      {
        id: 1,
        autor: 'Patrícia Gomes',
        texto: 'Que lindo, Carlos. Você merece tudo de bom.',
      },
      { id: 2, autor: 'Marcos Vinícius', texto: 'Terapia salva vidas mesmo.' },
    ],
    salvo: true,
    tags: ['terapia', 'gratidão', 'progresso'],
  },
  {
    id: 9,
    typePosts: 'Feliz',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Consegui meditar 15 minutos seguidos hoje! Eu, que não conseguia 2 minutos há 6 meses. Tô emocionado.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-08T07:55:00'),
    likes: 298,
    comentarios: [
      { id: 1, autor: 'Isabela Torres', texto: 'QUE ORGULHO!!!' },
      { id: 2, autor: 'Felipe Castro', texto: 'Evolução pura!' },
    ],
    salvo: false,
    tags: ['meditação', 'vitória', 'paz'],
  },
  {
    id: 10,
    typePosts: 'Triste',
    community: 'Luto',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Faz 1 ano que meu cachorro se foi. Ainda dói como se fosse ontem. Quem já perdeu um pet sabe...',
    imagem: 'https://images.unsplash.com/photo-1543466835-00a638f3e629?w=800',
    video: false,
    data: new Date('2025-11-05T00:30:00'),
    likes: 445,
    comentarios: [
      {
        id: 1,
        autor: 'Laura Mendes',
        texto: 'Eles nunca vão embora de verdade...',
      },
      {
        id: 2,
        autor: 'João Pedro',
        texto: 'Sinto sua dor, irmão. Abraço forte.',
      },
    ],
    salvo: true,
    tags: ['luto', 'pet', 'saudade'],
  },
  // ... (repetindo a estrutura com variações até 30 posts)
  // Pra não ficar gigante aqui, te dou mais 20 com diversidade:
  {
    id: 11,
    typePosts: 'Ansioso',
    conteudo:
      'Ataque de pânico no mercado hoje. Saí correndo. Vergonha e medo andam juntos.',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    likes: 78,
    comentarios: [],
    salvo: false,
    data: new Date('2025-11-04T15:20:00'),
    tags: ['pânico', 'vergonha'],
  },
  {
    id: 12,
    typePosts: 'Esperançoso',
    conteudo:
      'Li um livro inteiro essa semana. EU. Que não conseguia ler 2 páginas. Progresso real.',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    likes: 334,
    comentarios: [{ id: 1, autor: 'Renata', texto: 'Qual livro?? Quero ler!' }],
    salvo: true,
    data: new Date('2025-11-03T20:10:00'),
    tags: ['leitura', 'foco', 'progresso'],
  },
  {
    id: 1,
    typePosts: 'Ansioso',
    community: 'Ansiedade & Depressão',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Hoje a ansiedade apertou o peito logo cedo. Respirei fundo, contei até 10 várias vezes e consegui sair de casa. Pequenas vitórias importam.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-18T08:30:00'),
    likes: 87,
    comentarios: [
      {
        id: 1,
        autor: 'Ana Clara',
        texto: 'Você é forte demais, Carlos! Orgulho de te acompanhar aqui.',
      },
      {
        id: 2,
        autor: 'Lucas Mendes',
        texto: 'Passo a passo, irmão. Tamo junto!',
      },
    ],
    salvo: true,
    tags: ['ansiedade', 'respiro', 'vitória'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Acordei vivo. Tenho teto, comida, saúde razoável e pessoas que me amam mesmo nos meus piores dias. Isso já é tudo.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-17T19:15:00'),
    likes: 203,
    comentarios: [
      {
        id: 1,
        autor: 'Mariana Silva',
        texto: 'Gratidão muda tudo mesmo! Te amo por isso.',
      },
      { id: 2, autor: 'Pedro Costa', texto: 'Postura de rei, irmão!' },
    ],
    salvo: false,
    tags: ['gratidão', 'vida', 'simples'],
  },
  {
    id: 3,
    typePosts: 'Esperançoso',
    community: 'Crescimento Pessoal',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Pela primeira vez em muito tempo, acordei com um fio de esperança no peito. Como se amanhã pudesse ser um pouco melhor. Alguém mais já sentiu isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-16T14:22:00'),
    likes: 412,
    comentarios: [
      {
        id: 1,
        autor: 'Julia Ferreira',
        texto: 'Senti isso semana passada! É o começo da virada!',
      },
      {
        id: 2,
        autor: 'Rafael Lima',
        texto: 'Esse fio vira corda, depois escada. Acredita!',
      },
      {
        id: 3,
        autor: 'Beatriz Souza',
        texto: 'Chorando aqui de emoção por você.',
      },
    ],
    salvo: true,
    tags: ['esperança', 'virada', 'luz no fim'],
  },
  {
    id: 1,
    typePosts: 'Ansioso',
    community: 'Ansiedade & Depressão',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Hoje a ansiedade apertou o peito logo cedo. Respirei fundo, contei até 10 várias vezes e consegui sair de casa. Pequenas vitórias importam.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-18T08:30:00'),
    likes: 87,
    comentarios: [
      {
        id: 1,
        autor: 'Ana Clara',
        texto: 'Você é forte demais, Carlos! Orgulho de te acompanhar aqui.',
      },
      {
        id: 2,
        autor: 'Lucas Mendes',
        texto: 'Passo a passo, irmão. Tamo junto!',
      },
    ],
    salvo: true,
    tags: ['ansiedade', 'respiro', 'vitória'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Acordei vivo. Tenho teto, comida, saúde razoável e pessoas que me amam mesmo nos meus piores dias. Isso já é tudo.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-17T19:15:00'),
    likes: 203,
    comentarios: [
      {
        id: 1,
        autor: 'Mariana Silva',
        texto: 'Gratidão muda tudo mesmo! Te amo por isso.',
      },
      { id: 2, autor: 'Pedro Costa', texto: 'Postura de rei, irmão!' },
    ],
    salvo: false,
    tags: ['gratidão', 'vida', 'simples'],
  },
  {
    id: 3,
    typePosts: 'Esperançoso',
    community: 'Crescimento Pessoal',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Pela primeira vez em muito tempo, acordei com um fio de esperança no peito. Como se amanhã pudesse ser um pouco melhor. Alguém mais já sentiu isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-16T14:22:00'),
    likes: 412,
    comentarios: [
      {
        id: 1,
        autor: 'Julia Ferreira',
        texto: 'Senti isso semana passada! É o começo da virada!',
      },
      {
        id: 2,
        autor: 'Rafael Lima',
        texto: 'Esse fio vira corda, depois escada. Acredita!',
      },
      {
        id: 3,
        autor: 'Beatriz Souza',
        texto: 'Chorando aqui de emoção por você.',
      },
    ],
    salvo: true,
    tags: ['esperança', 'virada', 'luz no fim'],
  },
  {
    id: 4,
    typePosts: 'Triste',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Às vezes a tristeza vem tão quieta que nem percebo. Só sinto o peso. Hoje foi um desses dias.',
    imagem:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    video: false,
    data: new Date('2025-11-15T02:10:00'),
    likes: 156,
    comentarios: [
      {
        id: 1,
        autor: 'Camila Rocha',
        texto: 'Te entendo tanto... tá tudo bem não estar bem.',
      },
      {
        id: 2,
        autor: 'Thiago Oliveira',
        texto: 'Força, cara. Amanhã o sol nasce de novo.',
      },
    ],
    salvo: false,
    tags: ['tristeza', 'silêncio', 'peso'],
  },
  {
    id: 5,
    typePosts: 'Feliz',
    community: 'Momentos Bons',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'RI MUITO com meus amigos hoje. Fazia tempo que não sentia essa leveza na alma. Que dia abençoado!',
    imagem: undefined,
    video: true,
    data: new Date('2025-11-14T21:45:00'),
    likes: 389,
    comentarios: [
      { id: 1, autor: 'Gabriel Santos', texto: 'Aquele vídeo tá épico kkkkk' },
      { id: 2, autor: 'Letícia Mendes', texto: 'Sua risada é contagiante!' },
    ],
    salvo: true,
    tags: ['amigos', 'risada', 'leveza'],
  },
  {
    id: 6,
    typePosts: 'Ansioso',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Entrevista de emprego amanhã. Coração na boca desde ontem. Alguém tem dica pra controlar isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-13T23:59:00'),
    likes: 94,
    comentarios: [
      {
        id: 1,
        autor: 'Fernanda Dias',
        texto: 'Respira 4-7-8, funciona muito!',
      },
      { id: 2, autor: 'Renato Alves', texto: 'Você é foda, vai dar certo!' },
    ],
    salvo: false,
    tags: ['entrevista', 'ansiedade', 'medo'],
  },
  {
    id: 7,
    typePosts: 'Esperançoso',
    community: 'Recuperação',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Completei 30 dias sem crise forte. 30 dias. Parece pouco, mas pra mim é uma vida inteira.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-12T10:30:00'),
    likes: 678,
    comentarios: [
      { id: 1, autor: 'Vanessa Lima', texto: 'ISSO AÍ!!! Orgulho define!' },
      {
        id: 2,
        autor: 'Eduardo Nogueira',
        texto: '30 dias é só o começo, rei!',
      },
    ],
    salvo: true,
    tags: ['30dias', 'recuperação', 'orgulho'],
  },
  {
    id: 8,
    typePosts: 'Agradecido',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Minha terapeuta disse hoje: "Você já percorreu 80% do caminho". Chorei na sessão. Gratidão por estar vivo e lutando.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-10T16:20:00'),
    likes: 512,
    comentarios: [
      {
        id: 1,
        autor: 'Patrícia Gomes',
        texto: 'Que lindo, Carlos. Você merece tudo de bom.',
      },
      { id: 2, autor: 'Marcos Vinícius', texto: 'Terapia salva vidas mesmo.' },
    ],
    salvo: true,
    tags: ['terapia', 'gratidão', 'progresso'],
  },
  {
    id: 9,
    typePosts: 'Feliz',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Consegui meditar 15 minutos seguidos hoje! Eu, que não conseguia 2 minutos há 6 meses. Tô emocionado.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-08T07:55:00'),
    likes: 298,
    comentarios: [
      { id: 1, autor: 'Isabela Torres', texto: 'QUE ORGULHO!!!' },
      { id: 2, autor: 'Felipe Castro', texto: 'Evolução pura!' },
    ],
    salvo: false,
    tags: ['meditação', 'vitória', 'paz'],
  },
  {
    id: 10,
    typePosts: 'Triste',
    community: 'Luto',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Faz 1 ano que meu cachorro se foi. Ainda dói como se fosse ontem. Quem já perdeu um pet sabe...',
    imagem: 'https://images.unsplash.com/photo-1543466835-00a638f3e629?w=800',
    video: false,
    data: new Date('2025-11-05T00:30:00'),
    likes: 445,
    comentarios: [
      {
        id: 1,
        autor: 'Laura Mendes',
        texto: 'Eles nunca vão embora de verdade...',
      },
      {
        id: 2,
        autor: 'João Pedro',
        texto: 'Sinto sua dor, irmão. Abraço forte.',
      },
    ],
    salvo: true,
    tags: ['luto', 'pet', 'saudade'],
  },
  // ... (repetindo a estrutura com variações até 30 posts)
  // Pra não ficar gigante aqui, te dou mais 20 com diversidade:
  {
    id: 11,
    typePosts: 'Ansioso',
    conteudo:
      'Ataque de pânico no mercado hoje. Saí correndo. Vergonha e medo andam juntos.',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    likes: 78,
    comentarios: [],
    salvo: false,
    data: new Date('2025-11-04T15:20:00'),
    tags: ['pânico', 'vergonha'],
  },
  {
    id: 12,
    typePosts: 'Esperançoso',
    conteudo:
      'Li um livro inteiro essa semana. EU. Que não conseguia ler 2 páginas. Progresso real.',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    likes: 334,
    comentarios: [{ id: 1, autor: 'Renata', texto: 'Qual livro?? Quero ler!' }],
    salvo: true,
    data: new Date('2025-11-03T20:10:00'),
    tags: ['leitura', 'foco', 'progresso'],
  },
  {
    id: 1,
    typePosts: 'Ansioso',
    community: 'Ansiedade & Depressão',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Hoje a ansiedade apertou o peito logo cedo. Respirei fundo, contei até 10 várias vezes e consegui sair de casa. Pequenas vitórias importam.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-18T08:30:00'),
    likes: 87,
    comentarios: [
      {
        id: 1,
        autor: 'Ana Clara',
        texto: 'Você é forte demais, Carlos! Orgulho de te acompanhar aqui.',
      },
      {
        id: 2,
        autor: 'Lucas Mendes',
        texto: 'Passo a passo, irmão. Tamo junto!',
      },
    ],
    salvo: true,
    tags: ['ansiedade', 'respiro', 'vitória'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Acordei vivo. Tenho teto, comida, saúde razoável e pessoas que me amam mesmo nos meus piores dias. Isso já é tudo.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-17T19:15:00'),
    likes: 203,
    comentarios: [
      {
        id: 1,
        autor: 'Mariana Silva',
        texto: 'Gratidão muda tudo mesmo! Te amo por isso.',
      },
      { id: 2, autor: 'Pedro Costa', texto: 'Postura de rei, irmão!' },
    ],
    salvo: false,
    tags: ['gratidão', 'vida', 'simples'],
  },
  {
    id: 3,
    typePosts: 'Esperançoso',
    community: 'Crescimento Pessoal',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Pela primeira vez em muito tempo, acordei com um fio de esperança no peito. Como se amanhã pudesse ser um pouco melhor. Alguém mais já sentiu isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-16T14:22:00'),
    likes: 412,
    comentarios: [
      {
        id: 1,
        autor: 'Julia Ferreira',
        texto: 'Senti isso semana passada! É o começo da virada!',
      },
      {
        id: 2,
        autor: 'Rafael Lima',
        texto: 'Esse fio vira corda, depois escada. Acredita!',
      },
      {
        id: 3,
        autor: 'Beatriz Souza',
        texto: 'Chorando aqui de emoção por você.',
      },
    ],
    salvo: true,
    tags: ['esperança', 'virada', 'luz no fim'],
  },
  {
    id: 1,
    typePosts: 'Ansioso',
    community: 'Ansiedade & Depressão',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Hoje a ansiedade apertou o peito logo cedo. Respirei fundo, contei até 10 várias vezes e consegui sair de casa. Pequenas vitórias importam.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-18T08:30:00'),
    likes: 87,
    comentarios: [
      {
        id: 1,
        autor: 'Ana Clara',
        texto: 'Você é forte demais, Carlos! Orgulho de te acompanhar aqui.',
      },
      {
        id: 2,
        autor: 'Lucas Mendes',
        texto: 'Passo a passo, irmão. Tamo junto!',
      },
    ],
    salvo: true,
    tags: ['ansiedade', 'respiro', 'vitória'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Acordei vivo. Tenho teto, comida, saúde razoável e pessoas que me amam mesmo nos meus piores dias. Isso já é tudo.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-17T19:15:00'),
    likes: 203,
    comentarios: [
      {
        id: 1,
        autor: 'Mariana Silva',
        texto: 'Gratidão muda tudo mesmo! Te amo por isso.',
      },
      { id: 2, autor: 'Pedro Costa', texto: 'Postura de rei, irmão!' },
    ],
    salvo: false,
    tags: ['gratidão', 'vida', 'simples'],
  },
  {
    id: 3,
    typePosts: 'Esperançoso',
    community: 'Crescimento Pessoal',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Pela primeira vez em muito tempo, acordei com um fio de esperança no peito. Como se amanhã pudesse ser um pouco melhor. Alguém mais já sentiu isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-16T14:22:00'),
    likes: 412,
    comentarios: [
      {
        id: 1,
        autor: 'Julia Ferreira',
        texto: 'Senti isso semana passada! É o começo da virada!',
      },
      {
        id: 2,
        autor: 'Rafael Lima',
        texto: 'Esse fio vira corda, depois escada. Acredita!',
      },
      {
        id: 3,
        autor: 'Beatriz Souza',
        texto: 'Chorando aqui de emoção por você.',
      },
    ],
    salvo: true,
    tags: ['esperança', 'virada', 'luz no fim'],
  },
  {
    id: 4,
    typePosts: 'Triste',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Às vezes a tristeza vem tão quieta que nem percebo. Só sinto o peso. Hoje foi um desses dias.',
    imagem:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    video: false,
    data: new Date('2025-11-15T02:10:00'),
    likes: 156,
    comentarios: [
      {
        id: 1,
        autor: 'Camila Rocha',
        texto: 'Te entendo tanto... tá tudo bem não estar bem.',
      },
      {
        id: 2,
        autor: 'Thiago Oliveira',
        texto: 'Força, cara. Amanhã o sol nasce de novo.',
      },
    ],
    salvo: false,
    tags: ['tristeza', 'silêncio', 'peso'],
  },
  {
    id: 5,
    typePosts: 'Feliz',
    community: 'Momentos Bons',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'RI MUITO com meus amigos hoje. Fazia tempo que não sentia essa leveza na alma. Que dia abençoado!',
    imagem: undefined,
    video: true,
    data: new Date('2025-11-14T21:45:00'),
    likes: 389,
    comentarios: [
      { id: 1, autor: 'Gabriel Santos', texto: 'Aquele vídeo tá épico kkkkk' },
      { id: 2, autor: 'Letícia Mendes', texto: 'Sua risada é contagiante!' },
    ],
    salvo: true,
    tags: ['amigos', 'risada', 'leveza'],
  },
  {
    id: 6,
    typePosts: 'Ansioso',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Entrevista de emprego amanhã. Coração na boca desde ontem. Alguém tem dica pra controlar isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-13T23:59:00'),
    likes: 94,
    comentarios: [
      {
        id: 1,
        autor: 'Fernanda Dias',
        texto: 'Respira 4-7-8, funciona muito!',
      },
      { id: 2, autor: 'Renato Alves', texto: 'Você é foda, vai dar certo!' },
    ],
    salvo: false,
    tags: ['entrevista', 'ansiedade', 'medo'],
  },
  {
    id: 7,
    typePosts: 'Esperançoso',
    community: 'Recuperação',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Completei 30 dias sem crise forte. 30 dias. Parece pouco, mas pra mim é uma vida inteira.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-12T10:30:00'),
    likes: 678,
    comentarios: [
      { id: 1, autor: 'Vanessa Lima', texto: 'ISSO AÍ!!! Orgulho define!' },
      {
        id: 2,
        autor: 'Eduardo Nogueira',
        texto: '30 dias é só o começo, rei!',
      },
    ],
    salvo: true,
    tags: ['30dias', 'recuperação', 'orgulho'],
  },
  {
    id: 8,
    typePosts: 'Agradecido',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Minha terapeuta disse hoje: "Você já percorreu 80% do caminho". Chorei na sessão. Gratidão por estar vivo e lutando.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-10T16:20:00'),
    likes: 512,
    comentarios: [
      {
        id: 1,
        autor: 'Patrícia Gomes',
        texto: 'Que lindo, Carlos. Você merece tudo de bom.',
      },
      { id: 2, autor: 'Marcos Vinícius', texto: 'Terapia salva vidas mesmo.' },
    ],
    salvo: true,
    tags: ['terapia', 'gratidão', 'progresso'],
  },
  {
    id: 9,
    typePosts: 'Feliz',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Consegui meditar 15 minutos seguidos hoje! Eu, que não conseguia 2 minutos há 6 meses. Tô emocionado.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-08T07:55:00'),
    likes: 298,
    comentarios: [
      { id: 1, autor: 'Isabela Torres', texto: 'QUE ORGULHO!!!' },
      { id: 2, autor: 'Felipe Castro', texto: 'Evolução pura!' },
    ],
    salvo: false,
    tags: ['meditação', 'vitória', 'paz'],
  },
  {
    id: 10,
    typePosts: 'Triste',
    community: 'Luto',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Faz 1 ano que meu cachorro se foi. Ainda dói como se fosse ontem. Quem já perdeu um pet sabe...',
    imagem: 'https://images.unsplash.com/photo-1543466835-00a638f3e629?w=800',
    video: false,
    data: new Date('2025-11-05T00:30:00'),
    likes: 445,
    comentarios: [
      {
        id: 1,
        autor: 'Laura Mendes',
        texto: 'Eles nunca vão embora de verdade...',
      },
      {
        id: 2,
        autor: 'João Pedro',
        texto: 'Sinto sua dor, irmão. Abraço forte.',
      },
    ],
    salvo: true,
    tags: ['luto', 'pet', 'saudade'],
  },
  // ... (repetindo a estrutura com variações até 30 posts)
  // Pra não ficar gigante aqui, te dou mais 20 com diversidade:
  {
    id: 11,
    typePosts: 'Ansioso',
    conteudo:
      'Ataque de pânico no mercado hoje. Saí correndo. Vergonha e medo andam juntos.',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    likes: 78,
    comentarios: [],
    salvo: false,
    data: new Date('2025-11-04T15:20:00'),
    tags: ['pânico', 'vergonha'],
  },
  {
    id: 12,
    typePosts: 'Esperançoso',
    conteudo:
      'Li um livro inteiro essa semana. EU. Que não conseguia ler 2 páginas. Progresso real.',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    likes: 334,
    comentarios: [{ id: 1, autor: 'Renata', texto: 'Qual livro?? Quero ler!' }],
    salvo: true,
    data: new Date('2025-11-03T20:10:00'),
    tags: ['leitura', 'foco', 'progresso'],
  },
  {
    id: 1,
    typePosts: 'Ansioso',
    community: 'Ansiedade & Depressão',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Hoje a ansiedade apertou o peito logo cedo. Respirei fundo, contei até 10 várias vezes e consegui sair de casa. Pequenas vitórias importam.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-18T08:30:00'),
    likes: 87,
    comentarios: [
      {
        id: 1,
        autor: 'Ana Clara',
        texto: 'Você é forte demais, Carlos! Orgulho de te acompanhar aqui.',
      },
      {
        id: 2,
        autor: 'Lucas Mendes',
        texto: 'Passo a passo, irmão. Tamo junto!',
      },
    ],
    salvo: true,
    tags: ['ansiedade', 'respiro', 'vitória'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Acordei vivo. Tenho teto, comida, saúde razoável e pessoas que me amam mesmo nos meus piores dias. Isso já é tudo.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-17T19:15:00'),
    likes: 203,
    comentarios: [
      {
        id: 1,
        autor: 'Mariana Silva',
        texto: 'Gratidão muda tudo mesmo! Te amo por isso.',
      },
      { id: 2, autor: 'Pedro Costa', texto: 'Postura de rei, irmão!' },
    ],
    salvo: false,
    tags: ['gratidão', 'vida', 'simples'],
  },
  {
    id: 3,
    typePosts: 'Esperançoso',
    community: 'Crescimento Pessoal',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Pela primeira vez em muito tempo, acordei com um fio de esperança no peito. Como se amanhã pudesse ser um pouco melhor. Alguém mais já sentiu isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-16T14:22:00'),
    likes: 412,
    comentarios: [
      {
        id: 1,
        autor: 'Julia Ferreira',
        texto: 'Senti isso semana passada! É o começo da virada!',
      },
      {
        id: 2,
        autor: 'Rafael Lima',
        texto: 'Esse fio vira corda, depois escada. Acredita!',
      },
      {
        id: 3,
        autor: 'Beatriz Souza',
        texto: 'Chorando aqui de emoção por você.',
      },
    ],
    salvo: true,
    tags: ['esperança', 'virada', 'luz no fim'],
  },
  {
    id: 1,
    typePosts: 'Ansioso',
    community: 'Ansiedade & Depressão',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Hoje a ansiedade apertou o peito logo cedo. Respirei fundo, contei até 10 várias vezes e consegui sair de casa. Pequenas vitórias importam.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-18T08:30:00'),
    likes: 87,
    comentarios: [
      {
        id: 1,
        autor: 'Ana Clara',
        texto: 'Você é forte demais, Carlos! Orgulho de te acompanhar aqui.',
      },
      {
        id: 2,
        autor: 'Lucas Mendes',
        texto: 'Passo a passo, irmão. Tamo junto!',
      },
    ],
    salvo: true,
    tags: ['ansiedade', 'respiro', 'vitória'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Acordei vivo. Tenho teto, comida, saúde razoável e pessoas que me amam mesmo nos meus piores dias. Isso já é tudo.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-17T19:15:00'),
    likes: 203,
    comentarios: [
      {
        id: 1,
        autor: 'Mariana Silva',
        texto: 'Gratidão muda tudo mesmo! Te amo por isso.',
      },
      { id: 2, autor: 'Pedro Costa', texto: 'Postura de rei, irmão!' },
    ],
    salvo: false,
    tags: ['gratidão', 'vida', 'simples'],
  },
  {
    id: 3,
    typePosts: 'Esperançoso',
    community: 'Crescimento Pessoal',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Pela primeira vez em muito tempo, acordei com um fio de esperança no peito. Como se amanhã pudesse ser um pouco melhor. Alguém mais já sentiu isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-16T14:22:00'),
    likes: 412,
    comentarios: [
      {
        id: 1,
        autor: 'Julia Ferreira',
        texto: 'Senti isso semana passada! É o começo da virada!',
      },
      {
        id: 2,
        autor: 'Rafael Lima',
        texto: 'Esse fio vira corda, depois escada. Acredita!',
      },
      {
        id: 3,
        autor: 'Beatriz Souza',
        texto: 'Chorando aqui de emoção por você.',
      },
    ],
    salvo: true,
    tags: ['esperança', 'virada', 'luz no fim'],
  },
  {
    id: 4,
    typePosts: 'Triste',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Às vezes a tristeza vem tão quieta que nem percebo. Só sinto o peso. Hoje foi um desses dias.',
    imagem:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    video: false,
    data: new Date('2025-11-15T02:10:00'),
    likes: 156,
    comentarios: [
      {
        id: 1,
        autor: 'Camila Rocha',
        texto: 'Te entendo tanto... tá tudo bem não estar bem.',
      },
      {
        id: 2,
        autor: 'Thiago Oliveira',
        texto: 'Força, cara. Amanhã o sol nasce de novo.',
      },
    ],
    salvo: false,
    tags: ['tristeza', 'silêncio', 'peso'],
  },
  {
    id: 5,
    typePosts: 'Feliz',
    community: 'Momentos Bons',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'RI MUITO com meus amigos hoje. Fazia tempo que não sentia essa leveza na alma. Que dia abençoado!',
    imagem: undefined,
    video: true,
    data: new Date('2025-11-14T21:45:00'),
    likes: 389,
    comentarios: [
      { id: 1, autor: 'Gabriel Santos', texto: 'Aquele vídeo tá épico kkkkk' },
      { id: 2, autor: 'Letícia Mendes', texto: 'Sua risada é contagiante!' },
    ],
    salvo: true,
    tags: ['amigos', 'risada', 'leveza'],
  },
  {
    id: 6,
    typePosts: 'Ansioso',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Entrevista de emprego amanhã. Coração na boca desde ontem. Alguém tem dica pra controlar isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-13T23:59:00'),
    likes: 94,
    comentarios: [
      {
        id: 1,
        autor: 'Fernanda Dias',
        texto: 'Respira 4-7-8, funciona muito!',
      },
      { id: 2, autor: 'Renato Alves', texto: 'Você é foda, vai dar certo!' },
    ],
    salvo: false,
    tags: ['entrevista', 'ansiedade', 'medo'],
  },
  {
    id: 7,
    typePosts: 'Esperançoso',
    community: 'Recuperação',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Completei 30 dias sem crise forte. 30 dias. Parece pouco, mas pra mim é uma vida inteira.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-12T10:30:00'),
    likes: 678,
    comentarios: [
      { id: 1, autor: 'Vanessa Lima', texto: 'ISSO AÍ!!! Orgulho define!' },
      {
        id: 2,
        autor: 'Eduardo Nogueira',
        texto: '30 dias é só o começo, rei!',
      },
    ],
    salvo: true,
    tags: ['30dias', 'recuperação', 'orgulho'],
  },
  {
    id: 8,
    typePosts: 'Agradecido',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Minha terapeuta disse hoje: "Você já percorreu 80% do caminho". Chorei na sessão. Gratidão por estar vivo e lutando.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-10T16:20:00'),
    likes: 512,
    comentarios: [
      {
        id: 1,
        autor: 'Patrícia Gomes',
        texto: 'Que lindo, Carlos. Você merece tudo de bom.',
      },
      { id: 2, autor: 'Marcos Vinícius', texto: 'Terapia salva vidas mesmo.' },
    ],
    salvo: true,
    tags: ['terapia', 'gratidão', 'progresso'],
  },
  {
    id: 9,
    typePosts: 'Feliz',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Consegui meditar 15 minutos seguidos hoje! Eu, que não conseguia 2 minutos há 6 meses. Tô emocionado.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-08T07:55:00'),
    likes: 298,
    comentarios: [
      { id: 1, autor: 'Isabela Torres', texto: 'QUE ORGULHO!!!' },
      { id: 2, autor: 'Felipe Castro', texto: 'Evolução pura!' },
    ],
    salvo: false,
    tags: ['meditação', 'vitória', 'paz'],
  },
  {
    id: 10,
    typePosts: 'Triste',
    community: 'Luto',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Faz 1 ano que meu cachorro se foi. Ainda dói como se fosse ontem. Quem já perdeu um pet sabe...',
    imagem: 'https://images.unsplash.com/photo-1543466835-00a638f3e629?w=800',
    video: false,
    data: new Date('2025-11-05T00:30:00'),
    likes: 445,
    comentarios: [
      {
        id: 1,
        autor: 'Laura Mendes',
        texto: 'Eles nunca vão embora de verdade...',
      },
      {
        id: 2,
        autor: 'João Pedro',
        texto: 'Sinto sua dor, irmão. Abraço forte.',
      },
    ],
    salvo: true,
    tags: ['luto', 'pet', 'saudade'],
  },
  // ... (repetindo a estrutura com variações até 30 posts)
  // Pra não ficar gigante aqui, te dou mais 20 com diversidade:
  {
    id: 11,
    typePosts: 'Ansioso',
    conteudo:
      'Ataque de pânico no mercado hoje. Saí correndo. Vergonha e medo andam juntos.',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    likes: 78,
    comentarios: [],
    salvo: false,
    data: new Date('2025-11-04T15:20:00'),
    tags: ['pânico', 'vergonha'],
  },
  {
    id: 12,
    typePosts: 'Esperançoso',
    conteudo:
      'Li um livro inteiro essa semana. EU. Que não conseguia ler 2 páginas. Progresso real.',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    likes: 334,
    comentarios: [{ id: 1, autor: 'Renata', texto: 'Qual livro?? Quero ler!' }],
    salvo: true,
    data: new Date('2025-11-03T20:10:00'),
    tags: ['leitura', 'foco', 'progresso'],
  },
  {
    id: 1,
    typePosts: 'Ansioso',
    community: 'Ansiedade & Depressão',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Hoje a ansiedade apertou o peito logo cedo. Respirei fundo, contei até 10 várias vezes e consegui sair de casa. Pequenas vitórias importam.',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-18T08:30:00'),
    likes: 87,
    comentarios: [
      {
        id: 1,
        autor: 'Ana Clara',
        texto: 'Você é forte demais, Carlos! Orgulho de te acompanhar aqui.',
      },
      {
        id: 2,
        autor: 'Lucas Mendes',
        texto: 'Passo a passo, irmão. Tamo junto!',
      },
    ],
    salvo: true,
    tags: ['ansiedade', 'respiro', 'vitória'],
  },
  {
    id: 2,
    typePosts: 'Agradecido',
    community: undefined,
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Acordei vivo. Tenho teto, comida, saúde razoável e pessoas que me amam mesmo nos meus piores dias. Isso já é tudo.',
    imagem:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    video: false,
    data: new Date('2025-11-17T19:15:00'),
    likes: 203,
    comentarios: [
      {
        id: 1,
        autor: 'Mariana Silva',
        texto: 'Gratidão muda tudo mesmo! Te amo por isso.',
      },
      { id: 2, autor: 'Pedro Costa', texto: 'Postura de rei, irmão!' },
    ],
    salvo: false,
    tags: ['gratidão', 'vida', 'simples'],
  },
  {
    id: 3,
    typePosts: 'Esperançoso',
    community: 'Crescimento Pessoal',
    autor: 'Carlos Almeida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    friend: true,
    conteudo:
      'Pela primeira vez em muito tempo, acordei com um fio de esperança no peito. Como se amanhã pudesse ser um pouco melhor. Alguém mais já sentiu isso?',
    imagem: undefined,
    video: false,
    data: new Date('2025-11-16T14:22:00'),
    likes: 412,
    comentarios: [
      {
        id: 1,
        autor: 'Julia Ferreira',
        texto: 'Senti isso semana passada! É o começo da virada!',
      },
      {
        id: 2,
        autor: 'Rafael Lima',
        texto: 'Esse fio vira corda, depois escada. Acredita!',
      },
      {
        id: 3,
        autor: 'Beatriz Souza',
        texto: 'Chorando aqui de emoção por você.',
      },
    ],
    salvo: true,
    tags: ['esperança', 'virada', 'luz no fim'],
  },
]

const euUsuario = false

const PerfilUsuario = () => {
  const { id } = useParams()
  const [visibleCount, setVisibleCount] = useState(10)
  const [loadedCount, setLoadedCount] = useState(10)
  const [posts, setPosts] = useState<Post[]>(postsFicticiosGlobal)
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

  return (
    <div className="mb-4 mt-12 min-h-screen w-[99vw] overflow-hidden px-0.5 md:w-[calc(100vw-20rem)] xl:px-5 2xl:w-full">
      {/* Header do Perfil */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="from-purple-50/60 via-white to-pink-50/40 px-5 pb-10 pt-8"
      >
        <div>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end">
            {/* Avatar com hover de edição */}
            <div className="flex flex-col items-center">
              <div className="group relative">
                <Avatar className="h-28 w-28 shadow-2xl ring-4 ring-white sm:h-32 sm:w-32">
                  <AvatarImage
                    src="https://i.pravatar.cc/300"
                    alt="Carlos Almeida"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-3xl font-bold text-white">
                    CA
                  </AvatarFallback>
                </Avatar>
                {euUsuario && (
                  <NavLink to="config">
                    <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
                      <Edit2 className="h-8 w-8 text-white" />{' '}
                      <p className="text-white">Editar</p>
                    </div>
                  </NavLink>
                )}
              </div>

              {euUsuario ? (
                <div className="mt-2">
                  <NavLink to="config">
                    <Button className="cursor-pointer select-none rounded-lg bg-white text-sm font-medium text-gray-700 shadow-md backdrop-blur-sm transition-all duration-700 hover:scale-[105%] hover:bg-white/80 hover:text-[#6b4de6] hover:shadow-lg">
                      Configurações
                    </Button>
                  </NavLink>
                </div>
              ) : (
                <BlockedConfirmDialog />
              )}
            </div>

            {/* Info do usuário */}
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Carlos Almeida {id}
              </h1>
              <p className="text-lg font-medium text-purple-600">
                @carlosalmeida
              </p>
              <p className="mt-2 text-gray-600">
                Aqui compartilho minha jornada com a ansiedade e o crescimento
                pessoal
              </p>

              {/* Stats */}
              <div className="mt-5 flex gap-8 text-sm">
                <FriendsDialog euUsuario={euUsuario} />
                <FollowersDialog euUsuario={euUsuario} />
              </div>
            </div>
            {!euUsuario && (
              <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                {/* Botão de Reportar — versão mais leve */}
                <ReportDialog />
                {/* Seguir */}
                <Button className="bg-linear-purple rounded-full px-8 font-semibold shadow-md hover:shadow-lg">
                  Seguir
                </Button>
                {/* Mensagem */}
                <NavLink to={`/mensagens/1`}>
                  <Button
                    variant="outline"
                    className="rounded-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    Mensagem
                  </Button>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </motion.header>
      <Separator className="mb-4" />
      {/* Feed de Posts - Um abaixo do outro */}
      <main className="">
        <div className="flex flex-col space-y-24">
          {posts.slice(0, visibleCount).map((post, index) => {
            const isLoaded = index < loadedCount
            return (
              <motion.div
                key={post.id + '-' + index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: isLoaded ? index * 0.05 : 0,
                  duration: 0.4,
                }}
              >
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
              </motion.div>
            )
          })}

          {visibleCount < posts.length && (
            <div ref={loadMoreRef} className="col-span-2 h-10" />
          )}
        </div>
      </main>
    </div>
  )
}

export default PerfilUsuario
