import React, { ReactElement } from 'react'

interface ModalProp {
  children?: React.ReactNode
}

const Modal = ({ children }: ModalProp): ReactElement => {
  return (
  // <div class="modal" v-if="handleUploadImage">
  //   <div class="modal__content">
  //     <h1>Upload your image</h1>

  //     <div class="modal__actions">
  //     </div>
  //   </div>
  // </div>

    <div className="fixed top-0 left-0 w-full h-full bg-light-grey grid place-items-center z-[100]">
      <div className="bg-white p-5 rounded-xl flex flex-column items-center justify-center">
        { children }
      </div>
    </div>
  )
}

export default Modal
