import React from 'react'

const InputBox = ({label, type, name, id, value}) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="font-semibold text-lg ">{label}</label>
            <input type={type} id={id} name={name} className=" w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none" />
        </div>
    )
}

export default InputBox