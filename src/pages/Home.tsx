import { useHistory } from 'react-router-dom';
import { FormEvent, useState  } from 'react';

import { FiLogIn } from 'react-icons/fi';

import illustrationImg from '../assets/images/illustration4.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { database } from '../services/firebase';

import { Button } from '../components/Button';


import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';


export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth()

    const {theme, toggleTheme} = useTheme()

    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if(!user) {
          await signInWithGoogle()
        }

      history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if(roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            alert('Room does not exists');
            return;
        }

        if (!roomRef.val().endedAt) {
            alert('Room already closed.');
            return;
        }

        history.push(`/rooms/${roomCode}`);
    }

    return (
      <div id="page-auth" className={theme}>
          <aside>
              <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
              <strong>Toda pergunta tem uma resposta. </strong>
              <p>Aprenda e compartilhe conhecimento com outras pessoas </p>
          </aside>
          <main>
              <div className="main-content">
              <label className="switch">
                    <input type="checkbox" onClick={toggleTheme} />
                    <span className="slider rounded" />
                </label>
              
                  <img src={logoImg} alt="Letmeask" />
                  <button onClick={handleCreateRoom} className="create-room">
                      <img src={googleIconImg} alt="Logo do Google" />
                      Crie sua sala com o Google
                  </button>

                  <div className="separator">
                  
                ou entre em uma sala</div>
                  <form onSubmit={handleJoinRoom}>
                      <input 
                      type="text"
                      placeholder="Digite o código da sala"
                      onChange={event => setRoomCode(event.target.value)}
                      value={roomCode}
                      />
                      <Button type="submit">
                         <FiLogIn />
                       Entrar na sala
                      </Button>
                  </form>
              </div>
          </main>
      </div>
    )
}