# HSE Blockchain Lab. Homework 3

Author: Alexey Perevyshin

# ДЗ-4 "Взаимодействие со СмК"

## Предварительная настройка

Для работы с клиентом потребуются следующие параметры в файле `client_python/.env`

```
* INFURA_API_KEY — API токен для взаимодействия с infura
* CONTRACT_ADDRESS — адрес контракта, с которым будут производиться операции
* PRIVATE_KEY — приватный ключ аккаунта, который может взаимодействовать со смартконтрактом
```

Для работы с `abi` смартконтракта используется файл, созданный при помощи `hardhat` и хранящийся по такому пути `artifacts/contracts/HSEToken.sol/HSEToken.json`. Для удобства он также добавлен в папку `client_python`.

## Пример использования

Для запуска клиента используется такая команда:
```
python3 ./client_python/client.py
```

Дальше взаимодействие происходит при помощи написания команды, которую мы хотим выполнить, а также параметров для ее выполнения.

Пример взаимодействия (ответы программы выводятся с `>` в начале ответа)

```
set 1 Alex 10 True
> Set transaction: https://goerli.etherscan.io/tx/0xf4579d2334419fb36a182d4e6adbeff26dde135b17ac55f59ab6ac15c963a234
get 1
> Get result. Name: Alex, mark: 10, isLanguageJS: True
set 2 Alex 100 True
> Set transaction: https://goerli.etherscan.io/tx/0x29d8f22f653e5f1f3fd97d26907d7289812fdebc699eab1830992e9de1661f7a
get 2
> Get result. Name: Alex, mark: 100, isLanguageJS: True
delete 2
> Delete transaction: https://goerli.etherscan.io/tx/0xf63534fa33301434a2671ec69ead75391e3fc7d5e66f437eb57106a546be44b3
get 2
> Get result. Name: , mark: 0, isLanguageJS: False

```