# Currency Converter

## Trabalho 02 - Programação Funcional

# Como usar
- Requisitos:
    - Node: v20.17.0

- Inicializando o projeto:
    - Clone o repositório e execute linha a linha:
    ```bash	
    > git clone {url}
    > npm install
    > npm start
    ``` 
- Acesse o projeto em: http://localhost:4200/

## Funcionamento
- O principal do conversor esta no arquivo `src/app/services/awesomeapi-moedas.ts` responsavel por requisitar a cotação e fazer a listagem das moedas disponiveis.
  - A api utilizada foi a [awesomeapi](https://docs.awesomeapi.com.br/api-de-moedas)
  - Nessa classe é utizada alguns conceitos de programção funcional como `map`, `filter` para manipular os dados recebidos da api.
- O arquivo `src/app/view/converter/converter.component.ts` é o componente responsavel por montar a tela e os comportamentos da conversão das moedas.
  - Nesse arquivo é utilizado o conceito de `subscribe` para receber os dados da api e alem disso tambem possui alguns conceitos de programação funcional .
