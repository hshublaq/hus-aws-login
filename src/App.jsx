import logo from './logo.svg';
import './App.css';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listSongs } from './graphql/queries';
import {updateSong} from './graphql/mutations';
import { useState, useEffect } from 'react';
import { Paper, IconButton } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';


Amplify.configure(awsconfig);

function App() {
  
  const [songs, setSongs] = useState([]);

  useEffect( () => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const songData = await API.graphql(graphqlOperation(listSongs));
      const songList = songData.data.listSongs.items;
      console.log('song list', songList);
      setSongs(songList);

    } catch (error) {
      console.log('error on fetching songs', error);
    }
  }

  const addLike = async (idx) => {
    try {
      const song = songs[idx];
      song.like = song.like + 1;
      delete song.createdAt;
      delete song.updatedAt;

      const songData = await API.graphql(graphqlOperation(updateSong, {input: song}));
      const songList = [...songs];
      songList[idx] = songData.data.updateSong;
      setSongs(songList);

    } catch (error) {
      console.log('error on fetching songs', error);
    }
  }

  return (
    <div class="App">
      <header class="App-header">
        <h2> My Songs Playlist </h2>
        <AmplifySignOut />
      </header>
      <div className="songList">
        {songs.map((song, idx) => {
          return (
            <paper variant="outlined" elevation={3} key={`song${idx}`}>
              <div class="songCard">
                <IconButton aria-label="play">
                  <PlayCircleFilledIcon />
                </IconButton>
                <div class="songTitle">
                  {song.title}
                </div>
                <div class="songOwner">
                  {song.owner}
                </div>
                <div>
                  <IconButton aria-label="like" onClick={() => addLike(idx)}>
                    <ThumbUpIcon />
                  </IconButton>
                  {song.like}
                </div>
                <div class="songDescription">
                  {song.description}
                </div>
              </div>
            </paper>
          )
        })
        }
      </div>
    </div>
  );
}

export default withAuthenticator(App);
