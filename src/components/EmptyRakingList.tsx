import { Text } from 'native-base';

export function EmptyRakingList() {
  return (
    <Text color="white" mt={4} fontSize="sm" textAlign="center">
      O ranking desse bolão ainda não foi {'\n'} 
      formado, aguarde os resultados.
    </Text>
  );
}