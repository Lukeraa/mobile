import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { HStack, VStack, useToast } from "native-base";
import { api } from "../services/api";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Share } from "react-native";
import { Guesses } from "../components/Guesses";
import { EmptyRakingList } from "../components/EmptyRakingList";

export interface RouteParams {
    id: string
}

export function Details(){

    const [ optionSelected, setOptionSelected ] = useState<'guesses' | 'ranking'>('guesses')
    const [isLoading, setIsLoading] = useState(false)
    const [ poolDetails, setPoolDetails ] = useState<PoolCardProps>({} as PoolCardProps) 
    
    const route = useRoute()
    const toast = useToast()
    
    const { id } = route.params as RouteParams;

    async function fetchPoolDetails(){

        try {
            setIsLoading(true)
            const response = await api.get(`/pools/${ id }`)
            setPoolDetails(response.data.pool)

        } catch (error) {
            console.log(error)

            toast.show({
                title: 'Opa! ocorreu algum erro durante o detalhamento do bolão.',
                placement: 'top',
                bgColor: 'red.500',
            })
            
        } finally {
            setIsLoading(false)
        }
    }

    async function handleCodeShare(){
        await Share.share({
            message: poolDetails.code
        })
    }

    useEffect(() => {
        fetchPoolDetails()
    }, [id])

    if(isLoading){
        return (
            <Loading />
        )
    }

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title={poolDetails.title} showBackButton showShareButton onShare={handleCodeShare}/>

            {
                poolDetails._count?.participants > 0 ?
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails} />

                    <HStack bgColor='gray.800' p={1} rounded='sm'>
                        <Option
                            title="Seus palpites"
                            isSelected={optionSelected === 'guesses'} 
                            onPress={() => setOptionSelected('guesses')}
                        />
                        <Option
                            title="Ranking do grupo"
                            isSelected={optionSelected === 'ranking'} 
                            onPress={() => setOptionSelected('ranking')}
                        />
                    </HStack>

                    { 
                        optionSelected === 'guesses'? 

                        <Guesses poolId={poolDetails.id} code={poolDetails.code}/>

                        : <EmptyRakingList />

                    }

                </VStack>

                : <EmptyMyPoolList code={poolDetails.code} onShare={handleCodeShare}/>
            }

        </VStack>
    )
}



