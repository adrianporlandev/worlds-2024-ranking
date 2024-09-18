import React, { useState } from 'react';
import { playersname } from '../data/players';

export default function SearchPlayer() {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  }

  const onSearch = (event) => {
    event.preventDefault();  // Previene el comportamiento por defecto del submit
    if (value.trim()) {  // Verifica que no esté vacío
      // Redirige a la página del jugador utilizando la URL compatible con Astro
      window.location.href = `/players/${value.trim().toLowerCase()}`;
    }
  }

  return (
    <div className="Search">
     

      <form className="w-full max-w-sm space-y-2" onSubmit={onSearch}>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Buscar jugador pro"
            className="w-full px-3 py-2 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={value}
            onChange={onChange}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Icon name="search" className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Dropdown de sugerencias */}
      <div className="dropdown mt-2">
        {playersname
          .filter((item) => {
            const searchTerm = value.toLowerCase();
            const playerName = item.name.toLowerCase();

            return searchTerm && playerName.startsWith(searchTerm) && playerName !== searchTerm;
          })
          .map((item) => (
            <div
              onClick={() => setValue(item.name)}
              className="dropdown-row px-3 py-2 bg-gray-700 text-white rounded-md cursor-pointer hover:bg-gray-600"
              key={item.name}
            >
              {item.name}
            </div>
          ))}
      </div>
    </div>
  );
}

function Icon({ name, className }) {
  // Ícono genérico de búsqueda con SVG
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.293 16.293l-3.82-3.82A7.962 7.962 0 0016 8a8 8 0 10-8 8 7.962 7.962 0 004.473-1.527l3.82 3.82a1 1 0 001.415-1.415zM8 14a6 6 0 110-12 6 6 0 010 12z" />
    </svg>
  );
}
