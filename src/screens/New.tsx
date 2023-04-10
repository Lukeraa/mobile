import { useState } from 'react'
import { Center, VStack, Text, Heading, useToast, Toast } from "native-base";

import Logo from "../assets/logo.svg";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from '../services/api';

export function New() {

    const [ title, setTitle ] = useState('')
    const [ isLoading, setIsLoading ] = useState(false)

    const toast = useToast()

    async function handlePoolCreate() {
        if( !title.trim() ) {
            return toast.show({
                title: 'Opa! O bolão precisa ter um nome.',
                placement: 'top',
                bgColor: 'red.500',
            })
        }

        try {

            setIsLoading(true)

            await api.post('/pools', { title })

            toast.show({
                title: 'Bolão criado com sucesso!',
                placement: 'top',
                bgColor: 'green.500',
            })

            setTitle('')
            
        } catch(error) {

            console.log(error)

            toast.show({
                title: 'Opa! ocorreu algum erro durante a crição do bolão.',
                placement: 'top',
                bgColor: 'red.500',
            })

        } finally {
            setIsLoading(false)
        }

    }

    return (
        <VStack flex={1} bg="gray.900">
            <Header title="Criar novo bolão" onShare={() => {}} />
            <Center mt={8} mx={5}>
                <Logo width={133} height={24} />
                <Heading
                    color="white"
                    fontFamily="heading"
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="xl"
                    my={8}
                >
                    Crie seu próprio bolão da copa {"\n"}e compartilhe entre amigos!
                </Heading>

                <Input
                    placeholder="Qual nome do seu bolão?"
                    onChangeText={ setTitle }
                    value={ title }
                />

                <Button
                    title="CRIAR MEU BOLÃO"
                    mt={2}
                    onPress={handlePoolCreate}
                    isLoading={ isLoading }
                />

                <Text
                    color="gray.200"
                    textAlign="center"
                    fontSize="sm"
                    mt={4}
                >
                    Após criar seu bolão, você receberá um{'\n'} 
                    código único que poderá usar para convidar{'\n'} outras pessoas.
                </Text>

            </Center>

        </VStack>
    )
}
