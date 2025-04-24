'use client'

import { ReactNode } from 'react'

interface DialogProps {
    trigger: ReactNode
    children: ReactNode
    open: boolean
    onClose: () => void
}

export default function Dialog({ trigger, children, open, onClose }: DialogProps) {
    return (
        <>
            {trigger}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl relative">
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black"
                        >
                            &times;
                        </button>
                        {children}
                    </div>
                </div>
            )}
        </>
    )
}