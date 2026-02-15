import { FC, useEffect } from 'react'

type DataTupleType<T = {}> = [T, (data: T) => void]

type OwnPropertyType = {
  dataTuple: Array<DataTupleType<unknown>>
}

/**
 * Компонент LoadDataFromRoot
 *
 * @description
 * Этот компонент принимает данные из корневого микрофронтенда и колбеки для сохранения в стейт-менеджер.
 * Он используется для передачи данных между микрофронтендами и обновления состояния в дочерних приложениях.
 *
 * @param {Array<DataTupleType<unknown>>} dataTuple - Массив кортежей, содержащих данные и функции для их обновления
 *
 */
export const LoadDataFromRoot: FC<OwnPropertyType> = ({ dataTuple }) => {
  useEffect(() => {
    dataTuple?.forEach(([data, setData]) => {
      setData(data)
    })
  }, [dataTuple])

  return null
}
