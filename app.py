from flask import Flask, jsonify
import requests
import json
from apscheduler.schedulers.background import BackgroundScheduler
import os
from dotenv import load_dotenv
from players import players

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv('API_KEY')


def get_puuid(summoner_name, tag):
    try:
        url = f"https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{summoner_name}/{tag}?api_key={API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json().get('puuid')
    except requests.RequestException as e:
        print(f"Error obteniendo PUUID para {summoner_name}: {e}")
        return None

def get_summoner_id(puuid):
    try:
        url = f"https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}?api_key={API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json().get('id')
    except requests.RequestException as e:
        print(f"Error obteniendo Summoner ID para PUUID {puuid}: {e}")
        return None



def get_elo(summoner_id):
    try:
        url = f"https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/{summoner_id}?api_key={API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        ranked_data = next((queue for queue in data if queue['queueType'] == 'RANKED_SOLO_5x5'), None)
        if ranked_data:
            wins = ranked_data['wins']
            losses = ranked_data['losses']
            total_games = wins + losses
            winrate = (wins / total_games) * 100 if total_games > 0 else 0
            return {
                "tier": ranked_data['tier'],
                "rank": ranked_data['rank'],
                "leaguePoints": ranked_data['leaguePoints'],
                "wins": wins,
                "losses": losses,
                "winrate": winrate,
                "totalGames": total_games
            }
        return None
    except requests.RequestException as e:
        print(f"Error obteniendo ELO para Summoner ID {summoner_id}: {e}")
        return None

# Nueva función para verificar si el jugador está en partida
def is_in_game(encrypted_puuid):
    try:
        url = f"https://euw1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/{encrypted_puuid}?api_key={API_KEY}"
        response = requests.get(url)
        
        if response.status_code == 200:
            return True
        elif response.status_code == 404:
            return False
        else:
            print("Error al verificar el estado de la partida:", response.status_code)
            return None
    except requests.RequestException as e:
        print(f"Error verificando partida para PUUID {encrypted_puuid}: {e}")
        return None

def update_ranking():
    updated_players = []
    for player in players:
        puuid = get_puuid(player['name'], player['tag'])
        if not puuid:
            updated_players.append({**player, "elo": None, "in_game": False})
            continue

        summoner_id = get_summoner_id(puuid)
        if not summoner_id:
            updated_players.append({**player, "elo": None, "in_game": False})
            continue

        elo = get_elo(summoner_id)
        in_game = is_in_game(puuid)  # Verificar si el jugador está en partida
        if in_game is None:
            in_game = False  # Asumir que no está en partida si hay un error

        updated_players.append({**player, "elo": elo, "in_game": in_game})

    # Filtrar jugadores sin ELO y ordenar por LP
    ranking = [p for p in updated_players if p['elo']]
    ranking.sort(key=lambda x: x['elo']['leaguePoints'], reverse=True)

    # Guardar el ranking actualizado en un archivo JSON
    with open('ranking.json', 'w') as f:
        json.dump(ranking, f, indent=2)
    print('Ranking actualizado!')

# Programar la tarea de actualización cada 5 minutos
scheduler = BackgroundScheduler()
scheduler.add_job(update_ranking, 'interval', minutes=5)
scheduler.start()

@app.route('/ranking', methods=['GET'])
def get_ranking():
    try:
        with open('ranking.json', 'r') as f:
            data = json.load(f)
            return jsonify(data)
    except Exception as e:
        return jsonify({"error": "Error al leer el archivo"}), 500

if __name__ == '__main__':
    update_ranking()  # Actualizar el ranking inmediatamente al iniciar el servidor
    app.run()
