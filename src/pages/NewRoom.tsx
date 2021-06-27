import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration1.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import '../styles/auth.scss';

export function NewRoom() {
    const { user } = useAuth()
    const history = useHistory()

    const {theme, toggleTheme} = useTheme()

    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
      event.preventDefault();

      if (newRoom.trim() === '') {
          return;
      }

      const roomRef = database.ref('rooms');

      const firebaseRoom = await roomRef.push({
          title: newRoom,
          authorId: user?.id,
      })

      history.push(`/rooms/${firebaseRoom.key}`)
    }

    return (
      <div id="page-auth" className={theme}>
          <aside>
              <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
              <strong>Crie salas de Q&amp;A ao vivo </strong>
              <p>Utilize seus conhecimentos para transformar vidas de milhares de pessoas, respondendo ou criando perguntas :) </p>
          </aside>
          <main>
              <div className="main-content">
              <label className="switch">
                    <input type="checkbox" onClick={toggleTheme} />
                    <span className="slider rounded" />
                </label>

                  <img src={logoImg} alt="Letmeask" />
                  <h2>Criar uma nova sala</h2>
    
                  <div className="separator">ou entre em uma sala</div>
                  <form onSubmit={handleCreateRoom}>
                      <input 
                      type="text"
                      placeholder="Nome da sala"
                      onChange={event => setNewRoom(event.target.value)}
                      value={newRoom}
                      />
                      <Button type="submit">
                          Criar sala
                      </Button>
                  </form>
                  <p>
                      Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                  </p>
              </div>
          </main>
      </div>
    )
}