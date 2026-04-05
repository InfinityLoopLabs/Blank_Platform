import { useAppSelector } from '@hooks/useAppSelector'

export function meta() {
  return [
    { title: 'New React Router App' },
    {
      name: 'description',
      content: 'Welcome to React Router!',
    },
  ]
}

export default function Home() {
  const { appSize, isMobile, screenFlags } = useAppSelector(
    state => state.appSize,
  )

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-semibold">Главная</h1>
      <p className="mt-4">Текущая ширина страницы из appSize:</p>
      <p className="mt-1 text-xl font-bold">
        {appSize.innerWidth ?? '-'} px (innerWidth)
      </p>
      <p className="mt-1">
        clientWidth: <b>{appSize.clientWidth ?? '-'}</b> px
      </p>
      <p className="mt-1">
        isMobile: <b>{String(isMobile)}</b>
      </p>
      <p className="mt-1">
        screenFlags: <b>{JSON.stringify(screenFlags)}</b>
      </p>
    </main>
  )
}
