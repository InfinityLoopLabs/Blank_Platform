import { useEffect, useMemo, useRef, useState } from 'react'
import { v4 } from 'uuid'
import { generateRandomValue } from './generateRandomValue.ts'
import { DataItemType, FieldsDefinitionType } from './types.ts'

export type SortOrderType = 'ASC' | 'DESC'

export type UseMockDataPropsType<Fields extends FieldsDefinitionType> = {
  fields: Fields
  page: number
  pageSize: number
  searchText?: string | null
  sortKey?: keyof Fields | null
  sortOrder?: SortOrderType | null
  storageKey: string
}

/**
 * Хук `useMockData` позволяет работать с данными, которые могут быть:
 * - Загружены из localStorage, если они уже сохранены,
 * - Сгенерированы случайно, если данных в localStorage нет.
 *
 * Хук поддерживает:
 * - Добавление, изменение и удаление элементов данных.
 * - Фильтрацию данных по поисковому запросу.
 * - Сортировку данных по заданному ключу и порядку.
 * - Пагинацию данных.
 *
 * @template Fields Определяет тип полей данных, передаваемый в хук.
 *
 * @param {UseMockDataPropsType<Fields>} props - Объект с параметрами хука:
 *
 * @param {Fields} props.fields - Поля данных, каждое из которых определяет название и тип ('string', 'number', 'boolean', 'Date').
 * @param {number} props.page - Номер текущей страницы пагинации.
 * @param {number} props.pageSize - Количество элементов на странице.
 * @param {string} props.searchText - Поисковый запрос для фильтрации данных.
 * @param {keyof Fields | null} props.sortKey - Ключ для сортировки данных. Если `null`, сортировка не применяется.
 * @param {SortOrderType} props.sortOrder - Порядок сортировки данных: 'ASC' или 'DESC'.
 * @param {string} props.storageKey - Ключ для хранения данных в localStorage.
 *
 * @returns {Object} Возвращает объект с данными и функциями управления:
 * @returns {DataItemType<Fields>[]} data - Массив отфильтрованных, отсортированных и пагинированных данных.
 * @returns {boolean} isLoading - Состояние загрузки данных.
 * @returns {number} totalDataLength - Общее количество данных после фильтрации (для информации о количестве страниц).
 * @returns {() => void} onAddDataHandler - Функция для добавления нового элемента данных.
 * @returns {(id: string, updatedItem: Partial<Omit<DataItemType<Fields>, 'id'>>) => void} onChangeDataByIdHandler - Функция для изменения элемента данных по id.
 * @returns {(id: string) => void} onDeleteDataByIdHandler - Функция для удаления элемента данных по id.
 *
 * @example
 * const fields = {
 *   name: 'string',
 *   age: 'number',
 *   isActive: 'boolean',
 *   createdAt: 'Date',
 * };
 *
 * const {
 *   data,
 *   isLoading,
 *   totalDataLength,
 *   onAddDataHandler,
 *   onChangeDataByIdHandler,
 *   onDeleteDataByIdHandler,
 * } = useMockData({
 *   fields,
 *   page: 1,
 *   pageSize: 10,
 *   searchText: '',
 *   sortKey: 'age',
 *   sortOrder: 'ASC',
 *   storageKey: 'myDataStorageKey',
 * });
 */
export const useMockData = <Fields extends FieldsDefinitionType>({
  fields,
  page,
  pageSize,
  searchText,
  sortKey,
  sortOrder,
  storageKey,
}: UseMockDataPropsType<Fields>) => {
  // Симуляция загрузки данных: Начало
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const timeoutId = useRef<NodeJS.Timeout>(undefined)

  useEffect(() => {
    timeoutId.current = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => {
      clearTimeout(timeoutId.current)
    }
  }, [])
  // Симуляция загрузки данных: Конец

  // Функция генерации случайного объекта данных
  const generateRandomDataItem = (): DataItemType<Fields> => {
    const item: any = { id: v4() }
    for (const key in fields) {
      const fieldType = fields[key]
      item[key] = generateRandomValue(fieldType)
    }

    return item as DataItemType<Fields>
  }

  // Загрузка данных из localStorage или генерация новых данных
  const [data, setData] = useState<DataItemType<Fields>[]>(() => {
    const storedData = localStorage.getItem(storageKey)
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        // Проверяем, что данные соответствуют ожидаемому формату
        if (Array.isArray(parsedData)) {
          // Преобразуем строки дат обратно в объекты Date
          return parsedData.map((item: any) => {
            for (const key in fields) {
              if (fields[key] === 'Date' && item[key]) {
                item[key] = new Date(item[key])
              }
            }

            return item
          })
        }
      } catch (error) {
        console.error('Ошибка при разборе данных из localStorage:', error)
      }
    }

    // Если данных нет или произошла ошибка, генерируем новые
    return Array.from({ length: 30 }, generateRandomDataItem)
  })

  // Сохранение данных в localStorage при изменении данных
  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(
        data.map(item => ({
          ...item,
          // Преобразуем объекты Date в строки
          ...Object.fromEntries(
            Object.entries(item).map(([key, value]) => [
              key,
              value instanceof Date ? value.toISOString() : value,
            ]),
          ),
        })),
      ),
    )
  }, [data, storageKey])

  // Обработчик добавления нового элемента данных
  const onAddDataHandler = () => {
    const newDataItem = generateRandomDataItem()
    setData(prevData => {
      const updatedData = [...prevData, newDataItem]

      return updatedData
    })
  }

  // Обработчик изменения элемента данных по id
  const onChangeDataByIdHandler = (
    id: string,
    updatedItem: Partial<Omit<DataItemType<Fields>, 'id'>>,
  ) => {
    setData(prevData => {
      const updatedData = prevData.map(item =>
        item.id === id
          ? {
              ...item,
              ...updatedItem,
            }
          : item,
      )

      return updatedData
    })
  }

  // Обработчик удаления элемента данных по id
  const onDeleteDataByIdHandler = (id: string) => {
    setData(prevData => {
      const updatedData = prevData.filter(item => item.id !== id)

      return updatedData
    })
  }

  // Фильтрация данных по поисковому запросу (используем searchText из пропсов)
  const filteredData = useMemo(() => {
    if (!searchText) {
      return data
    }

    return data.filter(item =>
      Object.keys(fields).some(key => {
        const value = item[key as keyof DataItemType<Fields>]
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          return value
            .toString()
            .toLowerCase()
            .includes(searchText.toLowerCase())
        } else if (value instanceof Date) {
          return value
            .toISOString()
            .toLowerCase()
            .includes(searchText.toLowerCase())
        }

        return false
      }),
    )
  }, [data, searchText, fields])

  // Сортировка данных по ключу и порядку сортировки
  const sortedData = useMemo(() => {
    if (!sortKey) {
      return filteredData
    }

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (aValue < bValue) {
        return sortOrder === 'ASC' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortOrder === 'ASC' ? 1 : -1
      }

      return 0
    })
  }, [filteredData, sortKey, sortOrder])

  // Пагинация данных
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize

    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, page, pageSize])

  // Общая длина данных после фильтрации (для информации о количестве страниц)
  const totalDataLength = filteredData.length

  return {
    data: paginatedData,
    isLoading,
    totalDataLength, // Возвращаем общую длину данных
    onAddDataHandler,
    onChangeDataByIdHandler,
    onDeleteDataByIdHandler,
  }
}
