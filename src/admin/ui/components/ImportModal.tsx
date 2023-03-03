import { AdminService } from '@/admin/services/admin.service'
import Modal from '@/shared/ui/components/Modal'
import React, { ReactElement, useState } from 'react'
import { toast } from 'react-toastify'

type ImportObject = 'user' | 'vehicle'

interface ImportExcelProps {
  close: () => void
  refreshList: (data: any) => void
  type: ImportObject
  toastId: string
}

const ImportExcel = ({ close, refreshList, toastId, type }: ImportExcelProps): ReactElement => {
  const adminService = new AdminService()
  const [file, setFile] = useState<File | null | undefined>(null)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (file === null || file === undefined) {
      setError('No se ha subido nigún archivo')
      toast('No se ha subido nigún archivo', { toastId, type: 'error' })
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('excel-file', file)

    const importExcelFunction = type === 'user' ? adminService.importUserExcel : adminService.importVehicleExcel

    void importExcelFunction(formData)
      .then(response => {
        refreshList(response)
        setIsLoading(false)
        toast('La información se importó correctamente', { toastId, type: 'success' })
        close()
      })
      .catch(error => {
        const { message } = error.data
        setIsLoading(false)
        setError(message)
        toast(message, { toastId, type: 'error' })
      })
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.item(0)

    if (file) {
      const { name } = file
      const lastDot = name.lastIndexOf('.')
      const ext = name.substring(lastDot + 1)

      if (!['xlsx', 'xlsm', 'xls', 'xlt', 'xlsb'].includes(ext)) {
        setError('El archivo no tiene la extension correcta')
        toast('El archivo no tiene la extension correcta', { toastId, type: 'error' })
        event.target.value = ''
        return
      } else {
        setError('')
      }
    }

    setFile(file)
  }

  return (
    <Modal>
      <div className='p-5'>
        {isLoading && (
          <div className='bg-gray-light absolute top-0 left-0 w-full h-full rounded-xl after:absolute after:w-10 after:h-10 after:top-0 after:right-0 after:left-0 after:bottom-0 after:m-auto after:border-8 after:border-t-white after:opacity-100 after:rounded-[50%] after:animate-spin'>
          </div>
        )}
        <h1 className='block uppercase text-center text-xl font-bold'>Importar excel</h1>
        <form onSubmit={handleSubmit}>
          <div className='mt-5'>
            <input onChange={onChange} type="file" accept='.xlsx,.xlsm,.xls,.xlt,.xlsb' />
            <p className='m-0 mt-1 text-red'>{error}</p>
          </div>

          <div className='mt-5 flex gap-3 justify-center'>
            <button className='bg-black text-white px-5 py-1 rounded-lg text-lg' type='button' onClick={close}>Cancelar</button>
            <button className={'relative bg-red text-white px-5 py-1 rounded-lg text-lg'} type='submit'>Importar</button>
          </div>
        </form>
      </div>

    </Modal>
  )
}

export default ImportExcel
