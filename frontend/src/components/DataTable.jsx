import React, { useState } from 'react';
// Change this import to match the correct version
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';



const DataTable = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter(item =>        
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.age.toString().includes(searchTerm)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePagination = direction => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className='flex flex-col '>
            <input
                type="text"
                placeholder="Search"
                className="border rounded-md py-2 px-4 mb-4"
                onChange={e => setSearchTerm(e.target.value)}
            />
            <table className="w-full  border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Age</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(item => (
                        <tr key={item.id}>
                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => handlePagination('prev')}
                    disabled={currentPage === 1}
                    className="text-gray-600 hover:text-gray-800"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handlePagination('next')}
                    disabled={currentPage === totalPages}
                    className="text-gray-600 hover:text-gray-800"
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default DataTable;
