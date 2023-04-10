import { useToast, FlatList } from 'native-base';
import { Share } from "react-native";
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {

  const [ isLoading, setIsLoading ] = useState(true)
  const [ games, setGames ] = useState<GameProps[]>([])
  const [ firstTeamPoints, setFirstTeamPoints ] = useState('')
  const [ secondTeamPoints, setSecondTeamPoints ] = useState('')

  const toast = useToast()

  async function fetchGames(){
    try {
      setIsLoading(true)
      const response = await api.get(`/pools/${poolId}/games`)
      setGames(response.data.games)

    } catch (error) {
        console.log(error)

        toast.show({
            title: 'Opa! ocorreu algum erro durante o carregamento dos palpites.',
            placement: 'top',
            bgColor: 'red.500',
        })
        
    } finally {
        setIsLoading(false)
    }
  }

  async function handleGuessConfirm (gameId: string){
    try {

      if( !firstTeamPoints.trim() || !secondTeamPoints.trim() ){
        return toast.show({
          title: 'Opa! Você precisa informar o placar de ambos os times para prosseguir com o palpite.',
          placement: 'top',
          bgColor: 'red.500',
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      })

      toast.show({
        title: 'Você realizou o palpite. Boa sorte!',
        placement: 'top',
        bgColor: 'green.500',
      })

      fetchGames()

    } catch (error) {
      console.log(error)

      if (error.response?.data?.message === "You can't send guesses after the game date." ){
        return (
            toast.show({
                title: 'Opa! Você não pode enviar um palpite após o início do jogo.',
                placement: 'top',
                bgColor: 'red.500',
            })
        )
      }

      toast.show({
          title: 'Opa! ocorreu algum erro durante o envio do palpite.',
          placement: 'top',
          bgColor: 'red.500',
      })
    }
  }

  useEffect(() => {
    fetchGames()
  }, [poolId])

  if(isLoading){
    return <Loading />
  }

  async function handleCodeShare(){
    await Share.share({
        message: code
    })
}

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pt: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} onShare={handleCodeShare} /> }
    />
  );
}
