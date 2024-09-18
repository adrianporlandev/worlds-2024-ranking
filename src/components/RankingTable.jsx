import React, { useState } from 'react';

const RankingTable = ({ ranking }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedRanking = [...ranking].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key].toLowerCase();
      const bValue = b[sortConfig.key].toLowerCase();

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  return (
    <div className="max-w-screen-lg mx-auto mt-5 px-4">
      <h2 className="text-center text-2xl font-bold mb-4">Ranking de Jugadores</h2>
      <div className="overflow-x-auto"> {/* Desplazamiento horizontal si es necesario */}
        <table className=" bg-white shadow-md rounded-lg overflow-hidden mx-auto">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/12 py-2">#</th>
              <th className="w-2/12 py-2">Jugador</th>
              <th className="w-1/12 py-2">Rol</th>
              <th className="w-2/12 py-2">Nombre de Invocador</th>
              <th className="w-2/12 py-2">ELO</th>
              <th className="w-1/12 py-2">WR</th>
              <th className="w-1/12 py-2">Games</th>
              <th className="w-2/12 py-2">Equipo</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700">
            {sortedRanking.length > 0 ? (
              sortedRanking.map((player, index) => (
                <tr key={index} className="border-b border-black hover:bg-gray-600">
                  <td className="py-2 text-center">{index + 1}</td>
                  <td className="py-2 text-center">
                    <a href={`/players/${player.realname}`} className="hover:underline">
                      {player.realname}
                    </a>
                  </td>
                  <td className="py-2 text-center">
                    <img
                      src={`https://res.cloudinary.com/dlfgycfb8/image/upload/v1724868748/lol-project/pos/${player.role}.png`}
                      alt={player.elo.tier}
                      className="inline-block w-8 h-8 mr-2"
                    />
                  </td>
                  <td className="py-2 text-center">
                    <a
                      href={`https://www.op.gg/summoners/euw/${player.name}-${player.tag}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {player.name}
                    </a>
                  </td>
                  <td className="py-2 text-center">
                    <img
                      src={`https://res.cloudinary.com/dlfgycfb8/image/upload/v1724868748/lol-project/elo/${player.elo.tier}.png`}
                      alt={player.elo.tier}
                      className="inline-block w-8 h-8 mr-2"
                    />
                    {player.elo.tier}
                    {['CHALLENGER', 'GRANDMASTER', 'MASTER'].includes(player.elo.tier)
                      ? ''
                      : ` ${player.elo.rank}`}
                    {' '}
                    {player.elo.leaguePoints} LP
                  </td>
                  <td className="py-2 text-center">{player.elo.winrate.toFixed(0)}%</td>
                  <td className="py-2 text-center">{player.elo.totalGames}</td>
                  <td className="py-2 text-center">
                    <a href={`/teams/${player.team}`} className="inline-block">
                      <img
                        src={`https://res.cloudinary.com/dlfgycfb8/image/upload/v1724868397/lol-project/teams/${player.team}.webp`}
                        alt={player.team}
                        className="inline-block w-8 h-8 mr-2"
                      />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center">
                  Cargando datos...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingTable;
