import { useState } from "react";
import { Center, VStack, Heading, useToast } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {

    const [ isLoading, setIsLoading ] = useState(false)
    const [ code, setCode ] = useState('')
    const { navigate } = useNavigation()
    const toast = useToast()

    async function handleJoinPool(){


        try {

            setIsLoading(true)
            if(!code.trim()){
                return (
                    toast.show({
                        title: 'Opa! Digite um código para prosseguir.',
                        placement: 'top',
                        bgColor: 'red.500',
                    })
                )
            }

            setCode(code.toUpperCase())

            await api.post('/pools/join', { code })
            toast.show({
                title: 'Bolão encontrado! Você está no jogo.',
                placement: 'top',
                bgColor: 'green.500',
            })
            setIsLoading(false)
            navigate('pools')

        } catch (error) {
            console.log(error)
            setIsLoading(false)

            if (error.response?.data?.message === 'Pool not found' ){
                return (
                    toast.show({
                        title: 'Opa! bolão não encontrado.',
                        placement: 'top',
                        bgColor: 'red.500',
                    })
                )
            }

            if (error.response?.data?.message === 'You already joined this pool.' ){
                return (
                    toast.show({
                        title: 'Opa! Você já está nesse bolão.',
                        placement: 'top',
                        bgColor: 'red.500',
                    })
                )
            }

            toast.show({
                title: 'Opa! ocorreu algum erro durante a busca pelo bolão.',
                placement: 'top',
                bgColor: 'red.500',
            })

        }

    }

    return (
        <VStack flex={1} bg="gray.900">
            <Header title="Buscar por código" onShare={() => {}} showBackButton/>
            <Center mt={2} mx={5}>
                <Heading
                    color="white"
                    fontFamily="heading"
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="xl"
                    mt={8}
                >
                    Encontre um bolão através de seu código único
                </Heading>

                <Input
                    mt={8}
                    placeholder="Qual o código do bolão?"
                    autoCapitalize="characters"
                    onChangeText={event => setCode(event.toUpperCase())}
                    value={code}
                />

                <Button
                    title="BUSCAR BOLÃO"
                    mt={2}
                    isLoading={isLoading}
                    onPress={handleJoinPool}
                />

            </Center>

        </VStack>
    )
}
